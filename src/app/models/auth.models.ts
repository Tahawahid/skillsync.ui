export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user?: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isOnboardingCompleted: boolean;
}