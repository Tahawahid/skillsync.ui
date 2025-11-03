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
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if user ID exists
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.log('No user ID found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    console.log('Starting onboarding for user ID:', userId);
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
    console.log('Updated personal details:', data);
  }

  updateEducation(data: Education) {
    this.onboardingData.education = data;
    console.log('Updated education:', data);
  }

  updateWorkExperience(data: WorkExperience) {
    this.onboardingData.workExperience = data;
    console.log('Updated work experience:', data);
  }

  updateSkills(data: Skills) {
    this.onboardingData.skills = data;
    console.log('Updated skills:', data);
  }

  updateCareerGoals(data: CareerGoals) {
    this.onboardingData.careerGoals = data;
    console.log('Updated career goals:', data);
  }

  completeOnboarding() {
    console.log('Complete onboarding button clicked');
    
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      console.log('No user ID found');
      this.router.navigate(['/login']);
      return;
    }

    // Add user ID to onboarding data
    this.onboardingData.userId = userId;
    
    console.log('Final onboarding data:', this.onboardingData);
    
    // Validate data before sending
    if (!this.validateOnboardingData()) {
      console.error('Onboarding data validation failed');
      alert('Please ensure all required fields are filled out.');
      return;
    }

    this.isLoading = true;
    console.log('Sending onboarding data to backend...');

    this.onboardingService.completeOnboarding(this.onboardingData).subscribe({
      next: (response) => {
        console.log('Onboarding response received:', response);
        this.isLoading = false;
        
        if (response.success) {
          console.log('Onboarding completed successfully');
          
          // Update the user's onboarding status locally
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            currentUser.isOnboardingCompleted = true;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('Updated user onboarding status locally');
          }
          
          // Navigate to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Onboarding failed:', response.message);
          alert('Onboarding failed: ' + response.message);
        }
      },
      error: (error) => {
        console.error('Onboarding error:', error);
        this.isLoading = false;
        alert('Failed to complete onboarding. Please try again.');
      }
    });
  }

  private validateOnboardingData(): boolean {
    console.log('Validating onboarding data...');
    
    // Check personal details
    if (!this.onboardingData.personalDetails.age || 
        !this.onboardingData.personalDetails.location || 
        !this.onboardingData.personalDetails.currentRole) {
      console.log('Personal details validation failed');
      return false;
    }

    // Check education
    if (!this.onboardingData.education.highestEducation || 
        !this.onboardingData.education.fieldOfStudy) {
      console.log('Education validation failed');
      return false;
    }

    // Check work experience
    if (!this.onboardingData.workExperience.experienceLevel) {
      console.log('Work experience validation failed');
      return false;
    }

    // Check career goals
    if (!this.onboardingData.careerGoals.timeframe || 
        !this.onboardingData.careerGoals.workPreference ||
        this.onboardingData.careerGoals.goals.length === 0) {
      console.log('Career goals validation failed');
      return false;
    }

    console.log('Validation passed');
    return true;
  }

  private loadExistingData() {
    console.log('Loading existing onboarding data...');
    this.onboardingService.getOnboardingData().subscribe({
      next: (data) => {
        console.log('Loaded existing onboarding data:', data);
        this.onboardingData = data;
      },
      error: (error) => {
        console.log('No existing onboarding data found:', error);
      }
    });
  }
}