import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PersonalInfoService } from '../../services/personal-info.service';
import { PersonalInfoData } from '../../models/personal-info.models';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="personal-info-container">
      <div class="page-header">
        <h2>Personal Information</h2>
        <p>Manage your profile and personal details</p>
      </div>

      <div class="info-sections" *ngIf="!isLoading">
        <!-- Personal Details Section -->
        <div class="info-section">
          <div class="section-header">
            <h3>Personal Details</h3>
            <button class="btn btn-edit" (click)="toggleEdit('personal')" 
                    [disabled]="editMode.personal && personalForm.invalid">
              {{ editMode.personal ? 'Save' : 'Edit' }}
            </button>
          </div>
          
          <div class="section-content">
            <form [formGroup]="personalForm" *ngIf="editMode.personal; else personalView">
              <div class="form-row">
                <div class="form-group">
                  <label>First Name</label>
                  <input type="text" formControlName="firstName" class="form-control">
                </div>
                <div class="form-group">
                  <label>Last Name</label>
                  <input type="text" formControlName="lastName" class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Email</label>
                  <input type="email" formControlName="email" class="form-control">
                </div>
                <div class="form-group">
                  <label>Age</label>
                  <input type="number" formControlName="age" class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" formControlName="location" class="form-control">
                </div>
                <div class="form-group">
                  <label>Current Role</label>
                  <input type="text" formControlName="currentRole" class="form-control">
                </div>
              </div>
            </form>
            
            <ng-template #personalView>
              <div class="info-grid">
                <div class="info-item">
                  <label>Name</label>
                  <span>{{ userInfo?.firstName }} {{ userInfo?.lastName }}</span>
                </div>
                <div class="info-item">
                  <label>Email</label>
                  <span>{{ userInfo?.email }}</span>
                </div>
                <div class="info-item">
                  <label>Age</label>
                  <span>{{ userInfo?.personalDetails?.age || 'Not specified' }}</span>
                </div>
                <div class="info-item">
                  <label>Location</label>
                  <span>{{ userInfo?.personalDetails?.location || 'Not specified' }}</span>
                </div>
                <div class="info-item">
                  <label>Current Role</label>
                  <span>{{ userInfo?.personalDetails?.currentRole || 'Not specified' }}</span>
                </div>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Education Section -->
        <div class="info-section">
          <div class="section-header">
            <h3>Education</h3>
            <button class="btn btn-edit" (click)="toggleEdit('education')"
                    [disabled]="editMode.education && educationForm.invalid">
              {{ editMode.education ? 'Save' : 'Edit' }}
            </button>
          </div>
          
          <div class="section-content">
            <form [formGroup]="educationForm" *ngIf="editMode.education; else educationView">
              <div class="form-row">
                <div class="form-group">
                  <label>Highest Education</label>
                  <select formControlName="highestEducation" class="form-control">
                    <option value="">Select education level</option>
                    <option value="high-school">High School</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Field of Study</label>
                  <input type="text" formControlName="fieldOfStudy" class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Graduation Year</label>
                  <input type="number" formControlName="graduationYear" class="form-control">
                </div>
              </div>
              
              <!-- Certifications -->
              <div class="certifications-section">
                <label>Certifications</label>
                <div class="certification-input">
                  <input type="text" [(ngModel)]="newCertification" 
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Add certification" class="form-control">
                  <button type="button" class="btn btn-add" (click)="addCertification()">Add</button>
                </div>
                <div class="certifications-list">
                  <div class="certification-item" *ngFor="let cert of certifications; let i = index">
                    <span>{{ cert }}</span>
                    <button type="button" class="btn-remove" (click)="removeCertification(i)">×</button>
                  </div>
                </div>
              </div>
            </form>
            
            <ng-template #educationView>
              <div class="info-grid">
                <div class="info-item">
                  <label>Highest Education</label>
                  <span>{{ getEducationLabel(userInfo?.education?.highestEducation ?? '') }}</span>
                </div>
                <div class="info-item">
                  <label>Field of Study</label>
                  <span>{{ userInfo?.education?.fieldOfStudy || 'Not specified' }}</span>
                </div>
                <div class="info-item">
                  <label>Graduation Year</label>
                  <span>{{ userInfo?.education?.graduationYear || 'Not specified' }}</span>
                </div>
                <div class="info-item full-width" *ngIf="userInfo?.education?.certifications?.length">
                  <label>Certifications</label>
                  <div class="tags">
                    <span class="tag" *ngFor="let cert of userInfo?.education?.certifications">{{ cert }}</span>
                  </div>
                </div>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Skills Section -->
        <div class="info-section">
          <div class="section-header">
            <h3>Skills</h3>
            <button class="btn btn-edit" (click)="toggleEdit('skills')">
              {{ editMode.skills ? 'Save' : 'Edit' }}
            </button>
          </div>
          
          <div class="section-content">
            <div *ngIf="editMode.skills; else skillsView">
              <!-- Technical Skills -->
              <div class="skills-edit-section">
                <label>Technical Skills</label>
                <div class="skill-input">
                  <input type="text" [(ngModel)]="newTechnicalSkill" 
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Add technical skill" class="form-control">
                  <button type="button" class="btn btn-add" (click)="addSkill('technical')">Add</button>
                </div>
                <div class="skills-list">
                  <div class="skill-item" *ngFor="let skill of technicalSkills; let i = index">
                    <span>{{ skill }}</span>
                    <button type="button" class="btn-remove" (click)="removeSkill('technical', i)">×</button>
                  </div>
                </div>
              </div>

              <!-- Soft Skills -->
              <div class="skills-edit-section">
                <label>Soft Skills</label>
                <div class="skill-input">
                  <input type="text" [(ngModel)]="newSoftSkill" 
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Add soft skill" class="form-control">
                  <button type="button" class="btn btn-add" (click)="addSkill('soft')">Add</button>
                </div>
                <div class="skills-list">
                  <div class="skill-item" *ngFor="let skill of softSkills; let i = index">
                    <span>{{ skill }}</span>
                    <button type="button" class="btn-remove" (click)="removeSkill('soft', i)">×</button>
                  </div>
                </div>
              </div>

              <!-- Skills to Learn -->
              <div class="skills-edit-section">
                <label>Skills to Learn</label>
                <div class="skill-input">
                  <input type="text" [(ngModel)]="newSkillToLearn" 
                         [ngModelOptions]="{standalone: true}"
                         placeholder="Add skill to learn" class="form-control">
                  <button type="button" class="btn btn-add" (click)="addSkill('toLearn')">Add</button>
                </div>
                <div class="skills-list">
                  <div class="skill-item" *ngFor="let skill of skillsToLearn; let i = index">
                    <span>{{ skill }}</span>
                    <button type="button" class="btn-remove" (click)="removeSkill('toLearn', i)">×</button>
                  </div>
                </div>
              </div>
            </div>
            
            <ng-template #skillsView>
              <div class="skills-grid">
                <div class="skills-category" *ngIf="userInfo?.skills?.technicalSkills?.length">
                  <h4>Technical Skills</h4>
                  <div class="tags">
                    <span class="tag technical" *ngFor="let skill of userInfo?.skills?.technicalSkills">{{ skill }}</span>
                  </div>
                </div>
                <div class="skills-category" *ngIf="userInfo?.skills?.softSkills?.length">
                  <h4>Soft Skills</h4>
                  <div class="tags">
                    <span class="tag soft" *ngFor="let skill of userInfo?.skills?.softSkills">{{ skill }}</span>
                  </div>
                </div>
                <div class="skills-category" *ngIf="userInfo?.skills?.skillsToLearn?.length">
                  <h4>Skills to Learn</h4>
                  <div class="tags">
                    <span class="tag learning" *ngFor="let skill of userInfo?.skills?.skillsToLearn">{{ skill }}</span>
                  </div>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <p>Loading your information...</p>
      </div>
    </div>
  `,
  styleUrl: './personal-information.component.scss'
})
export class PersonalInformationComponent implements OnInit {
  userInfo: PersonalInfoData | null = null;
  isLoading = true;
  
  editMode = {
    personal: false,
    education: false,
    skills: false
  };

  personalForm: FormGroup;
  educationForm: FormGroup;

  // Skills arrays
  technicalSkills: string[] = [];
  softSkills: string[] = [];
  skillsToLearn: string[] = [];
  
  // Certification array
  certifications: string[] = [];

  // New item inputs
  newCertification = '';
  newTechnicalSkill = '';
  newSoftSkill = '';
  newSkillToLearn = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private personalInfoService: PersonalInfoService
  ) {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18)]],
      location: ['', Validators.required],
      currentRole: ['', Validators.required]
    });

    this.educationForm = this.fb.group({
      highestEducation: ['', Validators.required],
      fieldOfStudy: ['', Validators.required],
      graduationYear: ['']
    });
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.personalInfoService.getUserInfo(userId).subscribe({
      next: (data) => {
        this.userInfo = data;
        this.populateForms();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading user info:', error);
        this.isLoading = false;
      }
    });
  }

  populateForms() {
    if (!this.userInfo) return;

    // Populate personal form
    this.personalForm.patchValue({
      firstName: this.userInfo.firstName,
      lastName: this.userInfo.lastName,
      email: this.userInfo.email,
      age: this.userInfo.personalDetails?.age,
      location: this.userInfo.personalDetails?.location,
      currentRole: this.userInfo.personalDetails?.currentRole
    });

    // Populate education form
    this.educationForm.patchValue({
      highestEducation: this.userInfo.education?.highestEducation,
      fieldOfStudy: this.userInfo.education?.fieldOfStudy,
      graduationYear: this.userInfo.education?.graduationYear
    });

    // Populate arrays
    this.certifications = [...(this.userInfo.education?.certifications || [])];
    this.technicalSkills = [...(this.userInfo.skills?.technicalSkills || [])];
    this.softSkills = [...(this.userInfo.skills?.softSkills || [])];
    this.skillsToLearn = [...(this.userInfo.skills?.skillsToLearn || [])];
  }

  toggleEdit(section: 'personal' | 'education' | 'skills') {
    if (this.editMode[section]) {
      // Save changes
      this.saveChanges(section);
    } else {
      // Enter edit mode
      this.editMode[section] = true;
    }
  }

  saveChanges(section: 'personal' | 'education' | 'skills') {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    let updateData: any = {};

    switch (section) {
      case 'personal':
        if (this.personalForm.valid) {
          const formValue = this.personalForm.value;
          updateData = {
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            personalDetails: {
              age: formValue.age,
              location: formValue.location,
              currentRole: formValue.currentRole
            }
          };
        }
        break;

      case 'education':
        if (this.educationForm.valid) {
          updateData = {
            education: {
              ...this.educationForm.value,
              certifications: this.certifications
            }
          };
        }
        break;

      case 'skills':
        updateData = {
          skills: {
            technicalSkills: this.technicalSkills,
            softSkills: this.softSkills,
            skillsToLearn: this.skillsToLearn
          }
        };
        break;
    }

    this.personalInfoService.updateUserInfo(userId, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.editMode[section] = false;
          this.loadUserInfo(); // Refresh data
        }
      },
      error: (error) => {
        console.error('Error updating user info:', error);
      }
    });
  }

  // Certification methods
  addCertification() {
    if (this.newCertification.trim() && !this.certifications.includes(this.newCertification.trim())) {
      this.certifications.push(this.newCertification.trim());
      this.newCertification = '';
    }
  }

  removeCertification(index: number) {
    this.certifications.splice(index, 1);
  }

  // Skills methods
  addSkill(type: 'technical' | 'soft' | 'toLearn') {
    let newSkill = '';
    let skillArray: string[] = [];

    switch (type) {
      case 'technical':
        newSkill = this.newTechnicalSkill.trim();
        skillArray = this.technicalSkills;
        this.newTechnicalSkill = '';
        break;
      case 'soft':
        newSkill = this.newSoftSkill.trim();
        skillArray = this.softSkills;
        this.newSoftSkill = '';
        break;
      case 'toLearn':
        newSkill = this.newSkillToLearn.trim();
        skillArray = this.skillsToLearn;
        this.newSkillToLearn = '';
        break;
    }

    if (newSkill && !skillArray.includes(newSkill)) {
      skillArray.push(newSkill);
    }
  }

  removeSkill(type: 'technical' | 'soft' | 'toLearn', index: number) {
    switch (type) {
      case 'technical':
        this.technicalSkills.splice(index, 1);
        break;
      case 'soft':
        this.softSkills.splice(index, 1);
        break;
      case 'toLearn':
        this.skillsToLearn.splice(index, 1);
        break;
    }
  }

  getEducationLabel(value: string): string {
    const labels: { [key: string]: string } = {
      'high-school': 'High School',
      'associate': 'Associate Degree',
      'bachelor': 'Bachelor\'s Degree',
      'master': 'Master\'s Degree',
      'phd': 'PhD',
      'other': 'Other'
    };
    return labels[value] || 'Not specified';
  }
}