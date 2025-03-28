import { useState, useEffect, useCallback } from 'react';
import { Course, ProfessionalCourse } from '../types';
import { BrainCircuit, Book } from 'lucide-react';
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { saveCourseChanges } from '../utils/courseUtils';

export const useCourseManager = ({ 
  courses, 
  setCourses, 
  professionalCourses, 
  setProfessionalCourses, 
  isCreateDialogOpen, 
  setIsCreateDialogOpen 
}: {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  professionalCourses: ProfessionalCourse[];
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredProfessionalCourses, setFilteredProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateProfessionalDialogOpen, setIsCreateProfessionalDialogOpen] = useState(false);
  const [isEditProfessionalDialogOpen, setIsEditProfessionalDialogOpen] = useState(false);
  const [isDeleteProfessionalDialogOpen, setIsDeleteProfessionalDialogOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [professionalCourseToEdit, setProfessionalCourseToEdit] = useState<ProfessionalCourse | null>(null);
  const [professionalCourseToDelete, setProfessionalCourseToDelete] = useState<ProfessionalCourse | null>(null);
  
  const userCourses = courses.filter(course => course.createdBy === user?.id);
  const userProfessionalCourses = professionalCourses.filter(course => course.createdBy === user?.name);
  
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Apply search filter to both standard and professional courses
    const searchFilteredCourses = courses.filter(course =>
      course.title.toLowerCase().includes(value.toLowerCase()) ||
      course.description.toLowerCase().includes(value.toLowerCase())
    );
    const searchFilteredProfessionalCourses = professionalCourses.filter(course =>
      course.title.toLowerCase().includes(value.toLowerCase()) ||
      course.description?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(searchFilteredCourses);
    setFilteredProfessionalCourses(searchFilteredProfessionalCourses);
  };
  
  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value);
    // Apply category filter to both standard and professional courses
    const categoryFilteredCourses = value
      ? courses.filter(course => course.category === value)
      : courses;
    const categoryFilteredProfessionalCourses = value
      ? professionalCourses.filter(course => course.category === value)
      : professionalCourses;
    setFilteredCourses(categoryFilteredCourses);
    setFilteredProfessionalCourses(categoryFilteredProfessionalCourses);
  };
  
  const handleDifficultyChange = (value: string | null) => {
    setSelectedDifficulty(value);
    // Apply difficulty filter to standard courses only
    const difficultyFilteredCourses = value
      ? courses.filter(course => course.difficulty === value)
      : courses;
    setFilteredCourses(difficultyFilteredCourses);
  };
  
  const handleSortChange = (value: string | null) => {
    setSelectedSort(value);
    // Apply sorting to both standard and professional courses
    let sortedCourses = [...courses];
    let sortedProfessionalCourses = [...professionalCourses];
    
    if (value === 'title-asc') {
      sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
      sortedProfessionalCourses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === 'title-desc') {
      sortedCourses.sort((a, b) => b.title.localeCompare(a.title));
      sortedProfessionalCourses.sort((a, b) => b.title.localeCompare(a.title));
    } else if (value === 'date-asc') {
      sortedCourses.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
      sortedProfessionalCourses.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
    } else if (value === 'date-desc') {
      sortedCourses.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      sortedProfessionalCourses.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    }
    
    setFilteredCourses(sortedCourses);
    setFilteredProfessionalCourses(sortedProfessionalCourses);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedSort(null);
    setFilteredCourses(courses);
    setFilteredProfessionalCourses(professionalCourses);
  };
  
  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate loading courses from an API
      // In a real application, you would fetch data from an API endpoint
      // and update the courses state with the fetched data
      // For now, we'll just use a setTimeout to simulate the loading process
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (e: any) {
      setError(e.message || 'Failed to load courses');
      setIsLoading(false);
    }
  }, []);
  
  const handleOpenEditDialog = (course: Course) => {
    setCourseToEdit(course);
    setIsEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCourseToEdit(null);
  };
  
  const handleOpenDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setCourseToDelete(null);
  };
  
  const handleOpenCreateProfessionalDialog = () => {
    setIsCreateProfessionalDialogOpen(true);
  };
  
  const handleCloseCreateProfessionalDialog = () => {
    setIsCreateProfessionalDialogOpen(false);
  };
  
  const handleOpenEditProfessionalDialog = (course: ProfessionalCourse) => {
    setProfessionalCourseToEdit(course);
    setIsEditProfessionalDialogOpen(true);
  };
  
  const handleCloseEditProfessionalDialog = () => {
    setIsEditProfessionalDialogOpen(false);
    setProfessionalCourseToEdit(null);
  };
  
  const handleOpenDeleteProfessionalDialog = (course: ProfessionalCourse) => {
    setProfessionalCourseToDelete(course);
    setIsDeleteProfessionalDialogOpen(true);
  };
  
  const handleCloseDeleteProfessionalDialog = () => {
    setIsDeleteProfessionalDialogOpen(false);
    setProfessionalCourseToDelete(null);
  };
  
  // Course creation and editing states
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [professionalCourse, setProfessionalCourse] = useState<Partial<ProfessionalCourse> | null>(null);
  const [courseType, setCourseType] = useState<'standard' | 'professional'>('standard');
  const [newModule, setNewModule] = useState('');
  
  // Initialize course states when creating a new course
  const handleCreateInit = useCallback((type: 'standard' | 'professional') => {
    setCourseType(type);
    
    if (type === 'standard') {
      setSelectedCourse({
        id: '',
        title: '',
        description: '',
        instructor: user?.name || '',
        duration: '',
        modules: [],
        prerequisites: [],
        createdBy: user?.id || '',
        is_public: false
      });
      setProfessionalCourse(null);
    } else {
      setProfessionalCourse({
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        icon: React.createElement(Book, { className: "w-16 h-16" }),
        iconName: 'book',
        duration: '',
        price: '',
        buttonText: 'Դիտել',
        color: 'text-amber-500',
        createdBy: user?.name || '',
        institution: 'ՀՊՏՀ',
        description: '',
        is_public: false,
        lessons: [],
        requirements: [],
        outcomes: []
      });
      setSelectedCourse(null);
    }
    setIsCreateDialogOpen(true);
  }, [user, setIsCreateDialogOpen]);
  
  // Initialize course states for editing
  const handleEditInit = useCallback((course: Course | ProfessionalCourse, type: 'standard' | 'professional' = 'standard') => {
    setCourseType(type);
    
    if (type === 'standard') {
      setSelectedCourse(course as Course);
      setProfessionalCourse(null);
    } else {
      setProfessionalCourse(course as ProfessionalCourse);
      setSelectedCourse(null);
    }
  }, []);
  
  const handleAddModuleToEdit = () => {
    if (!newModule || !selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: [...selectedCourse.modules, newModule]
    });
    setNewModule('');
  };

  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };
  
  // CRUD operations for courses
  const handleCreateCourse = useCallback(async (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    if (!courseData.title || !courseData.description || !courseData.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    const newCourse: Course = {
      ...courseData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
    };

    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Course created successfully",
    });
    
    return true;
  }, [courses, setCourses, setIsCreateDialogOpen, user]);

  const handleCreateProfessionalCourse = useCallback(async (courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => {
    if (!courseData.title || !courseData.duration || !courseData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    const newCourse: ProfessionalCourse = {
      ...courseData as ProfessionalCourse,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.name || '',
    };

    try {
      // Save to Supabase/local storage
      const success = await saveCourseChanges(newCourse);
      
      if (success) {
        const updatedCourses = [...professionalCourses, newCourse];
        setProfessionalCourses(updatedCourses);
        setIsCreateDialogOpen(false);
        
        toast({
          title: "Success",
          description: "Professional course created successfully",
        });
        
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to save course",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error creating professional course:", error);
      toast({
        title: "Error",
        description: "An error occurred while creating the course",
        variant: "destructive"
      });
      return false;
    }
  }, [professionalCourses, setProfessionalCourses, setIsCreateDialogOpen, user]);
  
  const handleUpdateCourse = useCallback(async (id: string, courseData: Partial<Course>) => {
    // Implement update logic here
    return false;
  }, []);
  
  const handleDeleteCourse = useCallback(async (id: string) => {
    // Implement delete logic here
    return false;
  }, []);
  
  const handleUpdateProfessionalCourse = useCallback(async (id: string, courseData: Partial<ProfessionalCourse>) => {
    // Implement update logic here
    return false;
  }, []);
  
  const handleDeleteProfessionalCourse = useCallback(async (id: string) => {
    // Implement delete logic here
    return false;
  }, []);

  return {
    courses,
    userCourses,
    professionalCourses,
    userProfessionalCourses,
    isLoading,
    error,
    activeCourse,
    filteredCourses,
    filteredProfessionalCourses,
    searchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedSort,
    isEditDialogOpen,
    isDeleteDialogOpen,
    isCreateProfessionalDialogOpen,
    isEditProfessionalDialogOpen,
    isDeleteProfessionalDialogOpen,
    courseToEdit,
    courseToDelete,
    professionalCourseToEdit,
    professionalCourseToDelete,
    setCourses,
    setProfessionalCourses,
    setIsCreateDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    loadCourses,
    handleSearchChange,
    handleCategoryChange,
    handleDifficultyChange,
    handleSortChange,
    resetFilters,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenCreateProfessionalDialog,
    handleCloseCreateProfessionalDialog,
    handleOpenEditProfessionalDialog,
    handleCloseEditProfessionalDialog,
    handleOpenDeleteProfessionalDialog,
    handleCloseDeleteProfessionalDialog,
    selectedCourse,
    setSelectedCourse,
    professionalCourse,
    setProfessionalCourse,
    courseType,
    setCourseType,
    newModule,
    setNewModule,
    handleCreateInit,
    handleEditInit,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleCreateCourse,
    handleCreateProfessionalCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    handleUpdateProfessionalCourse,
    handleDeleteProfessionalCourse
  };
};
