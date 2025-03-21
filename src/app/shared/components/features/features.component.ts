import { Component, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
  standalone: true,
})
export class FeaturesComponent implements OnInit {
  features = input<string[]>();
  label = input<string>();
  constructor() {}

  ngOnInit() {}
}
