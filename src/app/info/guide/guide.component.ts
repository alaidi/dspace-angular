import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-base-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss'],
  imports: [
    TranslateModule,
  ],
})
/**
 * Component displaying the user Guide page
 */
export class GuideComponent {
}
