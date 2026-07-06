#!/usr/bin/env node
/**
 * Refreshes src/app/data/airports.json from OurAirports' public-domain
 * airport database (community-maintained, mirrored as CSV by its
 * maintainer at https://github.com/davidmegginson/ourairports-data —
 * there's no API, just an occasionally-updated data dump, which suits
 * this dataset fine since airport codes/names change very rarely).
 *
 * Not run automatically — the app reads the checked-in JSON file, not
 * this script. Re-run manually (`npm run update-airports`) every so
 * often to pick up newly opened airports or renames, then commit the
 * regenerated airports.json.
 */
const fs = require('fs');
const path = require('path');

const AIRPORTS_URL = 'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv';
const COUNTRIES_URL = 'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/countries.csv';
const OUTPUT_PATH = path.join(__dirname, '../src/app/data/airports.json');

/** Minimal RFC4180 CSV parser — handles quoted fields containing commas, which plain split(',') would break on (airport/country names do contain commas). */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }

  const header = rows[0];
  return rows.slice(1).map((cols) => Object.fromEntries(header.map((key, i) => [key, cols[i] ?? ''])));
}

async function fetchCsv(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return parseCsv(await res.text());
}

async function main() {
  console.log('Fetching airports.csv and countries.csv from OurAirports...');
  const [airportRows, countryRows] = await Promise.all([fetchCsv(AIRPORTS_URL), fetchCsv(COUNTRIES_URL)]);

  const countryNameByCode = new Map(countryRows.map((c) => [c.code, c.name]));

  const isValidIata = (code) => /^[A-Z]{3}$/.test(code);
  const isCommerciallyRelevant = (row) =>
    row.scheduled_service === 'yes' || row.type === 'large_airport' || row.type === 'medium_airport';

  const seen = new Set();
  const airports = [];
  for (const row of airportRows) {
    const iata = row.iata_code;
    if (!isValidIata(iata) || !isCommerciallyRelevant(row) || seen.has(iata)) continue;
    seen.add(iata);
    airports.push({
      iata,
      name: row.name,
      city: row.municipality || row.name,
      country: countryNameByCode.get(row.iso_country) || row.iso_country,
    });
  }

  airports.sort((a, b) => a.city.localeCompare(b.city));

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(airports));
  console.log(`Wrote ${airports.length} airports to ${path.relative(process.cwd(), OUTPUT_PATH)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
