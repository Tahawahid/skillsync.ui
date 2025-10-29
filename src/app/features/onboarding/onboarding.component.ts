import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { EducationComponent } from './education/education.component';
import { WorkExperienceComponent } from './work-experience/work-experience.component';
import { SkillsComponent } from './skills/skills.component';
import { CareerGoalsComponent } from './career-goals/career-goals.component';
import { ReviewComponent } from './review/review.component';
import { OnboardingService } from '../../services/onboarding.service';
import { OnboardingComplete, PersonalDetails, Education, WorkExperience, Skills, CareerGoals } from '../../models/onboarding.models';
import { AuthService } from '../../services/auth.service'; // <-- Add this import


@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    PersonalDetailsComponent,
    EducationComponent,
    WorkExperienceComponent,
    SkillsComponent,
    CareerGoalsComponent,
    ReviewComponent
  ],
  template: `
    <div class="onboarding-container">
      <div class="onboarding-header">
        <h1>Complete Your Profile</h1>
        <div class="progress-bar">
          <div class="progress" [style.width.%]="progressPercentage"></div>
        </div>
        <p>Step {{ currentStep }} of 6</p>
      </div>

      <div class="onboarding-content">
        <div class="form-container">
          <!-- Personal Details -->
          <app-personal-details
            *ngIf="currentStep === 1"
            [data]="onboardingData.personalDetails"
            (dataChange)="updatePersonalDetails($event)"
            (next)="nextStep()"
          ></app-personal-details>

          <!-- Education -->
          <app-education
            *ngIf="currentStep === 2"
            [data]="onboardingData.education"
            (dataChange)="updateEducation($event)"
            (next)="nextStep()"
            (previous)="previousStep()"
          ></app-education>

          <!-- Work Experience -->
          <app-work-experience
            *ngIf="currentStep === 3"
            [data]="onboardingData.workExperience"
            (dataChange)="updateWorkExperience($event)"
            (next)="nextStep()"
            (previous)="previousStep()"
          ></app-work-experience>

          <!-- Skills -->
          <app-skills
            *ngIf="currentStep === 4"
            [data]="onboardingData.skills"
            (dataChange)="updateSkills($event)"
            (next)="nextStep()"
            (previous)="previousStep()"
          ></app-skills>

          <!-- Career Goals -->
          <app-career-goals
            *ngIf="currentStep === 5"
            [data]="onboardingData.careerGoals"
            (dataChange)="updateCareerGoals($event)"
            (next)="nextStep()"
            (previous)="previousStep()"
          ></app-career-goals>

          <!-- Review -->
          <app-review
            *ngIf="currentStep === 6"
            [data]="onboardingData"
            (previous)="previousStep()"
            (complete)="completeOnboarding()"
            [isLoading]="isLoading"
          ></app-review>
        </div>
      </div>
    </div>
  `,
  styleUrl: './onboarding.component.scss'
})
export class OnboardingComponent implements OnInit {
  currentStep = 1;
  totalSteps = 6;
  isLoading = false;

  onboardingData: OnboardingComplete = {
    personalDetails: {
      age: 0,
      location: '',
      currentRole: ''
    },
    education: {
      highestEducation: '',
      fieldOfStudy: '',
      graduationYear: undefined,
      certifications: []
    },
    workExperience: {
      experienceLevel: '',
      jobRoles: []
    },
    skills: {
      technicalSkills: [],
      softSkills: [],
      skillsToLearn: []
    },
    careerGoals: {
      goals: [],
      timeframe: '',
      preferredIndustries: [],
      workPreference: ''
    }
  };

  constructor(
    private onboardingService: OnboardingService,
    private router: Router,
    private authService: AuthService // <-- Inject AuthService here
  ) {}

  ngOnInit() {
    // Load existing data if available
    this.loadExistingData();
  }

  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  updatePersonalDetails(data: PersonalDetails) {
    this.onboardingData.personalDetails = data;
  }

  updateEducation(data: Education) {
    this.onboardingData.education = data;
  }

  updateWorkExperience(data: WorkExperience) {
    this.onboardingData.workExperience = data;
  }

  updateSkills(data: Skills) {
    this.onboardingData.skills = data;
  }

  updateCareerGoals(data: CareerGoals) {
    this.onboardingData.careerGoals = data;
  }

  // ...existing code...

completeOnboarding() {
  this.isLoading = true;
  this.onboardingService.completeOnboarding(this.onboardingData).subscribe({
    next: (response) => {
      this.isLoading = false;
      if (response.success) {
        // Update the user's onboarding status locally
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.isOnboardingCompleted = true;
          // Update stored user data
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        this.router.navigate(['/dashboard']);
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Onboarding failed:', error);
      if (error.status === 401) {
        // Token expired or invalid, redirect to login
        this.authService.logout();
        this.router.navigate(['/login'], { 
          queryParams: { 
            message: 'Your session has expired. Please login again.' 
          }
        });
      }
    }
  });
}

// ...existing code...

  private loadExistingData() {
    this.onboardingService.getOnboardingData().subscribe({
      next: (data) => {
        this.onboardingData = data;
      },
      error: (error) => {
        // No existing data, start fresh
        console.log('No existing onboarding data');
      }
    });
  }
}