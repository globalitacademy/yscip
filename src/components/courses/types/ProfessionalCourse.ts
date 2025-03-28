
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
  instructor?: string;  // Added to make it more compatible with Course
  modules?: string[];   // Added to make it more compatible with Course
}

export interface LessonItem {
  title: string;
  duration: string;
}
