import { Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { authGuard } from '../auth/services/auth.guard';
import { InventoryDetailsComponent } from './components/inventory-details/inventory-details.component';
export const routes: Routes = [
  {
    path: '',
    component: InventoryListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'details/:id',
    component: InventoryDetailsComponent,
    canActivate: [authGuard],
  },
];

export const inventoryRoutes = routes;
