import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Community } from '@dspace/core/shared/community.model';
import { Context } from '@dspace/core/shared/context.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { DSONameService } from '../../../../../../app/core/breadcrumbs/dso-name.service';
import { listableObjectComponent } from '../../../../../../app/shared/object-collection/shared/listable-object/listable-object.decorator';
import { CommunityListElementComponent as BaseComponent } from '../../../../../../app/shared/object-list/community-list-element/community-list-element.component';
import { LocaleAwareDSONameService } from '../../locale-aware-dso-name.service';

@Component({
  selector: 'ds-community-list-element',
  // styleUrls: ['./community-list-element.component.scss'],
  styleUrls: ['../../../../../../app/shared/object-list/community-list-element/community-list-element.component.scss'],
  // templateUrl: './community-list-element.component.html'
  templateUrl: '../../../../../../app/shared/object-list/community-list-element/community-list-element.component.html',
  imports: [
    RouterLink,
  ],
  providers: [
    { provide: DSONameService, useClass: LocaleAwareDSONameService },
  ],
})
@listableObjectComponent(Community, ViewMode.ListElement, Context.Any, 'custom')
export class CommunityListElementComponent extends BaseComponent {
}
