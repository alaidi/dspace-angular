import {
  AsyncPipe,
  SlicePipe,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Context } from '@dspace/core/shared/context.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslatePipe } from '@ngx-translate/core';

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
  /**
   * True when the primary title is Arabic, so the whole card flows RTL.
   */
  isRtlTitle = false;

  ngOnInit(): void {
    super.ngOnInit();
    this.isRtlTitle = (this.dsoTitle?.language ?? '').toLowerCase().startsWith('ar');
  }
}
