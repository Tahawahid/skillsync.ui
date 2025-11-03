export interface PersonalInfoData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  personalDetails?: {
    age: number;
    location: string;
    currentRole: string;
  };
  education?: {
    highestEducation: string;
    fieldOfStudy: string;
    graduationYear?: number;
    certifications: string[];
  };
  workExperience?: {
    experienceLevel: string;
    jobRoles: JobRole[];
  };
  skills?: {
    technicalSkills: string[];
    softSkills: string[];
    skillsToLearn: string[];
  };
  careerGoals?: {
    goals: string[];
    timeframe: string;
    preferredIndustries: string[];
    workPreference: string;
  };
}

export interface JobRole {
  jobTitle: string;
  companyName: string;
  startDate: Date;
  endDate: Date;
  jobDescription: string;
}

export interface UpdatePersonalInfoRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  personalDetails?: {
    age?: number;
    location?: string;
    currentRole?: string;
  };
  education?: {
    highestEducation?: string;
    fieldOfStudy?: string;
    graduationYear?: number;
    certifications?: string[];
  };
  workExperience?: {
    experienceLevel?: string;
    jobRoles?: JobRole[];
  };
  skills?: {
    technicalSkills?: string[];
    softSkills?: string[];
    skillsToLearn?: string[];
  };
  careerGoals?: {
    goals?: string[];
    timeframe?: string;
    preferredIndustries?: string[];
    workPreference?: string;
  };
}

export interface UpdatePersonalInfoResponse {
  success: boolean;
  message: string;
}