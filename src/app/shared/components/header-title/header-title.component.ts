import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html',
  styleUrls: ['./header-title.component.scss'],
})
export class HeaderTitleComponent implements OnInit {
  label = input<string>('');
  path = input<string>('');
  router = inject(Router);
  constructor() {}

  ngOnInit() {}
  onClick() {
    this.router.navigate([this.path()]);
  }
}
