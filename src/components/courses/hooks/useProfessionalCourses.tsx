
import { useState, useEffect } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAllCourses, saveCourseChanges } from '../utils/courseUtils';
import { toast } from 'sonner';

export const useProfessionalCourses = (initialCourses: ProfessionalCourse[] = []) => {
  const { user } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ProfessionalCourse | null>(null);
  const [courses, setCourses] = useState<ProfessionalCourse[]>(initialCourses);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const fetchedCourses = await fetchAllCourses();
        if (fetchedCourses.length > 0) {
          setCourses(fetchedCourses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };
    
    loadCourses();
  }, []);

  const handleEditCourse = async () => {
    if (!selectedCourse) return;

    try {
      const success = await saveCourseChanges(selectedCourse);
      if (success) {
        const updatedCourses = courses.map(course => 
          course.id === selectedCourse.id ? { ...selectedCourse } : course
        );
        
        setCourses(updatedCourses);
        
        localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
        
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsEditDialogOpen(false);
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const handleAddCourse = (newCourse: ProfessionalCourse) => {
    setCourses([...courses, newCourse]);
    setIsAddDialogOpen(false);
    toast.success('Դասընթացը հաջողությամբ ավելացվել է');
  };

  const openEditDialog = (course: ProfessionalCourse) => {
    setSelectedCourse(course);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteCourse = async (id: string) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      
      const { error } = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      })
      .then(res => res.json());
      
      if (error) throw new Error(error);
      
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
      
      const updatedCourses = await fetchAllCourses();
      setCourses(updatedCourses);
    }
  };
  
  const canEditCourse = (course: ProfessionalCourse) => {
    return user && (user.role === 'admin' || course.createdBy === user.name);
  };

  return {
    courses,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    selectedCourse,
    setSelectedCourse,
    handleEditCourse,
    handleAddCourse,
    openEditDialog,
    handleDeleteCourse,
    canEditCourse
  };
};
