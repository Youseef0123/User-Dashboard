import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../models/auth.model';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { AuthFacadService } from '../../../services/facadPattern/auth-facad.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy()
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  showPassword = false;
  isSubmitted = false;
  errorMessage = '';

  _authFacadService = inject(AuthFacadService);
  _error_handel = inject(ErrorHandlerService);
  _router = inject(Router);
  _fb = inject(FormBuilder);

  ngOnInit(): void {
    this._authFacadService.loginError
      .pipe(untilDestroyed(this))
      .subscribe((error: any) => {
        if (error) {
          this.errorMessage =
            error.message || 'Login failed. Please try again.';
        }
      });
  }

  loginForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    logged: [false],
  });

  get emailControl() {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl() {
    return this.loginForm.get('password') as FormControl;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.valid && (field.touched || field.dirty));
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value as LoginRequest;
      this._authFacadService.sendLoginRequst(formValue).subscribe();
    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
      this._error_handel.handleError(
        { error: { message: 'Please check your email and password format.' } },
        'Form Validation Error'
      );
    }
  }

  // Navigate to register page
  goToRegister() {
    this._router.navigate(['/register']);
  }

  // Navigate to forget password
  goToForgetPassword() {
    this._router.navigate(['/forget-password']);
  }
}
