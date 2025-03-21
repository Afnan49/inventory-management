import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { inventoryRoutes } from './inventory/inventory.routes';

export const routes: Routes = [
  {
    path: '',
    children: authRoutes,
  },
  {
    path: 'inventory',
    children: inventoryRoutes,
  },
];

export const appRoutes = routes;
