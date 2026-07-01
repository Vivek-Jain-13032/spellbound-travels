import { AfterViewInit, Directive, ElementRef, OnDestroy, inject } from '@angular/core';

/**
 * Adds the `.reveal` / `.reveal-visible` fade-in-up treatment (see styles.css)
 * the first time an element scrolls into view, then stops observing.
 * Usage: <div appReveal> or <div appReveal="0.15s"> for a staggered delay.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
  host: { class: 'reveal' },
})
export class RevealOnScrollDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const nativeEl = this.el.nativeElement;
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            nativeEl.classList.add('reveal-visible');
            this.observer?.unobserve(nativeEl);
          }
        }
      },
      { threshold: 0.15 },
    );
    this.observer.observe(nativeEl);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
