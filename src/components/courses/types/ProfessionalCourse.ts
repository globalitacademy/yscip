
import { ReactElement } from 'react';

export interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactElement;
  iconName?: string;
  duration: string;
  price: string;
  buttonText: string;
  color: string;
  createdBy: string;
  institution: string;
  description?: string;
  imageUrl?: string;
  organizationLogo?: string;
  lessons?: LessonItem[];
  requirements?: string[];
  outcomes?: string[];
  is_public?: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: string;
  instructor?: string;  // Added for compatibility with Course
  modules?: string[];   // Added for compatibility with Course
}

export interface LessonItem {
  title: string;
  duration: string;
}
