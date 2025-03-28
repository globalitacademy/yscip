
export interface Course {
  id: string;
  name: string;
  title?: string;
  description: string;
  specialization: string;
  instructor?: string;
  duration: string;
  modules: string[];
  prerequisites?: string[];
  category?: string;
  createdBy: string;
  is_public?: boolean;
  imageUrl?: string;
  learningOutcomes?: string[];
  createdAt: string;
  updatedAt: string;
}
