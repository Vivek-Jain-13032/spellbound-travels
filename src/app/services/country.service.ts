import { Injectable } from '@angular/core';
import { rawCountryData } from 'intl-tel-input/data';

/**
 * Country names for the Nationality/Destination Country fields. Unlike
 * airports, there's a browser-native way to get this: Intl.DisplayNames
 * resolves an ISO 3166-1 code to a localized country name with no dataset
 * to fetch or maintain — the only "data" needed is the list of ISO codes
 * itself, reused from intl-tel-input's bundled list (already a dependency
 * for the phone field) rather than maintaining a second one.
 */
@Injectable({ providedIn: 'root' })
export class CountryService {
  private names: string[] | null = null;

  getCountryNames(): string[] {
    if (!this.names) {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      this.names = rawCountryData
        .map((c) => displayNames.of(c[0].toUpperCase()))
        .filter((name): name is string => !!name)
        .sort((a, b) => a.localeCompare(b));
    }
    return this.names;
  }
}
