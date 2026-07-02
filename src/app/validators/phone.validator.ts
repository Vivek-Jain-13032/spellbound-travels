import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Requires between `minDigits` and `maxDigits` numeric characters, ignoring
 * spaces/dashes/parentheses/plus. Max defaults to 15 (E.164's international
 * limit) so a form full of pasted-in garbage still gets caught.
 */
export function phoneDigitsInRange(minDigits: number, maxDigits = 15): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value ?? '') as string;
    if (!value) return null;
    const digitCount = value.replace(/\D/g, '').length;
    if (digitCount < minDigits || digitCount > maxDigits) {
      return { phoneDigitsInRange: { minDigits, maxDigits, actualDigits: digitCount } };
    }
    return null;
  };
}
