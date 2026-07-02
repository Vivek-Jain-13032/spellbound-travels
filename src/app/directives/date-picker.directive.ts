import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  forwardRef,
  inject,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import flatpickr from 'flatpickr';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';

/**
 * Wraps flatpickr on a text input so the calendar popup can actually be
 * themed to match the site — a native <input type="date">'s picker is
 * browser/OS chrome no CSS can restyle (see styles.css for the flatpickr
 * dark/gold theme override). Value format is ISO 'Y-m-d', same as the
 * native date input it replaces, so nothing downstream (validators, the
 * EmailJS payload) needs to change.
 *
 * The host element must already carry type="text" readonly — this
 * directive only manages the flatpickr instance and form value, not the
 * input's static attributes.
 */
@Directive({
  selector: '[appDatePicker]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerDirective),
      multi: true,
    },
  ],
})
export class DatePickerDirective implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly zone = inject(NgZone);

  /** 'today' (default), a specific 'Y-m-d' string, or null to remove the restriction. */
  @Input() minDate: string | null = 'today';

  private instance?: FlatpickrInstance;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private pendingValue = '';

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.instance = flatpickr(this.el.nativeElement, {
        dateFormat: 'Y-m-d',
        minDate: this.minDate ?? undefined,
        disableMobile: true,
        onChange: (_dates, dateStr) => {
          this.zone.run(() => {
            this.onChange(dateStr);
            this.onTouched();
          });
        },
        onClose: () => this.zone.run(() => this.onTouched()),
      });
      if (this.pendingValue) {
        this.instance.setDate(this.pendingValue, false);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['minDate'] && this.instance) {
      this.instance.set('minDate', this.minDate ?? undefined);
    }
  }

  writeValue(value: string): void {
    if (this.instance) {
      this.instance.setDate(value || '', false);
    } else {
      this.pendingValue = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.instance?.set('clickOpens', !isDisabled);
    this.el.nativeElement.disabled = isDisabled;
  }

  ngOnDestroy(): void {
    this.instance?.destroy();
  }
}
