
import { useState } from 'react';
import { Course, ProfessionalCourse } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';

// Initial course states and mock data
export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

const initialCourses: Course[] = [];

export const useInitialCourseStates = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initializeCourses());
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProfessionalCourse, setSelectedProfessionalCourse] = useState<ProfessionalCourse | null>(null);
  const [professionalCourse, setProfessionalCourse] = useState<Partial<ProfessionalCourse>>({});
  const [courseType, setCourseType] = useState<'standard' | 'professional'>('standard');
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    specialization: '',
    instructor: '',
    duration: '',
    modules: [],
    prerequisites: [],
    category: '',
    createdBy: user?.id || '',
    is_public: false
  });
  
  const [newProfessionalCourse, setNewProfessionalCourse] = useState<Partial<ProfessionalCourse>>({
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Code, { className: "w-16 h-16" }),
    duration: '',
    price: '',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: user?.name || '',
    institution: 'ՀՊՏՀ',
    imageUrl: undefined,
    description: '',
    lessons: [],
    requirements: [],
    outcomes: [],
    is_public: false,
    show_on_homepage: false,
    display_order: 0
  });
  
  const [newModule, setNewModule] = useState('');

  return {
    courses,
    setCourses,
    professionalCourses,
    setProfessionalCourses,
    loading,
    setLoading,
    selectedCourse,
    setSelectedCourse,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    professionalCourse,
    setProfessionalCourse,
    courseType,
    setCourseType,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    newCourse,
    setNewCourse,
    newProfessionalCourse,
    setNewProfessionalCourse,
    newModule,
    setNewModule
  };
};

// Helper function to initialize courses from localStorage
const initializeCourses = (): Course[] => {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    try {
      return JSON.parse(storedCourses);
    } catch (e) {
      console.error('Error parsing stored courses:', e);
    }
  }
  return initialCourses;
};
