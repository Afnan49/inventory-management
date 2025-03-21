import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { Button } from '../../model/dropdown';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  config = input<Button>();
  @Output() onClick = new EventEmitter<any>();

  onButtonClick(id: string | undefined) {
    this.onClick.emit(id);
  }
  constructor() {}

  ngOnInit() {}
}
