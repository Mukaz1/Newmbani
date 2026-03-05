import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const KRA_PIN_REGEX = /^[AP]\d{9}[A-Za-z]$/i;

export function kraPinValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value ?? '') as string;
    if (!raw) return null; // let the "required" handle empty

    const normalized = raw.replace(/[\s-]/g, '').toUpperCase();

    const valid = KRA_PIN_REGEX.test(normalized);
    if (!valid) {
      return {
        kraPin: {
          actual: raw,
          normalized,
          message:
            'KRA PIN must be 11 characters: start with A or P followed by 9 digits and a final letter.e.g A001234567B or P051234567Q.',
        },
      };
    }
    return null;
  };
}
