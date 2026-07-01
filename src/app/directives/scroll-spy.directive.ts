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
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
