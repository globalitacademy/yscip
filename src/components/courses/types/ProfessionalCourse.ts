
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
  iconName: string; 
  duration: string;
  price: string;
  buttonText: string;
  color: string;
  createdBy: string;
  institution: string;
  preferIcon: boolean;
  imageUrl?: string;
  organizationLogo?: string;
  description?: string;
  lessons?: CourseLesson[];
  requirements?: string[];
  outcomes?: string[];
}

// Type guard to validate Supabase payload for course data
export function isCoursePayload(payload: any): payload is { id: string | number; [key: string]: any } {
  return payload && 
         (typeof payload === 'object') && 
         ('id' in payload) && 
         (typeof payload.id === 'string' || typeof payload.id === 'number');
}
