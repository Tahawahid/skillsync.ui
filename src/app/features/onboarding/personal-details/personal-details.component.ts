import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PersonalDetails } from '../../../models/onboarding.models';

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="step-container">
      <div class="step-header">
        <h2>Personal Details</h2>
        <p>Tell us a bit about yourself</p>
      </div>

      <form [formGroup]="personalForm" class="step-form">
        <div class="form-group">
          <label for="age">Age</label>
          <input
            type="number"
            id="age"
            formControlName="age"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('age')"
            min="16"
            max="100"
          />
          <div class="invalid-feedback" *ngIf="isFieldInvalid('age')">
            Please enter a valid age (16-100)
          </div>
        </div>

        <div class="form-group">
          <label for="location">Location</label>
          <input
            type="text"
            id="location"
            formControlName="location"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('location')"
            placeholder="e.g., New York, NY"
          />
          <div class="invalid-feedback" *ngIf="isFieldInvalid('location')">
            Location is required
          </div>
        </div>

        <div class="form-group">
          <label for="currentRole">Current Role or Job Status</label>
          <select
            id="currentRole"
            formControlName="currentRole"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('currentRole')"
          >
            <option value="">Select your current status</option>
            <option value="student">Student</option>
            <option value="employed">Employed</option>
            <option value="unemployed">Unemployed</option>
            <option value="freelancer">Freelancer</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="retired">Retired</option>
            <option value="other">Other</option>
          </select>
          <div class="invalid-feedback" *ngIf="isFieldInvalid('currentRole')">
            Please select your current role or job status
          </div>
        </div>

        <div class="step-actions">
          <button
            type="button"
            class="btn btn-primary"
            [disabled]="personalForm.invalid"
            (click)="onNext()"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './personal-details.component.scss'
})
export class PersonalDetailsComponent implements OnInit {
  @Input() data: PersonalDetails = { age: 0, location: '', currentRole: '' };
  @Output() dataChange = new EventEmitter<PersonalDetails>();
  @Output() next = new EventEmitter<void>();

  personalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personalForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(16), Validators.max(100)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      currentRole: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.personalForm.patchValue(this.data);
    }

    this.personalForm.valueChanges.subscribe(value => {
      this.dataChange.emit(value);
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personalForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onNext() {
    if (this.personalForm.valid) {
      this.dataChange.emit(this.personalForm.value);
      this.next.emit();
    } else {
      this.personalForm.markAllAsTouched();
    }
  }
}