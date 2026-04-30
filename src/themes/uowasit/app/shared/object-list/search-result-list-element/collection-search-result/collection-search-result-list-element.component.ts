import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Collection } from '@dspace/core/shared/collection.model';
import { CollectionSearchResult } from '@dspace/core/shared/object-collection/collection-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { DSONameService } from '../../../../../../../app/core/breadcrumbs/dso-name.service';
import { ThemedBadgesComponent } from '../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component';
import { LocaleAwareDSONameService } from '../../../../shared/locale-aware-dso-name.service';
import { TruncatableService } from '../../../../../../../app/shared/truncatable/truncatable.service';

@Component({
  selector: 'ds-collection-search-result-list-element',
  styleUrls: [
    '../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component.scss',
    '../../../../../../../app/shared/object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component.scss',
  ],
  templateUrl: '../../../../../../../app/shared/object-list/search-result-list-element/collection-search-result/collection-search-result-list-element.component.html',
  imports: [
    NgClass,
    RouterLink,
    ThemedBadgesComponent,
  ],
  providers: [
    { provide: DSONameService, useClass: LocaleAwareDSONameService },
  ],
})
@listableObjectComponent(CollectionSearchResult, ViewMode.ListElement, undefined, 'custom')
export class CollectionSearchResultListElementComponent extends SearchResultListElementComponent<CollectionSearchResult, Collection> implements OnInit {
  showThumbnails: boolean;

  constructor(
    protected truncatableService: TruncatableService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
  }
}
