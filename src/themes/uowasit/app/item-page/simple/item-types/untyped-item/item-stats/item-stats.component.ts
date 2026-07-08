import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Item } from '@dspace/core/shared/item.model';
import { UsageReport } from '@dspace/core/statistics/models/usage-report.model';
import { UsageReportDataService } from '@dspace/core/statistics/usage-report-data.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
} from 'rxjs/operators';

interface ItemStats {
  views: number;
  downloads: number;
}

/**
 * Compact view/download counts for an item.
 * Calls the same UsageReportDataService the statistics page uses
 * (TotalVisits / TotalDownloads). Hides itself entirely when the API
 * errors or returns nothing, so anonymous-permission issues never break the page.
 */
@Component({
  selector: 'ds-uowasit-item-stats',
  templateUrl: './item-stats.component.html',
  styleUrls: ['./item-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
})
export class ItemStatsComponent implements OnInit {

  @Input() item: Item;

  stats$: Observable<ItemStats>;

  constructor(private usageReportService: UsageReportDataService) {
  }

  ngOnInit(): void {
    if (!this.item?.id) {
      this.stats$ = of(null);
      return;
    }
    const views$ = this.usageReportService.getStatistic(this.item.id, 'TotalVisits');
    const downloads$ = this.usageReportService.getStatistic(this.item.id, 'TotalDownloads');
    this.stats$ = combineLatest([views$, downloads$]).pipe(
      map(([visits, downloads]) => ({
        views: this.sumViews(visits),
        downloads: this.sumViews(downloads),
      })),
      // Hide entirely if there's nothing meaningful to show.
      map((stats) =>
        (stats.views > 0 || stats.downloads > 0) ? stats : null,
      ),
      catchError(() => of(null)),
    );
  }

  /**
   * Sum the `views` counts across all points in a usage report.
   * The `point.values` shape at runtime is a map like `{ views: number }`.
   */
  private sumViews(report: UsageReport): number {
    if (!report?.points?.length) {
      return 0;
    }
    return report.points.reduce((total, point) => {
      const value = (point.values as unknown as Record<string, number> | Array<{ views: number }>)?.['views'];
      const numeric = typeof value === 'number' ? value : Number(value) || 0;
      return total + numeric;
    }, 0);
  }
}
