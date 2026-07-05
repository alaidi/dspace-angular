import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { GuideComponent } from './guide.component';

/**
 * Themed wrapper for GuideComponent
 */
@Component({
  selector: 'ds-guide',
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedGuideComponent extends ThemedComponent<GuideComponent> {
  protected getComponentName(): string {
    return 'GuideComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/guide/guide.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./guide.component`);
  }

}
