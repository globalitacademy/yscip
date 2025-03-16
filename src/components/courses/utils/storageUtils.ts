
import { Course } from '../types';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { mockCourses, mockProfessionalCourses } from './mockData';

// Initialize professional courses with mock data if localStorage is empty
export const initializeProfessionalCourses = (): ProfessionalCourse[] => {
  const storedCourses = localStorage.getItem('professionalCourses');
  if (storedCourses) {
    try {
      return JSON.parse(storedCourses);
    } catch (e) {
      console.error('Error parsing stored professional courses:', e);
    }
  }
  return mockProfessionalCourses;
};

// Initialize courses with mock data if localStorage is empty
export const initializeCourses = (): Course[] => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    try {
      return JSON.parse(storedCourses);
    } catch (e) {
      console.error('Error parsing stored courses:', e);
    }
  }
  return mockCourses;
};

// Save courses to localStorage
export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem('courses', JSON.stringify(courses));
};

// Save professional courses to localStorage
export const saveProfessionalCourses = (courses: ProfessionalCourse[]): void => {
  localStorage.setItem('professionalCourses', JSON.stringify(courses));
};
