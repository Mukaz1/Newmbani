/* eslint-disable no-useless-escape */
import { FormControl } from '@angular/forms';

export function passwordValidator() {
  return (control: FormControl): { [key: string]: boolean } | null => {
    const value: string = control.value;

    // Check for at least 1 number
    const hasNumber = /[0-9]/.test(value);
    // Check for at least 1 special character
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      value
    );
    // Check for at least 1 lowercase letter
    const hasLowerCase = /[a-z]/.test(value);
    // Check for at least 1 uppercase letter
    const hasUpperCase = /[A-Z]/.test(value);
    // Check for minimum length of 8 characters
    const hasMinLength = value.length >= 8;

    // Combine all conditions
    const isValid =
      hasNumber &&
      hasSpecialCharacter &&
      hasLowerCase &&
      hasUpperCase &&
      hasMinLength;

    return isValid ? null : { invalidNewPassword: true };
  };
}
