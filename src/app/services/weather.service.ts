import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { WeatherForecast } from '../models/weather-forecast';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // List of possible API endpoints to try (based on launch settings)
  private possibleUrls = [
    'https://localhost:7247/WeatherForecast', // HTTPS primary
    'http://localhost:5229/WeatherForecast', // HTTP primary
    'https://localhost:44372/WeatherForecast', // IIS Express SSL
    'http://localhost:22098/WeatherForecast', // IIS Express
  ];

  private workingApiUrl: string | null = null;

  constructor(private http: HttpClient) {}

  getWeatherForecast(): Observable<WeatherForecast[]> {
    // If we already found a working URL, use it
    if (this.workingApiUrl) {
      return this.http.get<WeatherForecast[]>(this.workingApiUrl);
    }

    // Try each URL until we find one that works
    return this.tryUrls(0);
  }

  private tryUrls(index: number): Observable<WeatherForecast[]> {
    if (index >= this.possibleUrls.length) {
      // If all URLs failed, throw an error
      throw new Error(
        'Could not connect to any API endpoint. Please ensure the backend is running.'
      );
    }

    const currentUrl = this.possibleUrls[index];

    return this.http.get<WeatherForecast[]>(currentUrl).pipe(
      switchMap((data) => {
        // Success! Save this URL for future requests
        this.workingApiUrl = currentUrl;
        console.log(`Connected to API at: ${currentUrl}`);
        return of(data);
      }),
      catchError(() => {
        // This URL failed, try the next one
        console.log(`Failed to connect to: ${currentUrl}`);
        return this.tryUrls(index + 1);
      })
    );
  }

  // Method to reset the working URL (useful for testing or if connection changes)
  resetConnection(): void {
    this.workingApiUrl = null;
  }
}
