import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Rejects names that are all-digits/symbols (e.g. accidental phone-number paste). */
export function containsLetter(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '') as string;
    if (!value) return null;
    return /[a-zA-Z]/.test(value) ? null : { containsLetter: true };
  };
}
