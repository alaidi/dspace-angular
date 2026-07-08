import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  TemplateRef,
} from '@angular/core';
import { Item } from '@dspace/core/shared/item.model';
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Action row for the untyped item page: Cite (APA modal with copy),
 * Share dropdown (copy link, X, Facebook, WhatsApp, Telegram, email),
 * and a DOI badge when dc.identifier.doi is present.
 */
@Component({
  selector: 'ds-uowasit-item-actions',
  templateUrl: './item-actions.component.html',
  styleUrls: ['./item-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbDropdownModule,
    NgbModalModule,
    TranslateModule,
  ],
})
export class ItemActionsComponent {

  /**
   * The item whose metadata drives the actions.
   */
  @Input() item: Item;

  copied = false;
  linkCopied = false;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  /**
   * The DOI name for this item, if present (rendered as a badge linking to doi.org).
   * This repository stores dc.identifier.doi as a full URL, so strip any
   * doi.org / doi: prefix down to the bare DOI name.
   */
  get doi(): string {
    return this.item?.firstMetadataValue('dc.identifier.doi')
      ?.replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:)/i, '');
  }

  /**
   * APA-style citation assembled from available metadata fields.
   * Missing fields are skipped gracefully.
   */
  get citationText(): string {
    if (!this.item) {
      return '';
    }
    const authors = this.item.allMetadataValues(['dc.contributor.author', 'dc.creator']);
    const year = this.item.firstMetadataValue('dc.date.issued') || 'n.d.';
    const title = this.item.firstMetadataValue('dc.title');
    const publisher = this.item.firstMetadataValue('dc.publisher');

    const parts: string[] = [];
    if (authors?.length) {
      parts.push(authors.join(', '));
    }
    parts.push(`(${year})`);
    if (title) {
      parts.push(`${title}.`);
    }
    if (publisher) {
      parts.push(`${publisher}.`);
    }
    if (this.doi) {
      parts.push(`https://doi.org/${this.doi}`);
    } else {
      const uri = this.item.firstMetadataValue('dc.identifier.uri');
      if (uri) {
        parts.push(uri);
      }
    }
    return parts.join(' ');
  }

  /**
   * Canonical URL to share: the item's handle URI when available (stable and
   * SSR-safe), falling back to the current page URL. Never touch `window`
   * here — it is undefined during server-side rendering.
   */
  get shareUrl(): string {
    return this.item?.firstMetadataValue('dc.identifier.uri')
      ?? this.document.location?.href
      ?? '';
  }

  get shareTitle(): string {
    return this.item?.firstMetadataValue('dc.title') ?? '';
  }

  twitterUrl(): string {
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.shareUrl)}&text=${encodeURIComponent(this.shareTitle)}`;
  }

  facebookUrl(): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}`;
  }

  whatsappUrl(): string {
    return `https://wa.me/?text=${encodeURIComponent(`${this.shareTitle} ${this.shareUrl}`)}`;
  }

  telegramUrl(): string {
    return `https://t.me/share/url?url=${encodeURIComponent(this.shareUrl)}&text=${encodeURIComponent(this.shareTitle)}`;
  }

  emailUrl(): string {
    return `mailto:?subject=${encodeURIComponent(this.shareTitle)}&body=${encodeURIComponent(this.shareUrl)}`;
  }

  openCite(template: TemplateRef<unknown>): void {
    this.copied = false;
    this.modalService.open(template, { centered: true, scrollable: true });
  }

  async copyCitation(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.citationText);
      this.copied = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.copied = false;
        this.cdr.markForCheck();
      }, 2000);
    } catch {
      // Clipboard may be unavailable (insecure context / permissions); fail silently.
    }
  }

  async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareUrl);
      this.linkCopied = true;
      this.cdr.markForCheck();
      setTimeout(() => {
        this.linkCopied = false;
        this.cdr.markForCheck();
      }, 2000);
    } catch {
      // fail silently
    }
  }
}
