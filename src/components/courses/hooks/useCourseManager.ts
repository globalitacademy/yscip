
import { useState, useCallback } from 'react';
import { Course } from '../types';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

export const useCourseManager = () => {
  const { user } = useAuth();
  
  // State for courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [professionalCourse, setProfessionalCourse] = useState<Partial<ProfessionalCourse>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState('');
  const [courseType, setCourseType] = useState<'standard' | 'professional'>('standard');
  
  const loadCourses = useCallback(async () => {
    try {
      // Load from localStorage for demo
      const storedCourses = localStorage.getItem('courses');
      const storedProfessionalCourses = localStorage.getItem('professionalCourses');
      
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
      
      if (storedProfessionalCourses) {
        setProfessionalCourses(JSON.parse(storedProfessionalCourses));
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: 'Սխալ',
        description: 'Դասընթացների բեռնման ընթացքում սխալ է տեղի ունեցել',
        variant: 'destructive',
      });
    }
  }, []);
  
  // Function to handle adding a module to a course that's being edited
  const handleAddModuleToEdit = useCallback(() => {
    if (!newModule.trim() || !selectedCourse) return;
    
    const updatedModules = [...(selectedCourse.modules || []), newModule];
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
    setNewModule('');
  }, [newModule, selectedCourse]);
  
  // Function to handle removing a module from a course that's being edited
  const handleRemoveModuleFromEdit = useCallback((index: number) => {
    if (!selectedCourse) return;
    
    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    setSelectedCourse({ ...selectedCourse, modules: updatedModules });
  }, [selectedCourse]);
  
  // Function to create a new course
  const handleCreateCourse = useCallback(() => {
    if (courseType === 'standard') {
      if (!selectedCourse?.name || !selectedCourse?.specialization) {
        toast({
          title: 'Սխալ',
          description: 'Լրացրեք բոլոր պարտադիր դաշտերը',
          variant: 'destructive',
        });
        return;
      }
      
      const newCourse: Course = {
        ...selectedCourse,
        id: uuidv4(),
        createdBy: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedCourses = [newCourse, ...courses];
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      setIsCreateDialogOpen(false);
      setSelectedCourse(null);
      
      toast({
        title: 'Հաջողություն',
        description: 'Դասընթացը հաջողությամբ ստեղծվել է',
      });
    } else {
      if (!professionalCourse?.title || !professionalCourse?.description) {
        toast({
          title: 'Սխալ',
          description: 'Լրացրեք բոլոր պարտադիր դաշտերը',
          variant: 'destructive',
        });
        return;
      }
      
      const newCourse: ProfessionalCourse = {
        ...professionalCourse as ProfessionalCourse,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedCourses = [newCourse, ...professionalCourses];
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      setIsCreateDialogOpen(false);
      setProfessionalCourse({});
      
      toast({
        title: 'Հաջողություն',
        description: 'Մասնագիտական դասընթացը հաջողությամբ ստեղծվել է',
      });
    }
  }, [selectedCourse, professionalCourse, courseType, courses, professionalCourses, user?.id]);
  
  // Function to edit an existing course
  const handleEditCourse = useCallback(() => {
    if (courseType === 'standard') {
      if (!selectedCourse) return;
      
      const updatedCourses = courses.map(course => 
        course.id === selectedCourse.id ? { 
          ...selectedCourse, 
          updatedAt: new Date().toISOString() 
        } : course
      );
      
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      
      toast({
        title: 'Հաջողություն',
        description: 'Դասընթացը հաջողությամբ խմբագրվել է',
      });
    } else {
      if (!professionalCourse || !professionalCourse.id) return;
      
      const updatedCourses = professionalCourses.map(course => 
        course.id === professionalCourse.id ? { 
          ...(professionalCourse as ProfessionalCourse), 
          updatedAt: new Date().toISOString() 
        } : course
      );
      
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      setIsEditDialogOpen(false);
      setProfessionalCourse({});
      
      toast({
        title: 'Հաջողություն',
        description: 'Մասնագիտական դասընթացը հաջողությամբ խմբագրվել է',
      });
    }
  }, [selectedCourse, professionalCourse, courseType, courses, professionalCourses]);
  
  // Function to delete a course
  const handleDeleteCourse = useCallback((courseId: string) => {
    if (courseType === 'standard') {
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    } else {
      const updatedCourses = professionalCourses.filter(course => course.id !== courseId);
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
    }
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: 'Հաջողություն',
      description: 'Դասընթացը հաջողությամբ ջնջվել է',
    });
  }, [courseType, courses, professionalCourses]);
  
  // Function to initialize course editing
  const handleEditInit = useCallback((course: Course | ProfessionalCourse, type: 'standard' | 'professional') => {
    setCourseType(type);
    
    if (type === 'standard') {
      setSelectedCourse(course as Course);
      setProfessionalCourse({});
    } else {
      setProfessionalCourse(course as ProfessionalCourse);
      setSelectedCourse(null);
    }
    
    setIsEditDialogOpen(true);
  }, []);
  
  // Function to prepare for course creation
  const handleCreateInit = useCallback((type: 'standard' | 'professional') => {
    setCourseType(type);
    
    if (type === 'standard') {
      setSelectedCourse({
        id: '',
        name: '',
        specialization: '',
        duration: '',
        description: '',
        modules: [],
        createdBy: '',
        createdAt: '',
        updatedAt: ''
      } as Course);
      setProfessionalCourse({});
    } else {
      setProfessionalCourse({
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        description: '',
        duration: '',
        price: '',
        color: 'text-amber-500',
        iconName: 'code',
        buttonText: 'Դիտել', 
        is_public: false,
        lessons: [],
        outcomes: [],
        requirements: [],
      });
      setSelectedCourse(null);
    }
    
    setIsCreateDialogOpen(true);
  }, []);
  
  return {
    // State
    courses,
    professionalCourses,
    selectedCourse,
    professionalCourse,
    isEditDialogOpen,
    isCreateDialogOpen,
    isDeleteDialogOpen,
    newModule,
    courseType,
    
    // State setters
    setCourses,
    setProfessionalCourses,
    setSelectedCourse,
    setProfessionalCourse,
    setIsEditDialogOpen,
    setIsCreateDialogOpen,
    setIsDeleteDialogOpen,
    setNewModule,
    setCourseType,
    
    // Actions
    loadCourses,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleCreateCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleEditInit,
    handleCreateInit,
  };
};
