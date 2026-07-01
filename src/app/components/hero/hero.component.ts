import { Component, inject } from '@angular/core';
import { LucidePlaneTakeoff, LucideIdCard } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LucidePlaneTakeoff, LucideIdCard, RevealOnScrollDirective, ScrollSpyDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  private readonly nav = inject(NavigationService);

  bookAFlight(): void {
    this.nav.enquire('Flight');
  }

  visaHelp(): void {
    this.nav.enquire('Visa');
  }
}
