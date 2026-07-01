import { Component } from '@angular/core';
import { LucidePlaneTakeoff, LucideIdCard, LucideHeadset } from '@lucide/angular';

interface TrustItem {
  icon: 'plane' | 'id-card' | 'headset';
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-trust-bar',
  standalone: true,
  imports: [LucidePlaneTakeoff, LucideIdCard, LucideHeadset],
  templateUrl: './trust-bar.component.html',
})
export class TrustBarComponent {
  readonly items: TrustItem[] = [
    { icon: 'plane', title: 'Global Flights', subtitle: '500+ airlines worldwide' },
    { icon: 'id-card', title: 'Visa Assistance', subtitle: 'Every destination handled' },
    { icon: 'headset', title: '24/7 Support', subtitle: 'A concierge always on call' },
  ];
}
