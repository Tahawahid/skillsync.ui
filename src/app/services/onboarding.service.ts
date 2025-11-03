import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  completeOnboarding(onboardingData: OnboardingComplete): Observable<OnboardingResponse> {
    const userId = this.authService.getCurrentUserId();
    console.log('OnboardingService: Sending data for user ID:', userId);
    console.log('OnboardingService: Onboarding data:', onboardingData);
    
    const payload = {
      userId: userId,
      ...onboardingData
    };
    
    console.log('OnboardingService: Complete payload:', payload);
    return this.http.post<OnboardingResponse>(`${this.API_URL}/complete`, payload);
  }

  getOnboardingData(): Observable<OnboardingComplete> {
    const userId = this.authService.getCurrentUserId();
    console.log('OnboardingService: Getting data for user ID:', userId);
    return this.http.get<OnboardingComplete>(`${this.API_URL}/data/${userId}`);
  }
}