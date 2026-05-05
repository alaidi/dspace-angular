import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '../../../../app/core/shared/dspace-object.model';
import { Metadata } from '../../../../app/core/shared/metadata.utils';
/**
 * Locale-aware override of DSONameService.
 * Returns dc.title matching the current UI language, with fallback to default.
 */
@Injectable()
export class LocaleAwareDSONameService extends DSONameService {

  constructor(private translate: TranslateService) {
    super(translate);
  }

  override getName(dso: DSpaceObject | undefined, escapeHTML?: boolean): string {
    if (!dso) {
      return '';
    }

    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'en';

    // Try to find dc.title matching current language
    const localizedTitle = this.getLocalizedTitle(dso, currentLang, escapeHTML);
    if (localizedTitle) {
      return localizedTitle;
    }

    // Fallback to base behavior
    return super.getName(dso, escapeHTML);
  }

  /**
   * Override getHitHighlights so search results also show localized titles.
   * Falls back to base if no localized title found.
   */
  override getHitHighlights(object: any, dso: DSpaceObject, escapeHTML?: boolean): string {
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'en';

    // If not default language, prefer localized title over hit highlights
    if (currentLang !== 'en') {
      const localizedTitle = this.getLocalizedTitle(dso, currentLang, escapeHTML);
      if (localizedTitle) {
        return localizedTitle;
      }
    }

    // Fallback to base hit highlight behavior
    return super.getHitHighlights(object, dso, escapeHTML);
  }

  private getLocalizedTitle(dso: DSpaceObject, lang: string, escapeHTML?: boolean): string | undefined {
    // Try exact match first (e.g. 'ar')
    let value = dso.firstMetadataValue('dc.title', { language: lang }, escapeHTML);
    if (value) {
      return value;
    }

    // Try with region variants (e.g. 'en' -> 'en_US', 'ar' -> 'ar_IQ')
    const allTitles = Metadata.all(dso.metadata, 'dc.title');
    for (const md of allTitles) {
      if (md.language && md.language.startsWith(lang)) {
        return escapeHTML ? md.value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : md.value;
      }
    }

    return undefined;
  }
}
