import { CdkTreeModule } from '@angular/cdk/tree';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CommunityListComponent as BaseComponent } from '../../../../../app/community-list-page/community-list/community-list.component';
import { DSONameService } from '../../../../../app/core/breadcrumbs/dso-name.service';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TruncatableComponent } from '../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';
import { LocaleAwareDSONameService } from '../../shared/locale-aware-dso-name.service';

@Component({
  selector: 'ds-themed-community-list',
  templateUrl: '../../../../../app/community-list-page/community-list/community-list.component.html',
  imports: [
    AsyncPipe,
    CdkTreeModule,
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
  providers: [
    { provide: DSONameService, useClass: LocaleAwareDSONameService },
  ],
})
export class CommunityListComponent extends BaseComponent {
}
