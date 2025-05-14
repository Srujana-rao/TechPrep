
export type InterviewType = 'technical' | 'behavioral' | 'mixed';

export interface InterviewQuestion {
  id: string;
  text: string;
  type: InterviewType | string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewResponse {
  questionId: string;
  responseText: string;
  timestamp: string;
  quality?: 'good' | 'fair' | 'needs_improvement';
}

export interface InterviewResult {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  completedAt: string;
  responseQuality?: Record<number, 'good' | 'fair' | 'needs_improvement'>;
  questionsAsked?: number;
  userResponses?: string[];
  conversation?: Array<{
    question?: string;
    answer?: string;
    feedback?: string;
    speaker?: string;
    text?: string;
    quality?: string;
  }>;
}

export interface InterviewData {
  id: string;
  title: string;
  position?: string;
  role?: string;
  type: InterviewType;
  questions?: string[];
  completed?: boolean;
  date?: string;
  duration?: string;
  score?: number;
  results?: InterviewResult;
}
