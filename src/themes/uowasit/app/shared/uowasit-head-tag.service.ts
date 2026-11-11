import { DOCUMENT } from '@angular/common';
import {
  inject,
  Injectable,
} from '@angular/core';
import { HeadTagService } from '@dspace/core/metadata/head-tag.service';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { Item } from '@dspace/core/shared/item.model';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';

/**
 * uowasit additions to the stock head tags (all rendered server-side, like the citation_* tags):
 * - citation_publication_date only from the real publication date, never the accession timestamp
 * - item pages replace the site-wide description / Open Graph defaults from index.html
 *   instead of adding a second description tag
 * - <link rel="canonical"> to the item page (handle URLs 301 there)
 */
@Injectable()
export class UowasitHeadTagService extends HeadTagService {

  private readonly document = inject(DOCUMENT);

  protected override processRouteChange(routeInfo: any): void {
    this.document.head.querySelector('link[rel="canonical"]')?.remove();
    super.processRouteChange(routeInfo);

    const dso = routeInfo.data.value.dso?.payload;
    if (dso instanceof Item) {
      const url = new URLCombiner(this.hardRedirectService.getBaseUrl(), getItemPageRoute(dso)).toString();
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);

      // shortcut: og:* are not reset after client-side navigation away from an item; crawlers only read the SSR HTML.
      this.meta.updateTag({ property: 'og:type', content: 'article' });
      this.meta.updateTag({ property: 'og:url', content: url });
      this.meta.updateTag({ property: 'og:title', content: this.dsoNameService.getName(dso) });
      const abstract = dso.firstMetadataValue('dc.description.abstract');
      if (abstract) {
        this.meta.updateTag({ property: 'og:description', content: abstract });
      }
    }
  }

  /** dc.date.accessioned / dc.date.available are repository timestamps, not when the thesis was issued. */
  protected override setCitationPublicationDateTag(): void {
    this.addMetaTag('citation_publication_date', this.getFirstMetaTagValue(['dc.date.issued', 'dc.date.copyright']));
  }

  /** Overwrite index.html's site-wide description rather than adding a second description tag. */
  protected override setDescriptionTag(): void {
    const abstract = this.getMetaTagValue('dc.description.abstract');
    if (abstract) {
      this.meta.updateTag({ name: 'description', content: abstract });
    }
  }
}
