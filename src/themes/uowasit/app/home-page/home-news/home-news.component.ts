import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HomeNewsComponent as BaseComponent } from '../../../../../app/home-page/home-news/home-news.component';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { DSpaceObjectType } from '../../../../../app/core/shared/dspace-object-type.model';
import { Item } from '../../../../../app/core/shared/item.model';
import { getFirstSucceededRemoteData } from '../../../../../app/core/shared/operators';
import { PaginationComponentOptions } from '../../../../../app/core/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../../app/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '../../../../../app/core/shared/search/models/search-objects.model';
import { SearchService } from '../../../../../app/shared/search/search.service';
import { LocaleService } from '../../../../../app/core/locale/locale.service';

@Component({
  selector: 'ds-themed-home-news',
  styleUrls: ['../../../../../themes/uowasit/app/home-page/home-news/home-news.component.scss'],
  templateUrl: '../../../../../themes/uowasit/app/home-page/home-news/home-news.component.html',
  imports: [RouterLink, TranslateModule, AsyncPipe],
})
export class HomeNewsComponent extends BaseComponent implements OnInit {

  itemCount$: Observable<string>;

  constructor(
    private router: Router,
    private searchService: SearchService,
    route: ActivatedRoute,
    locale: LocaleService,
  ) {
    super(route, locale);
  }

  ngOnInit(): void {
    const pagination = Object.assign(new PaginationComponentOptions(), { currentPage: 1, pageSize: 1 });

    this.itemCount$ = this.searchService.search<Item>(
      new PaginatedSearchOptions({ dsoTypes: [DSpaceObjectType.ITEM], pagination }),
    ).pipe(
      getFirstSucceededRemoteData<SearchObjects<Item>>(),
      map((rd: RemoteData<SearchObjects<Item>>) => this.formatCount(rd.payload?.totalElements)),
    );
  }

  /** Format large numbers: 1200 → "1,200+". 0/undefined → '' so the curated i18n fallback shows. */
  private formatCount(n: number | undefined): string {
    if (!n) { return ''; }
    return n.toLocaleString('en-US') + (n >= 100 ? '+' : '');
  }

  heroSearch(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('input[type="search"]') as HTMLInputElement;
    const query = input?.value?.trim();
    if (query) {
      this.router.navigate(['/search'], { queryParams: { 'spc.page': 1, query } });
    } else {
      this.router.navigate(['/search'], { queryParams: { 'spc.page': 1 } });
    }
  }
}