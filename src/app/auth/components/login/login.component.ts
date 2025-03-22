import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';
import { InputComponent } from '../../../shared/components/input/input.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterLink, ReactiveFormsModule, InputComponent],
  standalone: true,
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  //====< inject the form builder >====
  private fb = inject(FormBuilder);
  //====< email pattern >====
  private readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //====< inject the auth service >====
  authService = inject(AuthService);

  constructor() {}

  ngOnInit() {
    // this.loginForm.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });
  }

  //====< login form >====
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  //====< on submit >====
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.logIn(this.loginForm.value as User);
    }
  }
}
