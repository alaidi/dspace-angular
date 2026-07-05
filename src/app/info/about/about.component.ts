import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-base-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [
    TranslateModule,
  ],
})
/**
 * Component displaying the About page
 */
export class AboutComponent {
}
