import { NgClass } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [RatingModule, FormsModule, NgClass],
})
export class RatingComponent implements OnInit {
  config = input<number>(0);
  canRate = input<boolean>(false);
  constructor() {}

  ngOnInit() {}
}
