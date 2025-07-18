import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordAccessGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const otpVerified = localStorage.getItem('otpVerified');
    const resetData = localStorage.getItem('reset_data');

    if (otpVerified === 'true' && resetData) {
      try {
        const parsedData = JSON.parse(resetData);
        if (parsedData.email && parsedData.email.trim() !== '') {
          return true;
        }
      } catch (error) {
        localStorage.removeItem('reset_data');
        localStorage.removeItem('otpVerified');
      }
    }

    if (resetData) {
      try {
        const parsedData = JSON.parse(resetData);
        if (parsedData.email && parsedData.email.trim() !== '') {
          this.router.navigate(['/otp']);
          return false;
        }
      } catch (error) {
        localStorage.removeItem('reset_data');
      }
    }
    this.router.navigate(['/forget-password']);
    return false;
  }
}
