import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideArrowRight } from '@lucide/angular';
import { NavigationService } from '../../services/navigation.service';
import { GtmService } from '../../services/gtm.service';
import { RevealOnScrollDirective } from '../../directives/reveal-on-scroll.directive';

interface Destination {
  /** Card heading, and label used in the price line. */
  city: string;
  /** Route shorthand, e.g. "DEL → DXB → DEL". */
  route: string;
  flightType: string;
  /** Starting fare in INR, formatted for display (no currency symbol). */
  priceFrom: string;
  /** Value written into the lead-form's "Flying To" field on click. */
  airportValue: string;
  /** Value written into the lead-form's "Flying From" field on click. */
  fromAirportValue: string;
  /** Photo filename under public/assets/images/destinations/ (see README). */
  image: string;
}

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [NgTemplateOutlet, LucideArrowRight, RevealOnScrollDirective],
  templateUrl: './destinations.component.html',
  styleUrl: './destinations.component.css',
})
export class DestinationsComponent {
  private readonly nav = inject(NavigationService);
  private readonly gtm = inject(GtmService);

  // Starting fares sourced from the current promotional poster (round-trip,
  // departing Delhi). Update here to refresh pricing — the card grid and
  // form autofill both read from this single list.
  readonly destinations: Destination[] = [
    { city: 'Dubai', route: 'DEL → DXB → DEL', flightType: 'Direct Flight', priceFrom: '36,700', airportValue: 'Dubai (DXB)', fromAirportValue: 'Delhi (DEL)', image: 'dubai.jpg' },
    { city: 'Canada (Toronto / Vancouver)', route: 'DEL → CAN → DEL', flightType: '1 Stop Flight', priceFrom: '45,600', airportValue: 'Toronto (YYZ)', fromAirportValue: 'Delhi (DEL)', image: 'canada.jpg' },
    { city: 'Manila', route: 'DEL → MNL → DEL', flightType: 'Direct & 1 Stop', priceFrom: '57,080', airportValue: 'Manila (MNL)', fromAirportValue: 'Delhi (DEL)', image: 'manila.jpg' },
    { city: 'Singapore', route: 'DEL → SIN → DEL', flightType: 'Direct & 1 Stop', priceFrom: '40,400', airportValue: 'Singapore (SIN)', fromAirportValue: 'Delhi (DEL)', image: 'singapore.jpg' },
    { city: 'Addis Ababa', route: 'DEL → ADD → DEL', flightType: 'Direct & 1 Stop', priceFrom: '61,955', airportValue: 'Addis Ababa (ADD)', fromAirportValue: 'Delhi (DEL)', image: 'addis-ababa.jpg' },
    { city: 'Vancouver', route: 'DEL → YVR → DEL', flightType: '1 Stop Flight', priceFrom: '123,500', airportValue: 'Vancouver (YVR)', fromAirportValue: 'Delhi (DEL)', image: 'vancouver.jpg' },
  ];

  select(destination: Destination): void {
    this.gtm.pushEvent('destination_card_click', { destination: destination.city });
    // Every route on the poster is round-trip (DEL → X → DEL), matching the advertised fare.
    this.nav.enquireForFlight({
      from: destination.fromAirportValue,
      to: destination.airportValue,
      journeyType: 'Round Trip',
    });
  }

  /** Missing/renamed photo: hide the broken <img>, leaving the striped placeholder pattern visible underneath. */
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
