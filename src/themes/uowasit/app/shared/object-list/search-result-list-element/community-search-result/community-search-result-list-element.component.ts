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
import { Community } from '@dspace/core/shared/community.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { DSONameService } from '../../../../../../../app/core/breadcrumbs/dso-name.service';
import { ThemedBadgesComponent } from '../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component';
import { LocaleAwareDSONameService } from '../../../../shared/locale-aware-dso-name.service';
import { TruncatableService } from '../../../../../../../app/shared/truncatable/truncatable.service';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: [
    '../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component.scss',
    '../../../../../../../app/shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component.scss',
  ],
  templateUrl: '../../../../../../../app/shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component.html',
  imports: [
    NgClass,
    RouterLink,
    ThemedBadgesComponent,
  ],
  providers: [
    { provide: DSONameService, useClass: LocaleAwareDSONameService },
  ],
})
@listableObjectComponent(CommunitySearchResult, ViewMode.ListElement, undefined, 'custom')
export class CommunitySearchResultListElementComponent extends SearchResultListElementComponent<CommunitySearchResult, Community> implements OnInit {
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
