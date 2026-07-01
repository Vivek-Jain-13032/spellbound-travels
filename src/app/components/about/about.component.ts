import { Component, inject, signal } from '@angular/core';
import { LucidePlaneTakeoff, LucideGlobe, LucideZap, LucideUser, LucideArrowRight } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';
import { ScrollSpyDirective } from '../../directives/scroll-spy.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [LucidePlaneTakeoff, LucideGlobe, LucideZap, LucideUser, LucideArrowRight, RevealOnScrollDirective, ScrollSpyDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  private readonly nav = inject(NavigationService);

  /** Portrait placeholder shows until assets/images/about-portrait.jpg loads successfully. */
  readonly portraitLoaded = signal(false);

  planYourJourney(): void {
    this.nav.scrollToSection('contact');
  }
}
