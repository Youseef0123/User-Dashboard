import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthServiceService);
  const token = localStorage.getItem('access_token');

  if (token) {
    const decryptedToken = authService.decryptToken(token);
    if (decryptedToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${decryptedToken}`
        }
      });
    }
  }

  return next(req);
};
