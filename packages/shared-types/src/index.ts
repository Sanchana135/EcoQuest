export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
  level: number;
  xp: number;
  streakDays: number;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface LessonDto {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  orderIndex: number;
  moduleId: string;
}

export interface QuestionDto {
  id: string;
  text: string;
  type: string;
  options: string[];
  correctOption: string;
  explanation?: string | null;
  points: number;
}

export interface QuizDto {
  id: string;
  title: string;
  timeLimitSec: number;
  moduleId: string;
  moduleTitle?: string;
  questions: QuestionDto[];
}

export interface ModuleDto {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string | null;
  isPublished: boolean;
  lessons: LessonDto[];
  quizzes: QuizDto[];
  createdAt: string;
}

export interface QuizSubmissionDto {
  answers: { questionId: string; selectedOption: string }[];
}

export interface QuizResultDto {
  attemptId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  breakdown: {
    questionId: string;
    questionText: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
    explanation?: string | null;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}
