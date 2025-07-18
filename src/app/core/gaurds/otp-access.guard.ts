import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OtpAccessGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if reset_data exists in localStorage
    const resetData = localStorage.getItem('reset_data');

    if (resetData) {
      try {
        const parsedData = JSON.parse(resetData);
        // Check if email exists and is not empty
        if (parsedData.email && parsedData.email.trim() !== '') {
          // Email exists, allow access to OTP page
          return true;
        }
      } catch (error) {
        // Invalid JSON in localStorage, remove it
        localStorage.removeItem('reset_data');
      }
    }

    // No valid email found, redirect to forget-password page
    this.router.navigate(['/forget-password']);
    return false;
  }
}
