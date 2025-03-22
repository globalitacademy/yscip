
import { useState, useEffect } from 'react';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getAllCourses, saveCourseChanges } from './utils/courseUtils';
import { supabase } from '@/integrations/supabase/client';

export const useCourseManagement = () => {
  const { user } = useAuth();
  
  // State for courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for selected course
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProfessionalCourse, setSelectedProfessionalCourse] = useState<ProfessionalCourse | null>(null);
  
  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // New module for regular courses
  const [newModule, setNewModule] = useState<{ title: string, duration: string }>({ title: '', duration: '' });

  // Filter user's courses
  const userCourses = courses.filter(course => course.createdBy === user?.id);
  const userProfessionalCourses = professionalCourses.filter(course => course.createdBy === user?.name);

  // Initialize and load courses
  useEffect(() => {
    loadCourses();
    
    // Subscribe to real-time updates for professional courses
    const channel = supabase
      .channel('public:courses')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'courses' },
        async (payload) => {
          console.log('Course real-time update:', payload);
          loadProfessionalCourses();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Load courses from storage and database
  const loadCourses = async () => {
    setIsLoading(true);
    try {
      // Load professional courses from database
      await loadProfessionalCourses();
      
      // For now, regular courses stay in localStorage (could be migrated to DB in future)
      const storedCourses = localStorage.getItem('courses');
      if (storedCourses) {
        try {
          const parsedCourses = JSON.parse(storedCourses);
          setCourses(parsedCourses);
        } catch (e) {
          console.error('Error parsing stored courses:', e);
          setCourses([]);
        }
      } else {
        setCourses([]);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load professional courses from database
  const loadProfessionalCourses = async () => {
    try {
      const fetchedCourses = await getAllCourses();
      if (fetchedCourses && fetchedCourses.length > 0) {
        setProfessionalCourses(fetchedCourses);
      } else {
        setProfessionalCourses([]);
      }
    } catch (error) {
      console.error('Error loading professional courses:', error);
      setProfessionalCourses([]);
    }
  };
  
  // Create a new course
  const handleCreateCourse = (newCourse: Course) => {
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    
    // Save to localStorage
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    toast.success('Կուրսը հաջողությամբ ստեղծվել է');
    setIsCreateDialogOpen(false);
  };
  
  // Create a new professional course
  const handleCreateProfessionalCourse = async (newCourse: ProfessionalCourse) => {
    try {
      const success = await saveCourseChanges(newCourse);
      if (success) {
        setProfessionalCourses(prev => [...prev, newCourse]);
        toast.success('Դասընթացը հաջողությամբ ստեղծվել է');
        setIsCreateDialogOpen(false);
      } else {
        toast.error('Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error creating professional course:', error);
      toast.error('Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել');
    }
  };
  
  // Initialize edit for a course
  const handleEditInit = (course: Course) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };
  
  // Initialize edit for a professional course
  const handleEditProfessionalCourseInit = (course: ProfessionalCourse) => {
    setSelectedProfessionalCourse(course);
    setIsEditDialogOpen(true);
  };
  
  // Edit a course
  const handleEditCourse = (editedCourse: Course) => {
    const updatedCourses = courses.map(course => 
      course.id === editedCourse.id ? editedCourse : course
    );
    
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    toast.success('Կուրսը հաջողությամբ թարմացվել է');
    setIsEditDialogOpen(false);
  };
  
  // Edit a professional course
  const handleEditProfessionalCourse = async () => {
    if (!selectedProfessionalCourse) return;
    
    try {
      const success = await saveCourseChanges(selectedProfessionalCourse);
      if (success) {
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsEditDialogOpen(false);
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error updating professional course:', error);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
  };
  
  // Delete a course
  const handleDeleteCourse = (id: string) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    toast.success('Կուրսը հաջողությամբ ջնջվել է');
  };
  
  // Delete a professional course
  const handleDeleteProfessionalCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting professional course:', error);
        toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      setProfessionalCourses(prev => prev.filter(course => course.id !== id));
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (error) {
      console.error('Error deleting professional course:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    }
  };
  
  // Add a module to a course being edited
  const handleAddModuleToEdit = () => {
    if (!selectedCourse || !newModule.title || !newModule.duration) return;
    
    setSelectedCourse({
      ...selectedCourse,
      modules: [...(selectedCourse.modules || []), newModule.title]
    });
    
    setNewModule({ title: '', duration: '' });
  };
  
  // Remove a module from a course being edited
  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    
    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };

  return {
    courses,
    professionalCourses,
    userCourses,
    userProfessionalCourses,
    selectedCourse,
    setSelectedCourse,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isLoading,
    newModule,
    setNewModule,
    handleCreateCourse,
    handleCreateProfessionalCourse,
    handleEditInit,
    handleEditProfessionalCourseInit,
    handleEditCourse,
    handleEditProfessionalCourse,
    handleDeleteCourse,
    handleDeleteProfessionalCourse,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    loadCourses
  };
};
