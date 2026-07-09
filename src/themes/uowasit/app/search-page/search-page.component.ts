import { Component } from '@angular/core';
import { SEARCH_CONFIG_SERVICE } from 'src/app/my-dspace-page/my-dspace-configuration.service';

import { SearchPageComponent as BaseComponent } from '../../../../app/search-page/search-page.component';
import { SearchConfigurationService } from '../../../../app/shared/search/search-configuration.service';
import { ThemedSearchComponent } from '../../../../app/shared/search/themed-search.component';

@Component({
  selector: 'ds-themed-search-page',
  // uowasit: own template so the main /search is scoped to items (dsoType=item)
  templateUrl: './search-page.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    ThemedSearchComponent,
  ],
})
export class SearchPageComponent extends BaseComponent {
}
