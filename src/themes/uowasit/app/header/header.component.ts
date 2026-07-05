import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ThemedLangSwitchComponent } from 'src/app/shared/lang-switch/themed-lang-switch.component';

import { ContextHelpToggleComponent } from '../../../../app/header/context-help-toggle/context-help-toggle.component';
import { HeaderComponent as BaseComponent } from '../../../../app/header/header.component';
import { ThemedNavbarComponent } from '../../../../app/navbar/themed-navbar.component';
import { ThemedSearchNavbarComponent } from '../../../../app/search-navbar/themed-search-navbar.component';
import { HostWindowService } from '../../../../app/shared/host-window.service';
import { ImpersonateNavbarComponent } from '../../../../app/shared/impersonate-navbar/impersonate-navbar.component';
import { ThemedAuthNavMenuComponent } from '../../../../app/shared/auth-nav-menu/themed-auth-nav-menu.component';
import { MenuService } from '../../../../app/shared/menu/menu.service';

@Component({
  selector: 'ds-themed-header',
  styleUrls: ['../../../../themes/uowasit/app/header/header.component.scss'],
  templateUrl: '../../../../themes/uowasit/app/header/header.component.html',
  imports: [
    AsyncPipe,
    ContextHelpToggleComponent,
    ImpersonateNavbarComponent,
    NgbDropdownModule,
    RouterLink,
    ThemedAuthNavMenuComponent,
    ThemedLangSwitchComponent,
    ThemedNavbarComponent,
    ThemedSearchNavbarComponent,
    TranslateModule,
  ],
})
export class HeaderComponent extends BaseComponent {
  constructor(
    protected menuService: MenuService,
    protected windowService: HostWindowService,
    protected translate: TranslateService,
  ) {
    super(menuService, windowService);
  }

  get logoSrc(): string {
    return this.translate.currentLang === 'ar'
      ? 'assets/uowasit/images/logo-uowasit.png'
      : 'assets/uowasit/images/logo.png';
  }
}
