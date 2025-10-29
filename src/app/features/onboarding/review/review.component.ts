import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingComplete } from '../../../models/onboarding.models';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="step-container">
      <div class="step-header">
        <h2>Review & Confirmation</h2>
        <p>Please review your information before completing setup</p>
      </div>

      <div class="review-content">
        <!-- Personal Details -->
        <div class="review-section">
          <h3>Personal Details</h3>
          <div class="review-item">
            <span class="label">Age:</span>
            <span class="value">{{ data.personalDetails.age }}</span>
          </div>
          <div class="review-item">
            <span class="label">Location:</span>
            <span class="value">{{ data.personalDetails.location }}</span>
          </div>
          <div class="review-item">
            <span class="label">Current Role:</span>
            <span class="value">{{ data.personalDetails.currentRole }}</span>
          </div>
        </div>

        <!-- Education -->
        <div class="review-section">
          <h3>Education</h3>
          <div class="review-item">
            <span class="label">Highest Education:</span>
            <span class="value">{{ data.education.highestEducation }}</span>
          </div>
          <div class="review-item">
            <span class="label">Field of Study:</span>
            <span class="value">{{ data.education.fieldOfStudy }}</span>
          </div>
          <div class="review-item" *ngIf="data.education.graduationYear">
            <span class="label">Graduation Year:</span>
            <span class="value">{{ data.education.graduationYear }}</span>
          </div>
          <div class="review-item" *ngIf="data.education.certifications.length > 0">
            <span class="label">Certifications:</span>
            <div class="tags-list">
              <span class="tag" *ngFor="let cert of data.education.certifications">
                {{ cert }}
              </span>
            </div>
          </div>
        </div>

        <!-- Work Experience -->
        <div class="review-section">
          <h3>Work Experience</h3>
          <div class="review-item">
            <span class="label">Experience Level:</span>
            <span class="value">{{ data.workExperience.experienceLevel }}</span>
          </div>
          <div class="job-roles" *ngIf="data.workExperience.jobRoles.length > 0">
            <h4>Past Job Roles:</h4>
            <div class="job-role" *ngFor="let role of data.workExperience.jobRoles">
              <div class="job-header">
                <strong>{{ role.jobTitle }}</strong> at {{ role.companyName }}
              </div>
              <div class="job-duration">
                {{ formatDate(role.startDate) }} - {{ formatDate(role.endDate) }}
              </div>
              <div class="job-description">{{ role.jobDescription }}</div>
            </div>
          </div>
        </div>

        <!-- Skills -->
        <div class="review-section">
          <h3>Skills</h3>
          <div class="review-item" *ngIf="data.skills.technicalSkills.length > 0">
            <span class="label">Technical Skills:</span>
            <div class="tags-list">
              <span class="tag technical" *ngFor="let skill of data.skills.technicalSkills">
                {{ skill }}
              </span>
            </div>
          </div>
          <div class="review-item" *ngIf="data.skills.softSkills.length > 0">
            <span class="label">Soft Skills:</span>
            <div class="tags-list">
              <span class="tag soft" *ngFor="let skill of data.skills.softSkills">
                {{ skill }}
              </span>
            </div>
          </div>
          <div class="review-item" *ngIf="data.skills.skillsToLearn.length > 0">
            <span class="label">Skills to Learn:</span>
            <div class="tags-list">
              <span class="tag learn" *ngFor="let skill of data.skills.skillsToLearn">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Career Goals -->
        <div class="review-section">
          <h3>Career Goals</h3>
          <div class="review-item">
            <span class="label">Goals:</span>
            <div class="tags-list">
              <span class="tag goal" *ngFor="let goal of data.careerGoals.goals">
                {{ goal }}
              </span>
            </div>
          </div>
          <div class="review-item">
            <span class="label">Timeframe:</span>
            <span class="value">{{ data.careerGoals.timeframe }}</span>
          </div>
          <div class="review-item">
            <span class="label">Preferred Industries:</span>
            <div class="tags-list">
              <span class="tag industry" *ngFor="let industry of data.careerGoals.preferredIndustries">
                {{ industry }}
              </span>
            </div>
          </div>
          <div class="review-item">
            <span class="label">Work Preference:</span>
            <span class="value">{{ data.careerGoals.workPreference }}</span>
          </div>
        </div>
      </div>

      <div class="step-actions">
        <button type="button" class="btn btn-secondary" (click)="onPrevious()">
          Previous
        </button>
        <button
          type="button"
          class="btn btn-success"
          [disabled]="isLoading"
          (click)="onComplete()"
        >
          <span *ngIf="isLoading">Completing Setup...</span>
          <span *ngIf="!isLoading">Complete Setup</span>
        </button>
      </div>
    </div>
  `,
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  @Input() data!: OnboardingComplete;
  @Input() isLoading = false;
  @Output() previous = new EventEmitter<void>();
  @Output() complete = new EventEmitter<void>();

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  }

  onPrevious() {
    this.previous.emit();
  }

  onComplete() {
    this.complete.emit();
  }
}