export interface PersonalDetails {
  age: number;
  location: string;
  currentRole: string;
}

export interface Education {
  highestEducation: string;
  fieldOfStudy: string;
  graduationYear?: number;
  certifications: string[];
}

export interface JobRole {
  jobTitle: string;
  companyName: string;
  startDate: Date;
  endDate: Date;
  jobDescription: string;
}

export interface WorkExperience {
  experienceLevel: string;
  jobRoles: JobRole[];
}

export interface Skills {
  technicalSkills: string[];
  softSkills: string[];
  skillsToLearn: string[];
}

export interface CareerGoals {
  goals: string[];
  timeframe: string;
  preferredIndustries: string[];
  workPreference: string;
}

export interface OnboardingComplete {
  userId?: number; // Add this field
  personalDetails: PersonalDetails;
  education: Education;
  workExperience: WorkExperience;
  skills: Skills;
  careerGoals: CareerGoals;
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
}