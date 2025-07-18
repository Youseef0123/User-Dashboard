import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthServiceService } from '../../../services/auth-service.service';
import {
  PasswordValidationResult,
  getPasswordRequirements,
} from '../../../shared/validators/password.validator';
import { AuthFacadService } from '../../../services/facadPattern/auth-facad.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  registerForm: any;
  isLoading: boolean = false;

  _authFacadeService = inject(AuthFacadService);
  router = inject(Router);
  fb = inject(FormBuilder);

  passwordsMatchValidator(formGroup: import('@angular/forms').AbstractControl) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  resetPassword = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    },
    {
      validators: this.passwordsMatchValidator,
    }
  );

  get passwordControl() {
    return this.resetPassword.get('newPassword') as FormControl;
  }

  // Get password requirements for real-time validation
  getPasswordRequirements(): PasswordValidationResult {
    return getPasswordRequirements(this.passwordControl);
  }
  // Check if password field has been touched or dirty
  isPasswordTouchedOrDirty(): boolean {
    return this.passwordControl.touched || this.passwordControl.dirty;
  }

  onSubmit(): void {
    if (this.resetPassword.valid) {
      this._authFacadeService
        .resetPasswordRequest(this.passwordControl.value || '')
        .subscribe();
    }
  }
}
