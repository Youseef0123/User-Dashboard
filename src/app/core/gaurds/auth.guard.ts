import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const token=localStorage.getItem('access_token');


  if(token) {
    // If token exists, allow access
    return true;
  }
  else{
    const router=inject(Router);

    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }




};
