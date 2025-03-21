import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { inventoryRoutes } from './inventory/inventory.routes';

import { authGuard } from './auth/services/auth.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'inventory',
        children: inventoryRoutes,
      },
    ],
  },
  {
    path: '',
    children: authRoutes,
  },
];

export const appRoutes = routes;
