import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Skills } from '../../../models/onboarding.models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="step-container">
      <div class="step-header">
        <h2>Skills and Expertise</h2>
        <p>Tell us about your skills and what you want to learn</p>
      </div>

      <div class="step-form">
        <!-- Technical Skills -->
        <div class="skills-section">
          <label>Technical Skills</label>
          <div class="skill-input">
            <input
              type="text"
              [(ngModel)]="newTechnicalSkill"
              class="form-control"
              placeholder="e.g., JavaScript, Python, React"
              (keyup.enter)="addTechnicalSkill()"
            />
            <button
              type="button"
              class="btn btn-add"
              (click)="addTechnicalSkill()"
              [disabled]="!newTechnicalSkill.trim()"
            >
              Add
            </button>
          </div>
          <div class="skills-list" *ngIf="technicalSkills.length > 0">
            <div class="skill-tag" *ngFor="let skill of technicalSkills; let i = index">
              {{ skill }}
              <button type="button" class="remove-btn" (click)="removeTechnicalSkill(i)">×</button>
            </div>
          </div>
        </div>

        <!-- Soft Skills -->
        <div class="skills-section">
          <label>Soft Skills</label>
          <div class="skill-input">
            <input
              type="text"
              [(ngModel)]="newSoftSkill"
              class="form-control"
              placeholder="e.g., Communication, Leadership, Problem Solving"
              (keyup.enter)="addSoftSkill()"
            />
            <button
              type="button"
              class="btn btn-add"
              (click)="addSoftSkill()"
              [disabled]="!newSoftSkill.trim()"
            >
              Add
            </button>
          </div>
          <div class="skills-list" *ngIf="softSkills.length > 0">
            <div class="skill-tag" *ngFor="let skill of softSkills; let i = index">
              {{ skill }}
              <button type="button" class="remove-btn" (click)="removeSoftSkill(i)">×</button>
            </div>
          </div>
        </div>

        <!-- Skills to Learn -->
        <div class="skills-section">
          <label>Skills You Want to Learn</label>
          <div class="skill-input">
            <input
              type="text"
              [(ngModel)]="newSkillToLearn"
              class="form-control"
              placeholder="e.g., Machine Learning, Data Analysis, Public Speaking"
              (keyup.enter)="addSkillToLearn()"
            />
            <button
              type="button"
              class="btn btn-add"
              (click)="addSkillToLearn()"
              [disabled]="!newSkillToLearn.trim()"
            >
              Add
            </button>
          </div>
          <div class="skills-list" *ngIf="skillsToLearn.length > 0">
            <div class="skill-tag learn-skill" *ngFor="let skill of skillsToLearn; let i = index">
              {{ skill }}
              <button type="button" class="remove-btn" (click)="removeSkillToLearn(i)">×</button>
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
            [disabled]="!hasAnySkills()"
            (click)="onNext()"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit {
  @Input() data: Skills = { technicalSkills: [], softSkills: [], skillsToLearn: [] };
  @Output() dataChange = new EventEmitter<Skills>();
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();

  technicalSkills: string[] = [];
  softSkills: string[] = [];
  skillsToLearn: string[] = [];

  newTechnicalSkill = '';
  newSoftSkill = '';
  newSkillToLearn = '';

  ngOnInit() {
    if (this.data) {
      this.technicalSkills = [...this.data.technicalSkills];
      this.softSkills = [...this.data.softSkills];
      this.skillsToLearn = [...this.data.skillsToLearn];
    }
  }

  addTechnicalSkill() {
    const skill = this.newTechnicalSkill.trim();
    if (skill && !this.technicalSkills.includes(skill)) {
      this.technicalSkills.push(skill);
      this.newTechnicalSkill = '';
      this.emitData();
    }
  }

  removeTechnicalSkill(index: number) {
    this.technicalSkills.splice(index, 1);
    this.emitData();
  }

  addSoftSkill() {
    const skill = this.newSoftSkill.trim();
    if (skill && !this.softSkills.includes(skill)) {
      this.softSkills.push(skill);
      this.newSoftSkill = '';
      this.emitData();
    }
  }

  removeSoftSkill(index: number) {
    this.softSkills.splice(index, 1);
    this.emitData();
  }

  addSkillToLearn() {
    const skill = this.newSkillToLearn.trim();
    if (skill && !this.skillsToLearn.includes(skill)) {
      this.skillsToLearn.push(skill);
      this.newSkillToLearn = '';
      this.emitData();
    }
  }

  removeSkillToLearn(index: number) {
    this.skillsToLearn.splice(index, 1);
    this.emitData();
  }

  hasAnySkills(): boolean {
    return this.technicalSkills.length > 0 || 
           this.softSkills.length > 0 || 
           this.skillsToLearn.length > 0;
  }

  emitData() {
    const data: Skills = {
      technicalSkills: [...this.technicalSkills],
      softSkills: [...this.softSkills],
      skillsToLearn: [...this.skillsToLearn]
    };
    this.dataChange.emit(data);
  }

  onPrevious() {
    this.previous.emit();
  }

  onNext() {
    if (this.hasAnySkills()) {
      this.emitData();
      this.next.emit();
    }
  }
}