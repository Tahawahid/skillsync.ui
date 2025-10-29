import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1>Welcome back, {{ user?.firstName }}!</h1>
            <p>Ready to advance your career?</p>
          </div>
          <div class="user-actions">
            <button class="btn btn-outline" (click)="logout()">Logout</button>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <div class="card-icon">📚</div>
            <h3>Learning Path</h3>
            <p>Continue your personalized learning journey</p>
            <button class="btn btn-primary">View Progress</button>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">🎯</div>
            <h3>Career Goals</h3>
            <p>Track your career objectives and milestones</p>
            <button class="btn btn-primary">View Goals</button>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">💼</div>
            <h3>Job Matches</h3>
            <p>Discover opportunities that match your skills</p>
            <button class="btn btn-primary">Find Jobs</button>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">📊</div>
            <h3>Skill Assessment</h3>
            <p>Evaluate and improve your current skills</p>
            <button class="btn btn-primary">Take Assessment</button>
          </div>
        </div>

        <div class="recent-activity">
          <h2>Recent Activity</h2>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-icon">✅</div>
              <div class="activity-content">
                <h4>Profile Completed</h4>
                <p>You've successfully completed your onboarding process</p>
                <span class="activity-time">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    
    // If user is not authenticated, redirect to login
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}