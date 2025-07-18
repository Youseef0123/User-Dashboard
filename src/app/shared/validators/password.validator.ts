import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasMaxLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasNoSpaces: boolean;
}

export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Don't validate empty value, let required validator handle it
    }

    const minLength = value.length >= 8;
    const maxLength = value.length <= 20;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    const hasNoSpaces = !/\s/.test(value);

    const passwordValid =
      minLength &&
      maxLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar &&
      hasNoSpaces;

    if (!passwordValid) {
      return {
        strongPassword: {
          hasMinLength: minLength,
          hasMaxLength: maxLength,
          hasUpperCase: hasUpperCase,
          hasLowerCase: hasLowerCase,
          hasNumber: hasNumber,
          hasSpecialChar: hasSpecialChar,
          hasNoSpaces: hasNoSpaces,
        },
      };
    }

    return null;
  };
}

export function getPasswordRequirements(
  control: AbstractControl
): PasswordValidationResult {
  const value = control.value || '';

  return {
    hasMinLength: value.length >= 8,
    hasMaxLength: value.length <= 20,
    hasUpperCase: /[A-Z]/.test(value),
    hasLowerCase: /[a-z]/.test(value),
    hasNumber: /[0-9]/.test(value),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
    hasNoSpaces: !/\s/.test(value),
  };
}

export function customEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!pattern.test(email)) {
      return { invalidEmailFormat: true };
    }
    return null;
  };
}
