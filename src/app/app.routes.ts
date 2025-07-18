import { Routes } from '@angular/router';
import { RegisterComponent } from './components/Auth/register/register.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard } from './core/gaurds/auth.guard';
import { guestGaurdGuard } from './core/gaurds/guest-gaurd.guard';
import { ForgetPasswordComponent } from './components/Auth/forget-password/forget-password.component';
import { OtpComponent } from './components/Auth/otp/otp.component';
import { ResetPasswordComponent } from './components/Auth/reset-password/reset-password.component';
import { OtpAccessGuard } from './core/gaurds/otp-access.guard';
import { ResetPasswordAccessGuard } from './core/gaurds/reset-password-access.guard';





export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path:'home',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard]
  },
  {path: 'register', component: RegisterComponent, title: 'Register', canActivate: [guestGaurdGuard]},
  {path: 'login', component: LoginComponent, title: 'Login', canActivate: [guestGaurdGuard]},
  {path:'forget-password',component: ForgetPasswordComponent, title: 'Forget Password', canActivate: [guestGaurdGuard]},
  {path:'otp',component:OtpComponent, title: 'OTP Verification', canActivate: [ OtpAccessGuard]},
  {path:'reset-password',component:ResetPasswordComponent, title: 'Reset Password', canActivate: [ ResetPasswordAccessGuard]},
  {path: 'error', component: ErrorPageComponent, title: 'Error Page'},
  {path: '**', redirectTo: '/error'},
];
