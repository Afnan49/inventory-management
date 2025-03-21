import {
  Component,
  EventEmitter,
  HostListener,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '../../model/dropdown';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  actions = input.required<Action[]>();
  @Output() actionClicked = new EventEmitter<string>();
  ngOnInit() {}
  onClick(actionId: string) {
    this.actionClicked.emit(actionId);
  }
}
