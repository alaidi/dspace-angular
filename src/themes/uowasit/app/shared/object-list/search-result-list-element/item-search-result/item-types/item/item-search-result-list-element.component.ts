import {
  AsyncPipe,
  SlicePipe,
} from '@angular/common';
import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Context } from '@dspace/core/shared/context.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';

import { MetadataDirective } from '../../../../../../../../../app/shared/metadata.directive';
import { MetadataLinkViewComponent } from '../../../../../../../../../app/shared/metadata-link-view/metadata-link-view.component';
import { listableObjectComponent } from '../../../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { ItemSearchResultListElementComponent as BaseComponent } from '../../../../../../../../../app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { TruncatableComponent } from '../../../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.Any, 'uowasit')
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.Any, 'uowasit')
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html',
  imports: [
    AsyncPipe,
    MetadataDirective,
    MetadataLinkViewComponent,
    RouterLink,
    SlicePipe,
    TranslatePipe,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class ItemSearchResultListElementComponent extends BaseComponent implements OnInit {
  private translate = inject(TranslateService);

  /**
   * True when the primary title is Arabic, so the whole card flows RTL.
   */
  isRtlTitle = false;

  ngOnInit(): void {
    super.ngOnInit();
    this.isRtlTitle = (this.dsoTitle?.language ?? '').toLowerCase().startsWith('ar');
  }

  /**
   * Abstract matching the current UI language: Arabic lives in dc.description.abstract,
   * English in the custom dc.description.abstractenglish. Falls back to whatever exists.
   */
  get localizedAbstract(): MetadataValue | undefined {
    const lang = this.translate.getCurrentLang() || 'en';
    const all = [
      ...this.dso.allMetadata('dc.description.abstract'),
      ...this.dso.allMetadata('dc.description.abstractenglish'),
    ];
    return all.find((m) => (m.language ?? '').startsWith(lang)) ?? all[0];
  }
}
