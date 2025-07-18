import { CanActivateFn } from '@angular/router';

export const resetPasswordGuard: CanActivateFn = (_route, _state) => {

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

  return false;
};
