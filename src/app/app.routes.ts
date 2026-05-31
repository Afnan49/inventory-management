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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
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
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

export const appRoutes = routes;
