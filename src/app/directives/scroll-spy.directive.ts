import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

/**
 * Marks a top-level page section as observable for active-nav-link highlighting.
 * Usage: <section id="services" appScrollSpy>
 */
@Directive({
  selector: '[appScrollSpy]',
  standalone: true,
})
export class ScrollSpyDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly nav = inject(NavigationService);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.nav.activeSectionId.set(this.el.nativeElement.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    this.observer.observe(this.el.nativeElement);

    // A section shorter than the viewport (e.g. the footer, the last thing
    // on the page) can never cross the centered "band" above once scroll
    // hits the document's bottom limit, so the IntersectionObserver alone
    // never fires for it. Falling back to "are we at the bottom of the
    // page, and is this section the one showing there" covers that case.
    window.addEventListener('scroll', this.onWindowScroll, { passive: true });
  }

  private readonly onWindowScroll = (): void => {
    const doc = document.documentElement;
    const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 1;
    // Layout-based (offsetTop/offsetHeight), not getBoundingClientRect —
    // the latter reflects the reveal animation's CSS transform mid-transition
    // and would flicker; this checks "is this element the last thing in the
    // document's flow", which is invariant regardless of scroll position or
    // in-flight animations.
    const isLastInDocument = this.el.nativeElement.offsetTop + this.el.nativeElement.offsetHeight >= doc.scrollHeight - 1;
    if (atBottom && isLastInDocument) {
      this.nav.activeSectionId.set(this.el.nativeElement.id);
    }
  };

  ngOnDestroy(): void {
    this.observer?.disconnect();
    window.removeEventListener('scroll', this.onWindowScroll);
  }
}
