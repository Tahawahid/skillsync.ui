import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OnboardingComplete, OnboardingResponse } from '../models/onboarding.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private readonly API_URL = 'https://localhost:7247/api/onboarding';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  completeOnboarding(onboardingData: OnboardingComplete): Observable<OnboardingResponse> {
    return this.http.post<OnboardingResponse>(
      `${this.API_URL}/complete`, 
      onboardingData,
      { headers: this.getHeaders() }
    );
  }

  getOnboardingData(): Observable<OnboardingComplete> {
    return this.http.get<OnboardingComplete>(
      `${this.API_URL}/data`,
      { headers: this.getHeaders() }
    );
  }
}