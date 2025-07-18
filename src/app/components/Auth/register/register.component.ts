import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import { RegisterRequest, SimplifiedCountry } from '../models/auth.model';
import {
  strongPasswordValidator,
  getPasswordRequirements,
  PasswordValidationResult,
} from '../../../shared/validators/password.validator';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { AuthFacadService } from '../../../services/facadPattern/auth-facad.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  // Countries list (can be moved to separate service later)

  countries: any[] = [];

  // Form variables
  LodingButton = false;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitted = false;
  errorMessage = '';
  getCountriesLoading: boolean = false;

  // Inject services
  _authFacadService = inject(AuthFacadService);
  _error_handel = inject(ErrorHandlerService);
  _router = inject(Router);
  _fb = inject(FormBuilder);

  // authservice2 = inject(AuthServiceService)
  constructor() {}

  ngOnInit(): void {
    this.getCountries();

    this._authFacadService.registerError
      .pipe(untilDestroyed(this))
      .subscribe((error: any) => {
        if (error) {
          this.errorMessage =
            error.message || 'Registration failed. Please try again.';
          console.error('Registration Error:', error);
        }
      });
  }

  registerForm: FormGroup = this._fb.group({
    first_name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        this.firstLetterCapitalValidator.bind(this),
      ],
    ],
    last_name: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        this.firstLetterCapitalValidator.bind(this),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    country_id: ['', Validators.required],
    password: ['', [Validators.required, strongPasswordValidator()]],
    accept: [true],
  });

  get firstNameControl() {
    return this.registerForm.get('first_name') as FormControl;
  }

  get lastNameControl() {
    return this.registerForm.get('last_name') as FormControl;
  }

  get emailControl() {
    return this.registerForm.get('email') as FormControl;
  }

  get countryControl() {
    return this.registerForm.get('country_id') as FormControl;
  }

  get passwordControl() {
    return this.registerForm.get('password') as FormControl;
  }

  // Get password requirements for real-time validation
  getPasswordRequirements(): PasswordValidationResult {
    return getPasswordRequirements(this.passwordControl);
  }

  // Check if field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.valid && (field.touched || field.dirty));
  }

  // Check if form is completely valid for button state
  isFormValid(): boolean {
    return (
      this.registerForm.valid && this.registerForm.get('accept')?.value === true
    );
  }

  onsubmit() {
    this.isSubmitted = true;

    if (this.registerForm.valid) {
      const formValue = this.registerForm.value as RegisterRequest;
      this._authFacadService.sendRegisterRequest(formValue).subscribe();
    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      this._error_handel.handleError(
        { error: { message: 'Please check your input.' } },
        'Form Validation Error'
      );
      this.logFormErrors();
    }
  }

  private logFormErrors(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      if (control && control.invalid) {
        console.log(`${key}:`, {
          value: control.value,
          errors: control.errors,
          touched: control.touched,
          dirty: control.dirty,
        });
      }
    });
  }

  // Real-time name validation helper
  validateNameInput(fieldName: string, event: any): void {
    const value = event.target.value;
    const control = this.registerForm.get(fieldName);

    if (control && value) {
      // Remove spaces automatically
      const cleanedValue = value.replace(/\s+/g, '');
      if (cleanedValue !== value) {
        control.setValue(cleanedValue, { emitEvent: false });
      }

      // Capitalize first letter
      if (cleanedValue.length > 0) {
        const capitalizedValue =
          cleanedValue.charAt(0).toUpperCase() +
          cleanedValue.slice(1).toLowerCase();
        control.setValue(capitalizedValue, { emitEvent: false });
      }
    }
  }

  // Check if password field has been touched or dirty
  isPasswordTouchedOrDirty(): boolean {
    return this.passwordControl.touched || this.passwordControl.dirty;
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Prevent space input in name fields
  preventSpaceInput(event: KeyboardEvent): void {
    if (event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
    }
  }

  capitalizeFirstLetter(fieldName: string): void {
    const control = this.registerForm.get(fieldName);
    if (control && control.value) {
      const value = control.value;
      const capitalizedValue =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      control.setValue(capitalizedValue, { emitEvent: false });
    }
  }

  private firstLetterCapitalValidator(
    control: any
  ): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;

    if (value.charAt(0) !== value.charAt(0).toUpperCase()) {
      return { firstLetterNotCapital: true };
    }

    const namePattern = /^[A-Za-z]+$/;
    if (!namePattern.test(value)) {
      if (value.includes(' ')) {
        return { containsSpaces: true };
      }

      return { invalidCharacters: true };
    }

    return null;
  }
  getCountries() {
    this.getCountriesLoading = true;
    this._authFacadService.GetCountries().subscribe({
      next: (response: any) => {
        console.log('Countries API response:', response);
        this.countries = response.data.map((country: any) => ({
          id: country.id,
          name_en: country.name_en,
        }));
        this.getCountriesLoading = false;
      },
      error: (error) => {
        console.error('Countries API error:', error);
        this.errorMessage = 'Failed to load countries. Please try again later.';
        this.getCountriesLoading = false;
      },
    });
  }
}
