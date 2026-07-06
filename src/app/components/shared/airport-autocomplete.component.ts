import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AirportService, Airport } from '../../services/airport.service';

let nextId = 0;

/**
 * Freeform text input with a live airport-search dropdown, replacing the
 * plain "City or airport" text field. Users can still type any text (the
 * form doesn't require picking from the list — same as before), but
 * picking a suggestion fills in a canonical "City (IATA)" value.
 *
 * Unlike SelectComponent (a closed list of options behind a click-to-open
 * button), this is a combobox: the input itself is both the display value
 * and the search query, so it can't reuse that component directly.
 */
@Component({
  selector: 'app-airport-autocomplete',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AirportAutocompleteComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <input
        type="text"
        [id]="id"
        [(ngModel)]="value"
        (ngModelChange)="onQueryChange($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (keydown)="onKeydown($event)"
        [disabled]="disabled"
        [placeholder]="placeholder"
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
        [attr.aria-activedescendant]="activeIndex() >= 0 ? optionId(activeIndex()) : null"
        class="w-full box-border bg-[#141414] border rounded-sm text-white px-4 py-3.5 font-body text-[15px] outline-none transition-colors focus:border-sb-gold hover:border-[#3d3d3d] disabled:opacity-60 disabled:cursor-not-allowed"
        [class.border-red-500]="invalid"
        [class.border-[#2a2a2a]]="!invalid"
      />

      @if (open() && results().length) {
        <ul
          [id]="listId"
          role="listbox"
          class="absolute left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto bg-[#141414] border border-sb-gold/30 rounded-sm shadow-2xl py-1.5 z-30"
        >
          @for (airport of results(); track airport.iata; let i = $index) {
            <li role="presentation">
              <button
                type="button"
                [id]="optionId(i)"
                role="option"
                [attr.aria-selected]="i === activeIndex()"
                (mousedown)="select(airport)"
                class="w-full flex items-baseline gap-2 text-left px-4 py-2.5 font-body text-[15px] text-[#d8d8d8] hover:bg-[#1e1e1e] hover:text-sb-gold transition-colors cursor-pointer"
                [class.bg-[#1e1e1e]]="i === activeIndex()"
                [class.text-sb-gold]="i === activeIndex()"
              >
                <span class="flex-shrink-0">{{ airport.city }} ({{ airport.iata }})</span>
                <span class="text-xs text-[#8a8a8a] truncate">{{ airport.name }}, {{ airport.country }}</span>
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class AirportAutocompleteComponent implements ControlValueAccessor {
  private readonly airportService = inject(AirportService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input() placeholder = 'City or airport';
  @Input() invalid = false;
  @Input() id = '';

  readonly listId = `airport-listbox-${nextId++}`;
  readonly open = signal(false);
  readonly results = signal<Airport[]>([]);
  readonly activeIndex = signal(-1);

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private searchToken = 0;

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  optionId(index: number): string {
    return `${this.listId}-option-${index}`;
  }

  onFocus(): void {
    this.airportService.preload();
  }

  onQueryChange(query: string): void {
    this.onChange(query);
    this.activeIndex.set(-1);

    const token = ++this.searchToken;
    this.airportService.search(query).then((matches) => {
      if (token !== this.searchToken) return; // a newer keystroke already superseded this lookup
      this.results.set(matches);
      this.open.set(matches.length > 0);
    });
  }

  select(airport: Airport): void {
    this.value = `${airport.city} (${airport.iata})`;
    this.onChange(this.value);
    this.open.set(false);
    this.results.set([]);
  }

  onBlur(): void {
    this.open.set(false);
    this.onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.open() || !this.results().length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.update((i) => (i + 1) % this.results().length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.update((i) => (i <= 0 ? this.results().length - 1 : i - 1));
        break;
      case 'Enter': {
        const active = this.activeIndex();
        if (active >= 0) {
          event.preventDefault();
          this.select(this.results()[active]);
        }
        break;
      }
      case 'Escape':
        this.open.set(false);
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
