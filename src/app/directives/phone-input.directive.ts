import {
  Directive,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  forwardRef,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import intlTelInput from 'intl-tel-input';
import type { Iti } from 'intl-tel-input';

/**
 * Wraps intl-tel-input on the phone <input> so country selection (flag +
 * dial code + searchable country list) doesn't rely on a native <select>
 * popup, same rationale as DatePickerDirective. Value written to the form
 * is the full E.164 number (e.g. "+919876543210") once a country and
 * number are both present, so nothing downstream needs to parse a
 * separate dial-code field.
 *
 * intl-tel-input's own validation methods (getNumber/isValidNumber) need
 * its libphonenumber-derived "utils" module, which loads asynchronously
 * (see loadUtils below) — until iti.promise resolves, this directive
 * falls back to the raw input value so the form isn't blocked.
 */
@Directive({
  selector: '[appPhoneInput]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputDirective),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInputDirective),
      multi: true,
    },
  ],
})
export class PhoneInputDirective implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly zone = inject(NgZone);

  private iti?: Iti;
  private ready = false;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  private pendingValue = '';

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.iti = intlTelInput(this.el.nativeElement, {
        initialCountry: 'in',
        loadUtils: () => import('intl-tel-input/utils'),
        // The lead form section has overflow-hidden and a transformed
        // (scroll-reveal) ancestor, both of which break a fixed-position
        // dropdown's placement/clipping — mounting on <body> sidesteps that.
        dropdownParent: document.body,
      });
      this.iti.promise.then(() => {
        this.ready = true;
        if (this.pendingValue) {
          this.iti!.setNumber(this.pendingValue);
        }
        this.zone.run(() => this.onValidatorChange());
      });
      // intl-tel-input renders its country list as role="dialog" but never
      // gives it an accessible name (axe: aria-dialog-name), and the dialog
      // isn't appended to the DOM until first opened — patch it in on the
      // library's own "open:countryselector" event. @HostListener can't be
      // used here: Angular's compiler treats a colon in the event name as
      // a "target:event" global-target binding, which rejects "open".
      this.el.nativeElement.addEventListener('open:countryselector', this.labelCountrySelector);
    });
  }

  @HostListener('input')
  @HostListener('countrychange')
  handleChange(): void {
    this.onChange(this.currentValue());
    this.onTouched();
  }

  @HostListener('blur')
  handleBlur(): void {
    this.onTouched();
  }

  private readonly labelCountrySelector = (): void => {
    document.getElementById(`iti-${this.iti!.id}__country-selector`)?.setAttribute('aria-label', 'Select country');
  };

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.ready || !this.iti) return null; // don't block submit before utils finish loading
    if (!control.value) return null; // required() handles emptiness
    return this.iti.isValidNumber() ? null : { invalidPhone: true };
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private currentValue(): string {
    if (this.ready && this.iti) {
      return this.iti.getNumber() || this.el.nativeElement.value;
    }
    return this.el.nativeElement.value;
  }

  writeValue(value: string): void {
    if (this.ready && this.iti) {
      this.iti.setNumber(value || '');
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
    this.iti?.setDisabled(isDisabled);
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('open:countryselector', this.labelCountrySelector);
    this.iti?.destroy();
  }
}
