export enum AppState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  JOB_BOARD = 'JOB_BOARD',
  DASHBOARD = 'DASHBOARD',
  SYSTEM_CHECK = 'SYSTEM_CHECK',
  INTERVIEW = 'INTERVIEW',
  RECRUITER_PANEL = 'RECRUITER_PANEL'
}

export interface IRTQuestion {
  id: string;
  text: string;
  beta: number; // Difficulty parameter
  alpha: number; // Discrimination parameter
  category: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  description: string;
  requirements: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: 'APPLIED' | 'ASSESSMENT_PENDING' | 'ASSESSMENT_COMPLETE' | 'INTERVIEW_SCHEDULED' | 'OFFER';
  timestamp: string;
  result?: InterviewResult;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  provider: 'LinkedIn' | 'Google';
  metadata: {
    accountAgeYears: number;
    connectionDensity: number;
    profileCompletion: number;
    isGhost?: boolean;
  };
  experienceYears: number;
  seniorityLevel: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export interface IntegrityEvent {
  timestamp: number;
  type: 'TAB_SWITCH' | 'WINDOW_BLUR' | 'MOUSE_EXIT';
  severity: 'LOW' | 'HIGH';
}

export interface InterviewResult {
  candidateId: string;
  responses: Array<{
    questionId: string;
    transcript: string;
    scores: {
      technicalAccuracy: number;
      coherence: number;
      authenticity: number;
      seniorityAlignment: number;
    };
    flags: string[];
    followUp?: {
      probe: string;
      response: string;
      score: number;
    };
  }>;
  overallScore: number;
  // New 2026 Soft Skill Metrics
  softSkills?: {
    talkToListenRatio: number; // Ideal 0.6
    objectionHandlingScore: number; // 0-100
    empathyMarkers: number; // Count
  };
  aiRecommendation: 'HIRE' | 'REJECT' | 'MAYBE';
  aiDecisionReason: string;
  integrityLog: IntegrityEvent[];
  timestamp: string;
}
