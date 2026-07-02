import { Component, ElementRef, HostListener, Input, forwardRef, inject, signal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { LucideChevronDown, LucidePlane, LucideIdCard } from '@lucide/angular';

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
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [LucideChevronDown, LucidePlane, LucideIdCard],
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
        <ul
          role="listbox"
          [attr.aria-label]="ariaLabel || null"
          class="absolute left-0 right-0 top-full mt-1.5 max-h-64 overflow-y-auto bg-[#141414] border border-sb-gold/30 rounded-sm shadow-2xl py-1.5 z-30"
        >
          @for (opt of options; track opt.value) {
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
          }
        </ul>
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

  readonly open = signal(false);
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

  toggle(): void {
    if (this.disabled) return;
    this.open.update((o) => !o);
    if (!this.open()) this.onTouched();
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
