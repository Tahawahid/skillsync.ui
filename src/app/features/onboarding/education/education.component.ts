import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Education } from '../../../models/onboarding.models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="step-container">
      <div class="step-header">
        <h2>Education Information</h2>
        <p>Share your educational background</p>
      </div>

      <form [formGroup]="educationForm" class="step-form">
        <div class="form-group">
          <label for="highestEducation">Highest Level of Education</label>
          <select
            id="highestEducation"
            formControlName="highestEducation"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('highestEducation')"
          >
            <option value="">Select your highest education</option>
            <option value="high-school">High School</option>
            <option value="associate">Associate Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="phd">PhD</option>
            <option value="other">Other</option>
          </select>
          <div class="invalid-feedback" *ngIf="isFieldInvalid('highestEducation')">
            Please select your highest education level
          </div>
        </div>

        <div class="form-group">
          <label for="fieldOfStudy">Field of Study</label>
          <input
            type="text"
            id="fieldOfStudy"
            formControlName="fieldOfStudy"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('fieldOfStudy')"
            placeholder="e.g., Computer Science, Business Administration"
          />
          <div class="invalid-feedback" *ngIf="isFieldInvalid('fieldOfStudy')">
            Field of study is required
          </div>
        </div>

        <div class="form-group">
          <label for="graduationYear">Graduation Year (Optional)</label>
          <input
            type="number"
            id="graduationYear"
            formControlName="graduationYear"
            class="form-control"
            min="1950"
            [max]="currentYear + 5"
            placeholder="e.g., 2023"
          />
        </div>

        <div class="certifications-section">
          <label>Certifications (Optional)</label>
          <div class="certification-input">
            <input
              type="text"
              [(ngModel)]="newCertification"
              [ngModelOptions]="{standalone: true}"
              class="form-control"
              placeholder="Enter certification name"
              (keyup.enter)="addCertification()"
              (input)="onCertificationInput()"
            />
            <button
              type="button"
              class="btn btn-add"
              (click)="addCertification()"
              [disabled]="!canAddCertification()"
            >
              Add
            </button>
          </div>

          <div class="certifications-list" *ngIf="certifications.length > 0">
            <div class="certification-item" *ngFor="let cert of certifications; let i = index">
              <span>{{ cert }}</span>
              <button type="button" class="btn-remove" (click)="removeCertification(i)">
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
            [disabled]="educationForm.invalid"
            (click)="onNext()"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {
  @Input() data: Education = { highestEducation: '', fieldOfStudy: '', graduationYear: undefined, certifications: [] };
  @Output() dataChange = new EventEmitter<Education>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  educationForm: FormGroup;
  certifications: string[] = [];
  newCertification = '';
  currentYear = new Date().getFullYear();

  constructor(private fb: FormBuilder) {
    this.educationForm = this.fb.group({
      highestEducation: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      graduationYear: ['']
    });
  }

  ngOnInit() {
    if (this.data) {
      this.educationForm.patchValue({
        highestEducation: this.data.highestEducation,
        fieldOfStudy: this.data.fieldOfStudy,
        graduationYear: this.data.graduationYear
      });
      this.certifications = [...this.data.certifications];
    }

    this.educationForm.valueChanges.subscribe(() => {
      this.emitData();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.educationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  canAddCertification(): boolean {
    return !!(this.newCertification && this.newCertification.trim().length > 0);
  }

  onCertificationInput(): void {
    // This method helps trigger change detection
  }

  addCertification() {
    const cert = this.newCertification.trim();
    if (cert && !this.certifications.includes(cert)) {
      this.certifications.push(cert);
      this.newCertification = '';
      this.emitData();
    }
  }

  removeCertification(index: number) {
    this.certifications.splice(index, 1);
    this.emitData();
  }

  emitData() {
    const formValue = this.educationForm.value;
    const data: Education = {
      highestEducation: formValue.highestEducation,
      fieldOfStudy: formValue.fieldOfStudy,
      graduationYear: formValue.graduationYear || undefined,
      certifications: [...this.certifications]
    };
    this.dataChange.emit(data);
  }

  onPrevious() {
    this.previous.emit();
  }

  onNext() {
    if (this.educationForm.valid) {
      this.emitData();
      this.next.emit();
    } else {
      this.educationForm.markAllAsTouched();
    }
  }
}