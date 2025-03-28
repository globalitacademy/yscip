

export interface Course {
  id: string;
  title: string;
  name?: string;
  description: string;
  instructor: string;
  specialization?: string;
  duration: string;
  modules: string[];
  prerequisites: string[];
  imageUrl?: string;
  category: string;
  is_public?: boolean;
  createdBy?: string;
  learningOutcomes?: string[];
  createdAt?: string;
  updatedAt?: string;
  difficulty?: string;
}

