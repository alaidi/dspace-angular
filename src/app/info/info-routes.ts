import {
  Route,
  Routes,
} from '@angular/router';
import { i18nBreadcrumbResolver } from '@dspace/core/breadcrumbs/i18n-breadcrumb.resolver';
import { notifyInfoGuard } from '@dspace/core/coar-notify/notify-info/notify-info.guard';
import { feedbackGuard } from '@dspace/core/feedback/feedback.guard';
import {
  ABOUT_PATH,
  ACCESSIBILITY_SETTINGS_PATH,
  COAR_NOTIFY_SUPPORT,
  END_USER_AGREEMENT_PATH,
  FEEDBACK_PATH,
  GUIDE_PATH,
  PRIVACY_PATH,
} from '@dspace/core/router/info-routing-paths';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { environment } from '../../environments/environment';
import { AccessibilitySettingsComponent } from './accessibility-settings/accessibility-settings.component';
import { ThemedAboutComponent } from './about/themed-about.component';
import { ThemedEndUserAgreementComponent } from './end-user-agreement/themed-end-user-agreement.component';
import { ThemedFeedbackComponent } from './feedback/themed-feedback.component';
import { ThemedGuideComponent } from './guide/themed-guide.component';
import { NotifyInfoComponent } from './notify-info/notify-info.component';
import { ThemedPrivacyComponent } from './privacy/themed-privacy.component';


export const ROUTES: Routes = [
  {
    path: FEEDBACK_PATH,
    component: ThemedFeedbackComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.feedback.title', breadcrumbKey: 'info.feedback' },
    canActivate: [feedbackGuard],
  },
  {
    path: ACCESSIBILITY_SETTINGS_PATH,
    component: AccessibilitySettingsComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.accessibility-settings.title', breadcrumbKey: 'info.accessibility-settings' },
  },
  {
    path: GUIDE_PATH,
    component: ThemedGuideComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.guide.title', breadcrumbKey: 'info.guide' },
  },
  {
    path: ABOUT_PATH,
    component: ThemedAboutComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.about.title', breadcrumbKey: 'info.about' },
  },
  environment.info.enableEndUserAgreement ? {
    path: END_USER_AGREEMENT_PATH,
    component: ThemedEndUserAgreementComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.end-user-agreement.title', breadcrumbKey: 'info.end-user-agreement' },
  } : undefined,
  environment.info.enablePrivacyStatement ? {
    path: PRIVACY_PATH,
    component: ThemedPrivacyComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.privacy.title', breadcrumbKey: 'info.privacy' },
  } : undefined,
  environment.info.enableCOARNotifySupport ? {
    path: COAR_NOTIFY_SUPPORT,
    component: NotifyInfoComponent,
    canActivate: [notifyInfoGuard],
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'info.coar-notify-support.title',
      breadcrumbKey: 'info.coar-notify-support',
    },
  } : undefined,
].filter((route: Route) => hasValue(route));
