import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegisterRequest, LoginRequest, AuthResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7247/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  register(registerData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerData);
  }

  login(loginData: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          if (response.success && response.user) {
            console.log('Storing user data:', response.user);
            this.setCurrentUser(response.user);
          }
        })
      );
  }

  logout(): void {
    console.log('Logging out, clearing storage');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const userId = this.getCurrentUserId();
    return !!user && !!userId;
  }

  private setCurrentUser(user: User): void {
    console.log('Setting current user:', user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userId', user.id.toString()); // Store user ID separately
    this.currentUserSubject.next(user);
    
    console.log('Stored user ID:', user.id);
    console.log('Verification - User ID in storage:', localStorage.getItem('userId'));
  }

  private loadUserFromStorage(): void {
    console.log('Loading user from storage...');
    const userJson = localStorage.getItem('currentUser');
    const userId = localStorage.getItem('userId');
    
    console.log('Storage check:', { hasUser: !!userJson, hasUserId: !!userId });
    
    if (userJson && userId) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      console.log('User loaded from storage:', user);
    } else {
      console.log('No user data in storage');
    }
  }
}