import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeatherService } from './services/weather.service';
import { WeatherForecast } from './models/weather-forecast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('SkillSync Weather App');
  protected readonly weatherData = signal<WeatherForecast[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeatherData();
  }

  loadWeatherData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.getWeatherForecast().subscribe({
      next: (data) => {
        this.weatherData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load weather data. Please make sure the backend API is running.');
        this.loading.set(false);
        console.error('Error fetching weather data:', err);
      },
    });
  }
}
