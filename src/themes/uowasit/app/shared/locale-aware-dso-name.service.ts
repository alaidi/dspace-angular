import { Injectable } from '@angular/core';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { TranslateService } from '@ngx-translate/core';

import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '../../../../app/core/shared/dspace-object.model';
import { Metadata } from '../../../../app/core/shared/metadata.utils';

/**
 * Locale-aware override of DSONameService.
 * In this repository the Arabic title lives in dc.title (lang "ar") and the
 * English one in dc.title.alternative (lang "en") for items. Communities and
 * collections instead keep their English label in the object's `name` while
 * dc.title holds only the Arabic one. Pick the label matching the current UI
 * language for names, breadcrumbs and search-result hit highlights, falling
 * back to the default behaviour when there is no localized label.
 */
@Injectable()
export class LocaleAwareDSONameService extends DSONameService {

  /** Render types with their own name factory in the base service — leave those untouched. */
  private static readonly ENTITY_TYPES = ['Person', 'OrgUnit', 'EPerson'];

  constructor(private translate: TranslateService) {
    super(translate);
  }

  override getName(dso: DSpaceObject | undefined, escapeHTML?: boolean): string {
    if (!dso) {
      return '';
    }
    const label = this.localizedLabel(dso);
    if (label) {
      return escapeHTML ? this.escape(label.value) : label.value;
    }
    return super.getName(dso, escapeHTML);
  }

  /**
   * Override getHitHighlights so search results / cards also show localized
   * labels. Loses query highlighting on the localized title (acceptable), but
   * preserves the language so the card can flow RTL for Arabic.
   */
  override getHitHighlights(object: any, dso: DSpaceObject, escapeHTML?: boolean): MetadataValue {
    const label = this.localizedLabel(dso);
    if (label) {
      return Object.assign(new MetadataValue(), {
        value: escapeHTML ? this.escape(label.value) : label.value,
        language: label.language,
      });
    }
    return super.getHitHighlights(object, dso, escapeHTML);
  }

  /**
   * The label to show for the current UI language, or undefined to defer to the
   * base service. Items carry both languages as dc.title (ar) + dc.title.alternative
   * (en); communities/collections carry only Arabic dc.title, with the English label
   * in dso.name — so in English fall back to that name.
   */
  private localizedLabel(dso: DSpaceObject): { value: string, language: string } | undefined {
    const title = this.getLocalizedTitle(dso);
    if (title) {
      return { value: title.value, language: title.language };
    }
    // Reading .name here is the low-level access this service is meant to wrap
    // (the base Default factory does the same), hence the deprecation is expected.
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const name = dso.name;
    const arTitle = dso.firstMetadataValue('dc.title');
    // Only prefer dso.name when it is a genuinely distinct English label (communities
    // /collections). For an item whose name IS the Arabic dc.title, defer to the base
    // so it stays tagged "ar" and renders RTL.
    if (this.currentLang().startsWith('en') && !this.hasEntityName(dso) && name && name !== arTitle) {
      return { value: name, language: 'en' };
    }
    return undefined;
  }

  /** dc.title / dc.title.alternative matching the current UI language, or undefined. */
  private getLocalizedTitle(dso: DSpaceObject): MetadataValue | undefined {
    const lang = this.currentLang();
    const titles = [
      ...Metadata.all(dso.metadata, 'dc.title'),
      ...Metadata.all(dso.metadata, 'dc.title.alternative'),
    ];
    return titles.find((t) => (t.language ?? '').startsWith(lang));
  }

  private currentLang(): string {
    return this.translate.getCurrentLang() || this.translate.getFallbackLang() || 'en';
  }

  /** True when the base service builds the name from entity fields (person/org), not dc.title. */
  private hasEntityName(dso: DSpaceObject): boolean {
    return dso.getRenderTypes()
      .filter((type): type is string => typeof type === 'string')
      .some((type) => LocaleAwareDSONameService.ENTITY_TYPES.includes(type));
  }

  private escape(value: string): string {
    return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
