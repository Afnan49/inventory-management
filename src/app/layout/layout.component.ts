import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/components/button/button.component';
import { Button } from '../shared/model/dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  exact?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [RouterModule, ButtonComponent, NgxSpinnerModule],
})
export class LayoutComponent {
  authService = inject(AuthService);

  buttonConfig: Button = {
    id: 'logout',
    label: 'Logout',
    icon: 'pi pi-sign-out',
    class: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 px-4 py-2',
  };

  primaryNavigation: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: '/dashboard',
      exact: true,
    },
    { label: 'Inventory', icon: 'pi pi-warehouse', route: '/inventory' },
    { label: 'Reports', icon: 'pi pi-chart-bar', disabled: true },
    { label: 'Suppliers', icon: 'pi pi-users', disabled: true },
    { label: 'Orders', icon: 'pi pi-inbox', disabled: true },
    { label: 'Manage Store', icon: 'pi pi-shop', disabled: true },
  ];

  footerNavigation: NavItem[] = [
    { label: 'Settings', icon: 'pi pi-cog', disabled: true },
  ];

  get currentUserInitial(): string {
    const email = this.authService.getCurrentUser()?.email;
    return (email || 'A').charAt(0).toUpperCase();
  }
}
