import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterLink, ReactiveFormsModule],
  standalone: true,
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private readonly EMAIL_PATTERN =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  authService = inject(AuthService);

  constructor() {}

  ngOnInit() {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern(this.EMAIL_PATTERN)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.logIn(this.loginForm.value as User);
    }
  }
}
