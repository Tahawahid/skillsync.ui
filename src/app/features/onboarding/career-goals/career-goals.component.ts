import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CareerGoals } from '../../../models/onboarding.models';

@Component({
  selector: 'app-career-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="step-container">
      <div class="step-header">
        <h2>Career Goals</h2>
        <p>Define your career aspirations and preferences</p>
      </div>

      <form [formGroup]="careerForm" class="step-form">
        <!-- Career Goals -->
        <div class="form-section">
          <label>Career Goals (Select all that apply)</label>
          <div class="goals-grid">
            <label class="goal-checkbox" *ngFor="let goal of availableGoals">
              <input
                type="checkbox"
                [value]="goal"
                (change)="onGoalChange(goal, $event)"
                [checked]="selectedGoals.includes(goal)"
              />
              <span class="checkmark"></span>
              {{ goal }}
            </label>
          </div>
        </div>

        <!-- Timeframe -->
        <div class="form-group">
          <label for="timeframe">Timeframe for Achieving Goals</label>
          <select
            id="timeframe"
            formControlName="timeframe"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('timeframe')"
          >
            <option value="">Select timeframe</option>
            <option value="0-6-months">0-6 months</option>
            <option value="6-12-months">6-12 months</option>
            <option value="1-2-years">1-2 years</option>
            <option value="3-5-years">3-5 years</option>
            <option value="5+-years">5+ years</option>
          </select>
          <div class="invalid-feedback" *ngIf="isFieldInvalid('timeframe')">
            Please select a timeframe
          </div>
        </div>

        <!-- Preferred Industries -->
        <div class="form-section">
          <label>Preferred Industries</label>
          <div class="industries-grid">
            <div 
              class="industry-item"
              *ngFor="let industry of availableIndustries"
              [class.selected]="selectedIndustries.includes(industry)"
              (click)="toggleIndustry(industry)"
            >
              {{ industry }}
            </div>
          </div>
        </div>

        <!-- Work Preference -->
        <div class="form-group">
          <label for="workPreference">Work Preference</label>
          <select
            id="workPreference"
            formControlName="workPreference"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('workPreference')"
          >
            <option value="">Select work preference</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
            <option value="flexible">Flexible</option>
          </select>
          <div class="invalid-feedback" *ngIf="isFieldInvalid('workPreference')">
            Please select your work preference
          </div>
        </div>

        <div class="step-actions">
          <button type="button" class="btn btn-secondary" (click)="onPrevious()">
            Previous
          </button>
          <button
            type="button"
            class="btn btn-primary"
            [disabled]="!isFormValid()"
            (click)="onNext()"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './career-goals.component.scss'
})
export class CareerGoalsComponent implements OnInit {
  @Input() data: CareerGoals = { goals: [], timeframe: '', preferredIndustries: [], workPreference: '' };
  @Output() dataChange = new EventEmitter<CareerGoals>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  careerForm: FormGroup;
  selectedGoals: string[] = [];
  selectedIndustries: string[] = [];

  availableGoals = [
    'Get promoted to senior position',
    'Switch to a new industry',
    'Learn new technologies',
    'Start my own business',
    'Increase salary',
    'Work for a Fortune 500 company',
    'Become a team leader',
    'Work remotely',
    'Get better work-life balance',
    'Expand professional network'
  ];

  availableIndustries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Media & Entertainment',
    'Real Estate',
    'Transportation',
    'Energy',
    'Consulting',
    'Government',
    'Non-profit',
    'Agriculture',
    'Construction',
    'Telecommunications',
    'Hospitality',
    'Legal',
    'Marketing & Advertising',
    'Research & Development'
  ];

  constructor(private fb: FormBuilder) {
    this.careerForm = this.fb.group({
      timeframe: ['', Validators.required],
      workPreference: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.careerForm.patchValue({
        timeframe: this.data.timeframe,
        workPreference: this.data.workPreference
      });
      this.selectedGoals = [...this.data.goals];
      this.selectedIndustries = [...this.data.preferredIndustries];
    }

    this.careerForm.valueChanges.subscribe(() => {
      this.emitData();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.careerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onGoalChange(goal: string, event: any) {
    if (event.target.checked) {
      if (!this.selectedGoals.includes(goal)) {
        this.selectedGoals.push(goal);
      }
    } else {
      const index = this.selectedGoals.indexOf(goal);
      if (index > -1) {
        this.selectedGoals.splice(index, 1);
      }
    }
    this.emitData();
  }

  toggleIndustry(industry: string) {
    const index = this.selectedIndustries.indexOf(industry);
    if (index > -1) {
      this.selectedIndustries.splice(index, 1);
    } else {
      this.selectedIndustries.push(industry);
    }
    this.emitData();
  }

  isFormValid(): boolean {
    return this.careerForm.valid && 
           this.selectedGoals.length > 0 && 
           this.selectedIndustries.length > 0;
  }

  emitData() {
    const formValue = this.careerForm.value;
    const data: CareerGoals = {
      goals: [...this.selectedGoals],
      timeframe: formValue.timeframe,
      preferredIndustries: [...this.selectedIndustries],
      workPreference: formValue.workPreference
    };
    this.dataChange.emit(data);
  }

  onPrevious() {
    this.previous.emit();
  }

  onNext() {
    if (this.isFormValid()) {
      this.emitData();
      this.next.emit();
    } else {
      this.careerForm.markAllAsTouched();
    }
  }
}