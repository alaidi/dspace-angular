import {
  AsyncPipe,
  DatePipe,
} from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent as BaseComponent } from '../../../../app/footer/footer.component';

@Component({
  //dspace-angular/src/themes/uowasit/app/footer/footer.component.ts
///Users/hadi/Projects/eduThesis/dspace-angular/src/themes/uowasit/app/footer/footer.component.html
  selector: 'ds-themed-footer',
  styleUrls: ['../../../../themes/uowasit/app/footer/footer.component.scss'],
  templateUrl: '../../../../themes/uowasit/app/footer/footer.component.html',
  imports: [
    AsyncPipe,
    DatePipe,
    RouterLink,
    TranslateModule,
  ],
})
export class FooterComponent extends BaseComponent {
    override showTopFooter = true;
}
