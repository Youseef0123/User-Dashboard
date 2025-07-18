import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import e from 'express';

export const guestGaurdGuard: CanActivateFn = (route, state) => {

    const token = localStorage.getItem('access_token');

    if(token){
      const router= inject(Router);
      router.navigate(['/home']);
      return false

    }
      return true;


};
