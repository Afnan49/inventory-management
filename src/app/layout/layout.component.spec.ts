import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { AuthService } from '../auth/services/auth.service';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  const authServiceMock = {
    logOut: jasmine.createSpy('logOut'),
    getCurrentUser: jasmine
      .createSpy('getCurrentUser')
      .and.returnValue({ email: 'demo@example.com' }),
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render current user initial from auth service', () => {
    expect(component.currentUserInitial).toBe('D');
  });
});
