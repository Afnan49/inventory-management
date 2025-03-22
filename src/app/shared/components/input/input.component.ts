import { Component, input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class InputComponent implements OnInit {
  inputId = input<string>('');
  type = input.required<string>();
  placeholder = input.required<string>();
  control = input.required<any>();
  controlName = input.required<string>();
  class = input<string>();

  getErrorMessage(error: any, validationError: any): any {
    const errorMessages: Record<string, (error: any) => string> = {
      required: () => 'This field is required',
      minlength: (error) =>
        `Minimum length is ${error.requiredLength} characters`,
      pattern: () => 'Invalid Email',
    };

    return errorMessages[error]?.(validationError) || 'Invalid input';
  }

  constructor() {}

  ngOnInit() {
    // console.log(this.control());
  }
}
