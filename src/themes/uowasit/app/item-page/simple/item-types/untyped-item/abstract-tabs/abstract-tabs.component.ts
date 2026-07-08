import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { TranslateModule } from '@ngx-translate/core';

import { MarkdownDirective } from '../../../../../../../../app/shared/utils/markdown.directive';

/**
 * Renders dc.description.abstract with EN/AR tabs when abstracts exist
 * in both languages; otherwise a single plain block (dir="auto").
 */
@Component({
  selector: 'ds-uowasit-abstract-tabs',
  templateUrl: './abstract-tabs.component.html',
  styleUrls: ['./abstract-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MarkdownDirective,
    TranslateModule,
  ],
})
export class AbstractTabsComponent {

  @Input() item: Item;

  activeTab: 'en' | 'ar' = 'en';

  get englishAbstract(): string {
    return this.join(this.valuesFor(/^en/i).concat(this.valuesFor(/^$/)));
  }

  get arabicAbstract(): string {
    return this.join(this.valuesFor(/^ar/i));
  }

  get hasBoth(): boolean {
    return !!this.englishAbstract && !!this.arabicAbstract;
  }

  get hasAny(): boolean {
    return !!this.englishAbstract || !!this.arabicAbstract;
  }

  /** Single abstract to render when only one language (or no language) is present. */
  get singleAbstract(): { text: string; dir: 'ltr' | 'rtl' } {
    if (this.arabicAbstract && !this.englishAbstract) {
      return { text: this.arabicAbstract, dir: 'rtl' };
    }
    // default to English (incl. unspecified language) → dir="auto" in template
    return { text: this.englishAbstract, dir: 'ltr' };
  }

  setTab(tab: 'en' | 'ar'): void {
    this.activeTab = tab;
  }

  private valuesFor(langRegex: RegExp): string[] {
    if (!this.item) {
      return [];
    }
    return this.item.allMetadata('dc.description.abstract')
      .filter((md: MetadataValue) => langRegex.test(md.language ?? ''))
      .map((md: MetadataValue) => md.value)
      .filter((v: string) => !!v);
  }

  private join(values: string[]): string {
    return values.join('\n\n').trim();
  }
}
