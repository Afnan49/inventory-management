import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchinput',
  templateUrl: './searchinput.component.html',
  styleUrls: ['./searchinput.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class SearchinputComponent implements OnInit {
  searchControl: string = '';
  @Output() search = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}
}
