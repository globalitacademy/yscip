
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
  instructor?: string;  // Legacy field kept for backward compatibility
  modules?: string[];   // Added for compatibility with Course
  prerequisites?: string[];  // Added for compatibility with Course
  
  // New fields for authors and instructors
  author_type?: 'lecturer' | 'institution';
  instructor_ids?: string[];  // Array of instructor IDs
  
  // Fields for display controls
  show_on_homepage?: boolean;
  display_order?: number;
  slug?: string;  // For friendly URLs
  
  // New fields for learning format
  learning_formats?: string[];  // Online, classroom, remote, etc.
  languages?: string[];       // Armenian, Russian, English, etc.
  
  // New fields for resources
  resources?: ResourceItem[];
  syllabus_file?: string;  // URL to the downloadable syllabus
}

export interface LessonItem {
  title: string;
  duration: string;
}

export interface ResourceItem {
  title: string;
  url: string;
  type: 'document' | 'link' | 'video' | 'other';
}

export interface CourseInstructor {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  course_id: string;
  created_at?: string;
  updated_at?: string;
}
