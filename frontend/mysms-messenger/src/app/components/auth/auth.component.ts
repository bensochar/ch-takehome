import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <ul class="nav nav-tabs mb-4">
                <li class="nav-item">
                  <a class="nav-link" [class.active]="!isSignUp" (click)="isSignUp = false" href="javascript:void(0)">Sign In</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" [class.active]="isSignUp" (click)="isSignUp = true" href="javascript:void(0)">Sign Up</a>
                </li>
              </ul>

              <!-- Sign Up Form -->
              <form *ngIf="isSignUp" (ngSubmit)="onSignUp()">
                <div class="mb-3">
                  <label for="signUpName" class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="signUpName"
                    [(ngModel)]="signUpForm.name"
                    name="name"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="signUpEmail" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="signUpEmail"
                    [(ngModel)]="signUpForm.email"
                    name="email"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="signUpPassword" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="signUpPassword"
                    [(ngModel)]="signUpForm.password"
                    name="password"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="passwordConfirmation" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="passwordConfirmation"
                    [(ngModel)]="signUpForm.password_confirmation"
                    name="password_confirmation"
                    required
                  >
                </div>
                <button type="submit" class="btn btn-primary w-100">Sign Up</button>
              </form>

              <!-- Sign In Form -->
              <form *ngIf="!isSignUp" (ngSubmit)="onSignIn()">
                <div class="mb-3">
                  <label for="signInEmail" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="signInEmail"
                    [(ngModel)]="signInForm.email"
                    name="email"
                    required
                  >
                </div>
                <div class="mb-3">
                  <label for="signInPassword" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="signInPassword"
                    [(ngModel)]="signInForm.password"
                    name="password"
                    required
                  >
                </div>
                <button type="submit" class="btn btn-primary w-100">Sign In</button>
              </form>

              <div *ngIf="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  isSignUp = false;
  error = '';

  signUpForm = {
    email: '',
    password: '',
    password_confirmation: '',
    name: ''
  };

  signInForm = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignUp() {
    this.error = '';
    if (this.signUpForm.password !== this.signUpForm.password_confirmation) {
      this.error = 'Passwords do not match';
      return;
    }

    this.authService.signUp(this.signUpForm).subscribe({
      next: () => {
        this.router.navigate(['/messages']);
      },
      error: (err) => {
        this.error = err.error?.errors?.join(', ') || 'Sign up failed';
      }
    });
  }

  onSignIn() {
    this.error = '';
    this.authService.signIn(this.signInForm).subscribe({
      next: (response) => {
        console.log('Sign in successful:', response);
        if (this.authService.isAuthenticated()) {
          console.log('Authentication confirmed, navigating to messages');
          this.router.navigate(['/messages']);
        } else {
          console.error('Authentication headers not set properly');
          this.error = 'Authentication failed - headers not received';
        }
      },
      error: (err) => {
        console.error('Sign in error:', err);
        this.error = err.error?.errors?.join(', ') || 'Sign in failed';
      }
    });
  }
}
