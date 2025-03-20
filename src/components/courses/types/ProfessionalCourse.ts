
import { ReactElement } from 'react';

export interface CourseLesson {
  title: string;
  duration: string;
}

export interface ProfessionalCourse {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactElement;
  iconName: string; // Ensure iconName is required, not optional
  duration: string;
  price: string;
  buttonText: string;
  color: string;
  createdBy: string;
  institution: string;
  imageUrl?: string;
  organizationLogo?: string;
  description?: string;
  lessons?: CourseLesson[];
  requirements?: string[];
  outcomes?: string[];
}
