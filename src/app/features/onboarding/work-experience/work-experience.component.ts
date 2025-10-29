import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WorkExperience, JobRole } from '../../../models/onboarding.models';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="step-container">
      <div class="step-header">
        <h2>Work Experience</h2>
        <p>Tell us about your professional experience</p>
      </div>

      <form [formGroup]="workForm" class="step-form">
        <div class="form-group">
          <label for="experienceLevel">Experience Level</label>
          <select
            id="experienceLevel"
            formControlName="experienceLevel"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('experienceLevel')"
          >
            <option value="">Select your experience level</option>
            <option value="entry-level">Entry Level (0-2 years)</option>
            <option value="mid-level">Mid Level (3-5 years)</option>
            <option value="senior-level">Senior Level (6-10 years)</option>
            <option value="executive-level">Executive Level (10+ years)</option>
            <option value="no-experience">No Professional Experience</option>
          </select>
          <div class="invalid-feedback" *ngIf="isFieldInvalid('experienceLevel')">
            Please select your experience level
          </div>
        </div>

        <div class="job-roles-section">
          <div class="section-header">
            <label>Past Job Roles (Optional)</label>
            <button
              type="button"
              class="btn btn-add-role"
              (click)="toggleJobRoleForm()"
              *ngIf="!showJobRoleForm"
            >
              Add Past Job Role
            </button>
          </div>

          <!-- Job Role Form -->
          <div class="job-role-form" *ngIf="showJobRoleForm">
            <form [formGroup]="jobRoleForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="jobTitle">Job Title</label>
                  <input
                    type="text"
                    id="jobTitle"
                    formControlName="jobTitle"
                    class="form-control"
                    placeholder="e.g., Software Developer"
                  />
                </div>
                <div class="form-group">
                  <label for="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    formControlName="companyName"
                    class="form-control"
                    placeholder="e.g., Tech Corp"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    formControlName="startDate"
                    class="form-control"
                  />
                </div>
                <div class="form-group">
                  <label for="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    formControlName="endDate"
                    class="form-control"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="jobDescription">Job Description</label>
                <textarea
                  id="jobDescription"
                  formControlName="jobDescription"
                  class="form-control"
                  rows="3"
                  placeholder="Describe your responsibilities and achievements..."
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-secondary" (click)="cancelJobRole()">
                  Cancel
                </button>
                <button
                  type="button"
                  class="btn btn-success"
                  [disabled]="jobRoleForm.invalid"
                  (click)="addJobRole()"
                >
                  Add Role
                </button>
              </div>
            </form>
          </div>

          <!-- Job Roles List -->
          <div class="job-roles-list" *ngIf="jobRoles.length > 0">
            <div class="job-role-item" *ngFor="let role of jobRoles; let i = index">
              <div class="role-info">
                <h4>{{ role.jobTitle }}</h4>
                <p class="company">{{ role.companyName }}</p>
                <p class="duration">
                  {{ formatDate(role.startDate) }} - {{ formatDate(role.endDate) }}
                </p>
                <p class="description">{{ role.jobDescription }}</p>
              </div>
              <button type="button" class="btn-remove" (click)="removeJobRole(i)">
                ×
              </button>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button type="button" class="btn btn-secondary" (click)="onPrevious()">
            Previous
          </button>
          <button
            type="button"
            class="btn btn-primary"
            [disabled]="workForm.invalid"
            (click)="onNext()"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './work-experience.component.scss'
})
export class WorkExperienceComponent implements OnInit {
  @Input() data: WorkExperience = { experienceLevel: '', jobRoles: [] };
  @Output() dataChange = new EventEmitter<WorkExperience>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  workForm: FormGroup;
  jobRoleForm: FormGroup;
  jobRoles: JobRole[] = [];
  showJobRoleForm = false;

  constructor(private fb: FormBuilder) {
    this.workForm = this.fb.group({
      experienceLevel: ['', Validators.required]
    });

    this.jobRoleForm = this.fb.group({
      jobTitle: ['', Validators.required],
      companyName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      jobDescription: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.workForm.patchValue({
        experienceLevel: this.data.experienceLevel
      });
      this.jobRoles = [...this.data.jobRoles];
    }

    this.workForm.valueChanges.subscribe(() => {
      this.emitData();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.workForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  toggleJobRoleForm() {
    this.showJobRoleForm = !this.showJobRoleForm;
    if (this.showJobRoleForm) {
      this.jobRoleForm.reset();
    }
  }

  addJobRole() {
    if (this.jobRoleForm.valid) {
      const formValue = this.jobRoleForm.value;
      const jobRole: JobRole = {
        jobTitle: formValue.jobTitle,
        companyName: formValue.companyName,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        jobDescription: formValue.jobDescription
      };
      
      this.jobRoles.push(jobRole);
      this.jobRoleForm.reset();
      this.showJobRoleForm = false;
      this.emitData();
    }
  }

  removeJobRole(index: number) {
    this.jobRoles.splice(index, 1);
    this.emitData();
  }

  cancelJobRole() {
    this.jobRoleForm.reset();
    this.showJobRoleForm = false;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  }

  emitData() {
    const data: WorkExperience = {
      experienceLevel: this.workForm.value.experienceLevel,
      jobRoles: [...this.jobRoles]
    };
    this.dataChange.emit(data);
  }

  onPrevious() {
    this.previous.emit();
  }

  onNext() {
    if (this.workForm.valid) {
      this.emitData();
      this.next.emit();
    } else {
      this.workForm.markAllAsTouched();
    }
  }
}