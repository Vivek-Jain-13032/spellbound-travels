import { Component } from '@angular/core';
import { LucideCompass, LucideGlobe, LucideZap, LucideHeartHandshake } from '@lucide/angular';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface WhyItem {
  icon: 'compass' | 'globe' | 'zap' | 'heart-handshake';
  title: string;
  description: string;
}

@Component({
  selector: 'app-why-choose-us',
  standalone: true,
  imports: [LucideCompass, LucideGlobe, LucideZap, LucideHeartHandshake, RevealOnScrollDirective],
  templateUrl: './why-choose-us.component.html',
})
export class WhyChooseUsComponent {
  readonly items: WhyItem[] = [
    { icon: 'compass', title: 'Expert Guidance', description: 'Seasoned specialists who know the routes, fares and rules inside out.' },
    { icon: 'globe', title: 'Global Network', description: 'Trusted partners and airline access spanning every continent.' },
    { icon: 'zap', title: 'Fast Processing', description: 'Swift turnarounds on bookings and visa paperwork, without the wait.' },
    { icon: 'heart-handshake', title: 'Personalized Service', description: 'Every itinerary shaped around you — one dedicated point of contact.' },
  ];
}
