import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { SignupComponent } from './features/auth/signup.component';
import { OnboardingComponent } from './features/onboarding/onboarding.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'onboarding', component: OnboardingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/login' }
];