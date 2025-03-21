import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  //====< inject the auth service >====
  const isLoggedIn = inject(AuthService).isLoggedIn();
  //====< inject the router >====
  const router = inject(Router);

  const authRoutes = ['/login', '/signup', ''];
  //====< if the user is logged in and the route is an auth route >====
  if (authRoutes.includes(state.url) && isLoggedIn) {
    router.navigate(['/inventory']);
    return false;
  }

  //====< if the user is not logged in and the route is not an auth route >====
  if (!authRoutes.includes(state.url) && !isLoggedIn) {
    router.navigate(['/login']);
    return false;
  }
  //====< return true >====
  return true;
};
