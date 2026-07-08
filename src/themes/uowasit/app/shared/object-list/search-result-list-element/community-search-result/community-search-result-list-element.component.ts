import { NgClass } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Community } from '@dspace/core/shared/community.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { DSONameService } from '../../../../../../../app/core/breadcrumbs/dso-name.service';
import { MetadataDirective } from '../../../../../../../app/shared/metadata.directive';
import { ThemedBadgesComponent } from '../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { listableObjectComponent } from '../../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { SearchResultListElementComponent } from '../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component';
import { LocaleAwareDSONameService } from '../../../locale-aware-dso-name.service';

@Component({
  selector: 'ds-community-search-result-list-element',
  styleUrls: [
    '../../../../../../../app/shared/object-list/search-result-list-element/search-result-list-element.component.scss',
    '../../../../../../../app/shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component.scss',
  ],
  templateUrl: '../../../../../../../app/shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component.html',
  imports: [
    MetadataDirective,
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

  ngOnInit(): void {
    super.ngOnInit();
    this.showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
  }
}
