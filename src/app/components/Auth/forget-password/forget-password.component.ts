import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthFacadService } from '../../../services/facadPattern/auth-facad.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { customEmailValidator } from '../../../shared/validators/password.validator';

@UntilDestroy()
@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  authFacadeService = inject(AuthFacadService);
  private _fb = inject(FormBuilder);

  isSubmitted = false;
  forgetPasswordForm = this._fb.group({
    email: ['', [Validators.required, Validators.email, customEmailValidator]],
  });

  get emailControl() {
    return this.forgetPasswordForm.get('email');
  }

  get emailIsRequired() {
    return this.emailControl?.hasError('required') && this.isSubmitted;
  }

  get emailInvalid() {
    return (
      this.emailControl?.hasError('invalidEmailFormat') && this.isSubmitted
    );
  }

  get emailHasErrors() {
    return this.emailInvalid || this.emailIsRequired;
  }

  submit(): void {
    this.isSubmitted = true;
    if (this.forgetPasswordForm.valid) {
      this.authFacadeService
        .sendForgetPasswordRequest(this.emailControl?.value || '')
        .pipe(untilDestroyed(this))
        .subscribe();
    }
  }
}
