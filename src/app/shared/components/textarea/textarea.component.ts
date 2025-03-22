import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class TextareaComponent implements OnInit {
  inputId = input<string>('');
  placeholder = input<string>('');
  control = input<any>();
  class = input<string>('');
  constructor() {}

  ngOnInit() {}
  getErrorMessage(error: any, validationError: any): any {
    const errorMessages: Record<string, (error: any) => string> = {
      required: () => 'This field is required',
      minlength: (error) =>
        `Minimum length is ${error.requiredLength} characters`,
    };

    return errorMessages[error]?.(validationError) || 'Invalid input';
  }
}
