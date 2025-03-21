import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [RouterLink, ReactiveFormsModule],
})
export class SignupComponent implements OnInit {
  //====< inject the form builder >====
  private fb = inject(FormBuilder);
  //====< email pattern >====
  private readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //====< inject the auth service >====
  authService = inject(AuthService);
  constructor() {}

  ngOnInit() {}
  //====< sign up form >====
  signUpForm = this.fb.group({
    FirstName: ['', [Validators.required, Validators.minLength(3)]],
    LastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  //====< on submit >====
  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signUp(this.signUpForm.value as User);
    }
  }
}
