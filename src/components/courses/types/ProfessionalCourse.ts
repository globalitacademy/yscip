
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
  iconName: string; // Store the icon name separately for serialization
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
  if (!payload || typeof payload !== 'object') {
    console.error('Invalid course payload: not an object', payload);
    return false;
  }
  
  if (!('id' in payload)) {
    console.error('Invalid course payload: missing ID', payload);
    return false;
  }
  
  if (typeof payload.id !== 'string' && typeof payload.id !== 'number') {
    console.error('Invalid course payload: ID is not a string or number', payload);
    return false;
  }
  
  return true;
}
