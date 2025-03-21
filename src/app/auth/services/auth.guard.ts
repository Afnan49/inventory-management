import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(AuthService).isLoggedIn();
  const router = inject(Router);

  const authRoutes = ['/login', '/signup', ''];

  if (authRoutes.includes(state.url) && isLoggedIn) {
    router.navigate(['/inventory']);
    return false;
  }

  if (!authRoutes.includes(state.url) && !isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
