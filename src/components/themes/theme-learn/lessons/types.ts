
export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: number; // in minutes
  type: 'text' | 'video' | 'quiz' | 'practice';
  order: number;
  isCompleted: boolean;
  videoUrl?: string;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt?: Date;
}
