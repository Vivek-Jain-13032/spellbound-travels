import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
  booleanAttribute,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { LucideChevronDown, LucidePlane, LucideIdCard, LucideSearch } from '@lucide/angular';

export type SelectOptionIcon = 'plane' | 'id-card';

export interface SelectOption {
  value: string;
  label: string;
  /** Optional icons shown before the label — e.g. ['plane', 'id-card'] for a combined option. */
  icons?: SelectOptionIcon[];
}

/**
 * Custom-styled dropdown replacing native <select>. Browsers render a
 * native, unstylable popup for an open <select> — the same limitation we
 * hit re-skinning Google Translate's language list — so this rebuilds the
 * open/closed states as plain HTML/CSS instead, matching the navbar
 * language switcher.
 *
 * `searchable` adds a filter box at the top of the open list, for options
 * lists too long to comfortably scroll (e.g. a country list) — small
 * fixed lists (Service Needed, Travel Class, etc.) should leave it off.
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormsModule, LucideChevronDown, LucidePlane, LucideIdCard, LucideSearch],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  template: `
    <div class="relative">
      <button
        type="button"
        [id]="id"
        (click)="toggle()"
        [disabled]="disabled"
        class="w-full box-border flex items-center justify-between bg-[#141414] border rounded-sm text-left px-4 py-3.5 font-body text-[15px] outline-none transition-colors focus:border-sb-gold hover:border-[#3d3d3d] disabled:opacity-60 disabled:cursor-not-allowed"
        [class.border-red-500]="invalid"
        [class.border-[#2a2a2a]]="!invalid"
        [class.text-[#e8e8e8]]="value"
        [class.text-[#8a8a8a]]="!value"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="ariaLabel || null"
      >
        <span class="flex items-center gap-2 min-w-0">
          @for (icon of selectedOption()?.icons ?? []; track icon) {
            @switch (icon) {
              @case ('plane') { <svg lucidePlane class="w-4 h-4 text-sb-gold flex-shrink-0"></svg> }
              @case ('id-card') { <svg lucideIdCard class="w-4 h-4 text-sb-gold flex-shrink-0"></svg> }
            }
          }
          <span class="truncate">{{ selectedOption()?.label ?? placeholder }}</span>
        </span>
        <svg lucideChevronDown class="w-3.5 h-3.5 text-[#888] flex-shrink-0 ml-2"></svg>
      </button>

      @if (open()) {
        <div class="absolute left-0 right-0 top-full mt-1.5 bg-[#141414] border border-sb-gold/30 rounded-sm shadow-2xl z-30 overflow-hidden">
          @if (searchable) {
            <div class="relative border-b border-sb-gold/20">
              <svg lucideSearch class="w-4 h-4 text-[#8a8a8a] absolute left-3 top-1/2 -translate-y-1/2"></svg>
              <input
                #searchInput
                type="text"
                [(ngModel)]="query"
                [attr.aria-label]="'Search ' + (ariaLabel || 'options')"
                placeholder="Search…"
                autocomplete="off"
                class="w-full box-border bg-transparent text-white pl-9 pr-3 py-2.5 font-body text-[14px] outline-none"
              />
            </div>
          }
          <ul role="listbox" [attr.aria-label]="ariaLabel || null" class="max-h-64 overflow-y-auto py-1.5">
            @for (opt of filteredOptions(); track opt.value) {
              <li role="presentation">
                <button
                  type="button"
                  role="option"
                  [attr.aria-selected]="value === opt.value"
                  (click)="select(opt)"
                  class="w-full flex items-center gap-2 text-left px-4 py-2.5 font-body text-[15px] text-[#d8d8d8] hover:bg-[#1e1e1e] hover:text-sb-gold transition-colors cursor-pointer"
                  [class.text-sb-gold]="value === opt.value"
                >
                  @for (icon of opt.icons ?? []; track icon) {
                    @switch (icon) {
                      @case ('plane') { <svg lucidePlane class="w-4 h-4 flex-shrink-0"></svg> }
                      @case ('id-card') { <svg lucideIdCard class="w-4 h-4 flex-shrink-0"></svg> }
                    }
                  }
                  {{ opt.label }}
                </button>
              </li>
            } @empty {
              <li class="px-4 py-2.5 font-body text-sm text-[#8a8a8a]">No matches</li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class SelectComponent implements ControlValueAccessor {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) options: SelectOption[] = [];
  @Input() placeholder = 'Select…';
  @Input() ariaLabel = '';
  @Input() invalid = false;
  @Input() id = '';
  @Input({ transform: booleanAttribute }) searchable = false;

  @ViewChild('searchInput') private searchInputRef?: ElementRef<HTMLInputElement>;

  readonly open = signal(false);
  query = '';
  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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

  selectedOption(): SelectOption | undefined {
    return this.options.find((o) => o.value === this.value);
  }

  filteredOptions(): SelectOption[] {
    if (!this.searchable || !this.query.trim()) return this.options;
    const q = this.query.trim().toLowerCase();
    return this.options.filter((o) => o.label.toLowerCase().includes(q));
  }

  toggle(): void {
    if (this.disabled) return;
    this.open.update((o) => !o);
    if (this.open()) {
      this.query = '';
      if (this.searchable) {
        setTimeout(() => this.searchInputRef?.nativeElement.focus());
      }
    } else {
      this.onTouched();
    }
  }

  select(opt: SelectOption): void {
    this.value = opt.value;
    this.onChange(this.value);
    this.onTouched();
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
      this.onTouched();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.open.set(false);
  }
}
