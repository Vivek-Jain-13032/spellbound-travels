import { Component, inject } from '@angular/core';
import { LucidePlane, LucideArrowRight } from '@lucide/angular';
// Visa Assistance card temporarily disabled — see services.component.html.
// Re-enable by uncommenting the import below and adding it back to the
// `imports` array.
// import { LucideIdCard } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [LucidePlane, LucideArrowRight, RevealOnScrollDirective, ScrollSpyDirective],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  private readonly nav = inject(NavigationService);

  enquireFlight(): void {
    this.nav.enquire('Flight');
  }

  enquireVisa(): void {
    this.nav.enquire('Visa');
  }
}
