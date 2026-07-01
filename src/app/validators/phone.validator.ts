import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Requires at least `minDigits` numeric characters, ignoring spaces/dashes/parentheses/plus. */
export function minPhoneDigits(minDigits: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '') as string;
    if (!value) return null;
    const digitCount = value.replace(/\D/g, '').length;
    return digitCount >= minDigits ? null : { minPhoneDigits: { requiredDigits: minDigits, actualDigits: digitCount } };
  };
}
