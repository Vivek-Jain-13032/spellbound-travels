import { Component, inject } from '@angular/core';
import { LucidePlaneTakeoff } from '@lucide/angular';
// Visa Help CTA temporarily disabled — see hero.component.html. Re-enable by
// uncommenting the import below and adding it back to the `imports` array.
// import { LucideIdCard } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { GtmService } from '../../services/gtm.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LucidePlaneTakeoff, RevealOnScrollDirective, ScrollSpyDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  private readonly nav = inject(NavigationService);
  private readonly gtm = inject(GtmService);

  bookAFlight(): void {

    this.gtm.pushEvent('plan_journey_click', {
      service: 'Flight'
    });

    this.nav.enquire('Flight');
  }

  visaHelp(): void {
    this.gtm.pushEvent('visa_help', {
      service: 'Visa Assistance'
    });

    this.nav.enquire('Visa');
  }
}
