
import { Course } from '../types';
import React from 'react';
import { Code } from 'lucide-react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

// Mock specializations for the form
export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

// Old mock data kept for reference (Legacy courses)
export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Վեբ ծրագրավորում',
    description: 'HTML, CSS, JavaScript, React և Node.js օգտագործելով վեբ հավելվածների մշակում',
    specialization: 'Ծրագրավորում',
    duration: '4 ամիս',
    modules: ['HTML/CSS հիմունքներ', 'JavaScript', 'React', 'Node.js/Express', 'Վերջնական նախագիծ'],
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Մեքենայական ուսուցում',
    description: 'Ներածություն մեքենայական ուսուցման մեջ՝ օգտագործելով Python և TensorFlow',
    specialization: 'Տվյալագիտություն',
    duration: '6 ամիս',
    modules: ['Python հիմունքներ', 'Տվյալների վերլուծություն', 'Վիճակագրություն', 'Մեքենայական ուսուցման մոդելներ', 'Խորը ուսուցում', 'Վերջնական նախագիծ'],
    createdBy: 'admin'
  }
];

// Initialize a new professional course template
export const getNewProfessionalCourseTemplate = (userId: string): Partial<ProfessionalCourse> => ({
  title: '',
  subtitle: 'ԴԱՍԸՆԹԱՑ',
  icon: React.createElement(Code, { className: "w-16 h-16" }),
  icon_name: 'code',
  duration: '',
  price: '',
  button_text: 'Դիտել',
  color: 'text-amber-500',
  created_by: userId || '',
  institution: 'ՀՊՏՀ',
  image_url: undefined,
  description: '',
  lessons: [],
  requirements: [],
  outcomes: []
});

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
