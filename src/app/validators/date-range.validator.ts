import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Group-level validator: if both dates are set, `toControlName` must not be
 * before `fromControlName`. Attaches the error to the *group* (not either
 * control) so it doesn't fight each field's own required/format validators.
 */
export function dateNotBefore(fromControlName: string, toControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const from = group.get(fromControlName)?.value as string | undefined;
    const to = group.get(toControlName)?.value as string | undefined;
    if (!from || !to) return null;
    return to >= from ? null : { dateNotBefore: { fromControlName, toControlName } };
  };
}
