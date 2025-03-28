export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
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
}
