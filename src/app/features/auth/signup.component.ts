import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Create Your Account</h2>
          <p>Join SkillSync to advance your career</p>
        </div>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <!-- Form fields remain the same -->
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('firstName')"
              />
              <div class="invalid-feedback" *ngIf="isFieldInvalid('firstName')">
                First name is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('lastName')"
              />
              <div class="invalid-feedback" *ngIf="isFieldInvalid('lastName')">
                Last name is required
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
              <span *ngIf="signupForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="signupForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password')"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
              Password must be at least 6 characters long
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              formControlName="confirmPassword"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('confirmPassword')"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('confirmPassword')">
              <span *ngIf="signupForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</span>
              <span *ngIf="signupForm.get('confirmPassword')?.errors?.['mismatch']">Passwords don't match</span>
            </div>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                formControlName="agreeToTerms"
                [class.is-invalid]="isFieldInvalid('agreeToTerms')"
              />
              <span class="checkmark"></span>
              I agree to the <a href="#" class="terms-link">Terms and Conditions</a>
            </label>
            <div class="invalid-feedback" *ngIf="isFieldInvalid('agreeToTerms')">
              You must agree to the terms and conditions
            </div>
          </div>
          
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button
            type="submit"
            class="btn btn-primary btn-full"
            [disabled]="signupForm.invalid || isLoading"
          >
            <span *ngIf="isLoading">Creating Account...</span>
            <span *ngIf="!isLoading">Create Account</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login" class="auth-link">Sign In</a></p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
    } else if (confirmPassword?.hasError('mismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.register(this.signupForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            // Redirect to login after successful signup
            this.router.navigate(['/login'], { 
              queryParams: { message: 'Registration successful. Please login.' }
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}