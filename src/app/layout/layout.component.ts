import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/components/button/button.component';
import { Button } from '../shared/model/dropdown';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports: [RouterModule, ButtonComponent],
})
export class LayoutComponent implements OnInit {
  authService = inject(AuthService);
  buttonConfig: Button = {
    id: 'logout',
    label: 'Logout',
    icon: 'pi pi-sign-out',
    class:
      'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 px-10 py-4 !text-lg',
  };
  constructor() {}

  ngOnInit() {}
}
