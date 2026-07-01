import { Injectable, signal } from '@angular/core';
import { ServiceNeeded } from '../models/lead-form.model';

export const SECTION_IDS = ['home', 'services', 'about', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/**
 * Coordinates cross-component behaviour that doesn't fit a single component:
 * smooth-scroll navigation, the currently-active nav section, and the
 * "Enquire Now" -> pre-selected lead-form service hand-off.
 */
@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly activeSectionId = signal<string>('home');
  readonly preselectedService = signal<ServiceNeeded | null>(null);

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  enquire(service: ServiceNeeded, sectionId = 'contact'): void {
    this.preselectedService.set(service);
    this.scrollToSection(sectionId);
  }
}
