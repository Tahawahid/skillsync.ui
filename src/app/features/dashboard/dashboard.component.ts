import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';
import { PersonalInformationComponent } from '../personal-information/personal-information.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PersonalInformationComponent],
  template: `
    <div class="dashboard-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>SkillSync</h3>
        </div>
        <nav class="sidebar-nav">
          <ul>
            <li [class.active]="activeTab === 'overview'" (click)="setActiveTab('overview')">
              <span class="nav-icon">🏠</span>
              <span>Overview</span>
            </li>
            <li [class.active]="activeTab === 'personal-info'" (click)="setActiveTab('personal-info')">
              <span class="nav-icon">👤</span>
              <span>Personal Information</span>
            </li>
            <li [class.active]="activeTab === 'learning'" (click)="setActiveTab('learning')">
              <span class="nav-icon">📚</span>
              <span>Learning Path</span>
            </li>
            <li [class.active]="activeTab === 'goals'" (click)="setActiveTab('goals')">
              <span class="nav-icon">🎯</span>
              <span>Career Goals</span>
            </li>
            <li [class.active]="activeTab === 'jobs'" (click)="setActiveTab('jobs')">
              <span class="nav-icon">💼</span>
              <span>Job Matches</span>
            </li>
          </ul>
        </nav>
        <div class="sidebar-footer">
          <button class="btn btn-logout" (click)="logout()">
            <span class="nav-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <div class="dashboard-header">
          <div class="header-content">
            <div class="welcome-section">
              <h1>Welcome back, {{ user?.firstName }}!</h1>
              <p>{{ getTabDescription() }}</p>
            </div>
            <div class="user-actions">
              <div class="user-avatar">
                {{ user?.firstName?.charAt(0) }}{{ user?.lastName?.charAt(0) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="dashboard-content">
          <!-- Overview Tab -->
          <div *ngIf="activeTab === 'overview'" class="tab-content">
            <div class="dashboard-grid">
              <div class="dashboard-card" (click)="setActiveTab('personal-info')">
                <div class="card-icon">👤</div>
                <h3>Personal Information</h3>
                <p>View and update your profile details</p>
                <button class="btn btn-primary">Manage Profile</button>
              </div>

              <div class="dashboard-card" (click)="setActiveTab('learning')">
                <div class="card-icon">📚</div>
                <h3>Learning Path</h3>
                <p>Continue your personalized learning journey</p>
                <button class="btn btn-primary">View Progress</button>
              </div>

              <div class="dashboard-card" (click)="setActiveTab('goals')">
                <div class="card-icon">🎯</div>
                <h3>Career Goals</h3>
                <p>Track your career objectives and milestones</p>
                <button class="btn btn-primary">View Goals</button>
              </div>

              <div class="dashboard-card" (click)="setActiveTab('jobs')">
                <div class="card-icon">💼</div>
                <h3>Job Matches</h3>
                <p>Discover opportunities that match your skills</p>
                <button class="btn btn-primary">Find Jobs</button>
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

          <!-- Personal Information Tab -->
          <div *ngIf="activeTab === 'personal-info'" class="tab-content">
            <app-personal-information></app-personal-information>
          </div>

          <!-- Other Tabs (Placeholder) -->
          <div *ngIf="activeTab === 'learning'" class="tab-content">
            <h2>Learning Path</h2>
            <p>Coming soon...</p>
          </div>

          <div *ngIf="activeTab === 'goals'" class="tab-content">
            <h2>Career Goals</h2>
            <p>Coming soon...</p>
          </div>

          <div *ngIf="activeTab === 'jobs'" class="tab-content">
            <h2>Job Matches</h2>
            <p>Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  activeTab: string = 'overview';

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

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTabDescription(): string {
    switch (this.activeTab) {
      case 'overview':
        return 'Ready to advance your career?';
      case 'personal-info':
        return 'Manage your personal and professional information';
      case 'learning':
        return 'Track your learning progress and skills development';
      case 'goals':
        return 'Monitor your career objectives and achievements';
      case 'jobs':
        return 'Discover new opportunities that match your profile';
      default:
        return 'Ready to advance your career?';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}