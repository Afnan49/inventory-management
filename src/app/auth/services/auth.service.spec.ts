import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../environment/environment';
import { User } from '../model/user';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    firstname: 'John',
    lastname: 'Doe',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService, MessageService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user and store token when credentials are valid', () => {
    const mockResponse = [mockUser];
    spyOn(localStorage, 'setItem');
    spyOn(service.router, 'navigate');

    service.logIn({
      email: mockUser.email,
      password: mockUser.password,
    } as User);

    const req = httpMock.expectOne(`${environment.BaseUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(service.router.navigate).toHaveBeenCalledWith(['/inventory']);
  });

  it('should return null for getCurrentUser when no token exists', () => {
    const result = service.getCurrentUser();
    expect(result).toBeNull();
  });

  it('should correctly decode token and return user data', () => {
    const token = service['generateToken'](mockUser);
    localStorage.setItem('token', token);

    const user = service.getCurrentUser();

    expect(user).toBeTruthy();
    expect(user.email).toBe(mockUser.email);
    expect(user.id).toBe(mockUser.id);
  });

  it('should return false for isLoggedIn when token is expired', () => {
    const expiredToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 3600 })) +
      '.signature';
    localStorage.setItem('token', expiredToken);

    const isLoggedIn = service.isLoggedIn();

    expect(isLoggedIn).toBeFalse();
  });
});
