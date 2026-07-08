import { Component } from '@angular/core';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { ItemPageTitleFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/title/item-page-title-field.component';
import { MetadataDirective } from '../../../../../../../../app/shared/metadata.directive';

/**
 * Bilingual title: in this repository the Arabic title lives in dc.title
 * and the English one in dc.title.alternative (lang "en"). Show the title
 * matching the UI language as the main heading and the other one underneath.
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

  constructor(
    dsoNameService: DSONameService,
    private translate: TranslateService,
  ) {
    super(dsoNameService);
  }

  override ngOnInit(): void {
    const all = [
      ...this.item.allMetadata('dc.title'),
      ...this.item.allMetadata('dc.title.alternative'),
    ];
    const arTitle = all.find((t) => (t.language ?? '').startsWith('ar'))
      ?? all.find((t) => !t.language);
    const enTitle = all.find((t) => (t.language ?? '').startsWith('en'));

    const preferArabic = this.translate.getCurrentLang()?.startsWith('ar');
    const main = (preferArabic ? arTitle : enTitle) ?? arTitle ?? enTitle ?? all[0];

    if (main) {
      this.nameMetadata = main;
      this.altMetadata = main === arTitle ? enTitle : arTitle;
    } else {
      // No dc.title at all: keep the stock behavior (DSONameService fallbacks).
      super.ngOnInit();
    }
  }
}
