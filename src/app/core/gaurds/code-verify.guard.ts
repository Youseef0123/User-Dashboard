import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const codeVerifyGuard: CanActivateFn = (route, state) => {


  const router = inject(Router);
  const resetData = localStorage.getItem('reset_data');


   if (!resetData) {
    return router.navigate(['/forget-password']);
  }
// const parsed = JSON.parse(resetData);

//   if (parsed.step === 'email_sent') {
//     return true;
//   }

  return router.navigate(['/forget-password']);




};
