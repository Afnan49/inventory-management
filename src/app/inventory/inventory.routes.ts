import { Routes } from '@angular/router';
import { InventoryListComponent } from './components/inventory-list/inventory-list.component';
import { InventoryDetailsComponent } from './components/inventory-details/inventory-details.component';
import { InventoryAddComponent } from './components/inventory-add/inventory-add.component';

export const routes: Routes = [
  {
    path: '',
    component: InventoryListComponent,
  },
  {
    path: 'details/:id',
    component: InventoryDetailsComponent,
  },
  {
    path: 'add',
    component: InventoryAddComponent,
  },
  {
    path: 'edit/:id',
    component: InventoryAddComponent,
  },
];

export const inventoryRoutes = routes;
