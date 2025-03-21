import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../model/user';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ===< properties >===
  http = inject(HttpClient);
  router = inject(Router);
  messageService = inject(MessageService);
  // ===< decode token >===
  private decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      return payload;
    } catch (error) {
      return null;
    }
  }
  // ===< generate token >===
  private generateToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        email: user.email,
        id: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      })
    );
    const signature = btoa('dummy-signature');
    return `${header}.${payload}.${signature}`;
  }
  // ===< is logged in >===
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const decodedToken = this.decodeToken(token);
      if (!decodedToken) return false;

      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        this.logOut();
        return false;
      }
      return true;
    } catch (error) {
      this.logOut();
      return false;
    }
  }
  // ===< get current user >===
  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return this.decodeToken(token);
    } catch {
      return null;
    }
  }
  // ===< log out >===
  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.messageService.add({
      severity: 'info',
      summary: 'Logged Out',
      detail: 'You have been successfully logged out',
    });
  }
  // ===< log in >===
  logIn(User: User) {
    this.http.get(`${environment.BaseUrl}/users`).subscribe({
      next: (res: any) => {
        const user = res.find(
          (u: User) => u.email === User.email && u.password === User.password
        );
        if (user) {
          const token = this.generateToken(user);
          localStorage.setItem('token', token);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful!',
          });
          this.router.navigate(['/inventory']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid email or password',
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while logging in',
        });
        console.error('Login error:', error);
      },
    });
  }
  // ===< sign up >===
  signUp(user: User) {
    this.http.post(`${environment.BaseUrl}/users`, user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while signing up',
        });
        console.error('Signup error:', error);
      },
    });
  }
}
