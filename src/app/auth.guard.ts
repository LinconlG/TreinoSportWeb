import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    if (Date.now() > expiry) {
      localStorage.removeItem('token');
      return router.createUrlTree(['/login']);
    }
    return true;
  } catch {
    localStorage.removeItem('token');
    return router.createUrlTree(['/login']);
  }
};
