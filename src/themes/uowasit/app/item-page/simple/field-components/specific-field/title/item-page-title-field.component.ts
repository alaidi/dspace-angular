import { Component } from '@angular/core';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { TranslateModule } from '@ngx-translate/core';

import { ItemPageTitleFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/title/item-page-title-field.component';
import { MetadataDirective } from '../../../../../../../../app/shared/metadata.directive';

/**
 * Bilingual title: dc.title (the thesis's original title, usually Arabic) is always the
 * main heading, with the translated title (dc.title.alternative / other language) underneath.
 * Not switched by UI language: Google Scholar checks the heading against the citation_title
 * meta tag and the PDF title page, which both carry dc.title.
 */
@Component({
  selector: 'ds-themed-item-page-title-field',
  templateUrl: './item-page-title-field.component.html',
  imports: [
    MetadataDirective,
    TranslateModule,
  ],
})
export class ItemPageTitleFieldComponent extends BaseComponent {

  altMetadata: MetadataValue;

  override ngOnInit(): void {
    const all = [
      ...this.item.allMetadata('dc.title'),
      ...this.item.allMetadata('dc.title.alternative'),
    ];
    const main = all[0];

    if (main) {
      this.nameMetadata = main;
      this.altMetadata = all.find((t) => t !== main && t.language !== main.language);
    } else {
      // No dc.title at all: keep the stock behavior (DSONameService fallbacks).
      super.ngOnInit();
    }
  }
}
