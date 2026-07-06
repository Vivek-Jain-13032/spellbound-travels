import { Injectable } from '@angular/core';

export interface Airport {
  iata: string;
  name: string;
  city: string;
  country: string;
}

const MAX_RESULTS = 8;

/**
 * Global airport lookup for the lead form's Flying From/To fields.
 * The dataset (~5,600 airports with an IATA code, trimmed from OpenFlights'
 * public-domain airport database) is ~500KB, so it's dynamically imported
 * on first use rather than shipped in the initial bundle — same reasoning
 * as PhoneInputDirective's lazy-loaded libphonenumber utils.
 */
@Injectable({ providedIn: 'root' })
export class AirportService {
  private airports: Airport[] | null = null;
  private loadPromise: Promise<Airport[]> | null = null;

  private load(): Promise<Airport[]> {
    if (this.airports) return Promise.resolve(this.airports);
    this.loadPromise ??= import('../data/airports.json').then((mod) => {
      this.airports = (mod.default ?? mod) as unknown as Airport[];
      return this.airports;
    });
    return this.loadPromise;
  }

  /** Preload without needing a result — call on first focus so the first keystroke isn't the one waiting on the network. */
  preload(): void {
    void this.load();
  }

  async search(query: string): Promise<Airport[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const airports = await this.load();

    const iataExact: Airport[] = [];
    const cityStarts: Airport[] = [];
    const other: Airport[] = [];

    for (const airport of airports) {
      const iata = airport.iata.toLowerCase();
      const city = airport.city.toLowerCase();
      if (iata === q) {
        iataExact.push(airport);
      } else if (city.startsWith(q)) {
        cityStarts.push(airport);
      } else if (
        iata.includes(q) ||
        city.includes(q) ||
        airport.name.toLowerCase().includes(q) ||
        airport.country.toLowerCase().includes(q)
      ) {
        other.push(airport);
      }
      if (iataExact.length + cityStarts.length + other.length >= MAX_RESULTS * 3) break;
    }

    return [...iataExact, ...cityStarts, ...other].slice(0, MAX_RESULTS);
  }
}
