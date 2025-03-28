
import { useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Course, ProfessionalCourse } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { saveCourseChanges } from '../utils/courseUtils';

export const useCourseOperations = (
  courses: Course[],
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
  professionalCourses: ProfessionalCourse[],
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setNewProfessionalCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>,
  newProfessionalCourse: Partial<ProfessionalCourse>
) => {
  const { user } = useAuth();

  // CRUD operations for regular courses
  const handleAddCourse = useCallback((newCourseData: Partial<Course>) => {
    if (!newCourseData.title || !newCourseData.description || !newCourseData.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const courseToAdd: Course = {
      id: uuidv4(),
      title: newCourseData.title,
      description: newCourseData.description,
      specialization: newCourseData.specialization || '',
      instructor: newCourseData.instructor || '',
      duration: newCourseData.duration,
      modules: newCourseData.modules || [],
      prerequisites: newCourseData.prerequisites || [],
      category: newCourseData.category || '',
      createdBy: user?.id || 'unknown',
      is_public: newCourseData.is_public || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedCourses = [...courses, courseToAdd];
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    
    setIsAddDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ ավելացվել է');
  }, [courses, setCourses, setIsAddDialogOpen, user]);

  // CRUD operations for professional courses
  const handleAddProfessionalCourse = useCallback(async (courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => {
    if (!courseData.title || !courseData.duration || !courseData.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return false;
    }

    // Generate slug if not provided
    if (!courseData.slug && courseData.title) {
      courseData.slug = courseData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    }

    const courseToAdd: ProfessionalCourse = {
      ...(courseData as ProfessionalCourse),
      id: uuidv4(),
      createdBy: user?.name || 'Unknown',
      buttonText: courseData.buttonText || 'Դիտել',
      subtitle: courseData.subtitle || 'ԴԱՍԸՆԹԱՑ',
      color: courseData.color || 'text-amber-500',
      institution: courseData.institution || 'ՀՊՏՀ',
      iconName: 'book',
      is_public: courseData.is_public || false,
      show_on_homepage: courseData.show_on_homepage || false,
      display_order: courseData.display_order || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = await saveCourseChanges(courseToAdd);
    
    if (success) {
      const updatedCourses = [...professionalCourses, courseToAdd];
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      
      setNewProfessionalCourse({
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        icon: newProfessionalCourse.icon,
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
      setIsAddDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ ավելացվել է');
    } else {
      toast.error('Դասընթացի ավելացման ժամանակ սխալ է տեղի ունեցել');
    }
    
    return success;
  }, [professionalCourses, setProfessionalCourses, setIsAddDialogOpen, user, setNewProfessionalCourse, newProfessionalCourse]);

  const handleUpdateCourse = useCallback(async (id: string, courseData: Partial<Course | ProfessionalCourse>) => {
    if (!id || !courseData) {
      toast.error('Թարմացման համար տվյալները բացակայում են');
      return false;
    }
    
    // Check if this is a standard or professional course
    const isStandard = courses.some(course => course.id === id);
    const isProfessional = professionalCourses.some(course => course.id === id);
    
    if (isStandard) {
      // Handle standard course update
      if (!courseData.title || !courseData.description || !courseData.duration) {
        toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
        return false;
      }
  
      const updatedCourses = courses.map(course => 
        course.id === id ? { ...course, ...courseData, updatedAt: new Date().toISOString() } : course
      );
      
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      setIsEditDialogOpen(false);
      toast.success('Կուրսը հաջողությամբ թարմացվել է');
      return true;
    } 
    else if (isProfessional) {
      // Handle professional course update
      if (!courseData.title || !courseData.duration) {
        toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
        return false;
      }
      
      // Find the course to update
      const courseToUpdate = professionalCourses.find(course => course.id === id);
      if (!courseToUpdate) {
        toast.error('Դասընթացը չի գտնվել');
        return false;
      }
      
      // Update the course
      const updatedCourse = { 
        ...courseToUpdate, 
        ...courseData, 
        updatedAt: new Date().toISOString(),
        // Generate or update slug if title changed
        slug: courseData.title !== courseToUpdate.title
          ? courseData.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()
          : courseToUpdate.slug
      } as ProfessionalCourse;
      
      const success = await saveCourseChanges(updatedCourse);
      
      if (success) {
        const updatedCourses = professionalCourses.map(course => 
          course.id === id ? updatedCourse : course
        );
        
        setProfessionalCourses(updatedCourses);
        localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
        setIsEditDialogOpen(false);
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
      
      return success;
    } else {
      toast.error('Դասընթացը չի գտնվել');
      return false;
    }
  }, [courses, setCourses, professionalCourses, setProfessionalCourses, setIsEditDialogOpen]);

  const handleUpdateProfessionalCourse = useCallback(async (id: string, courseData: Partial<ProfessionalCourse>) => {
    return handleUpdateCourse(id, courseData);
  }, [handleUpdateCourse]);

  // Improved delete course handler
  const handleDeleteCourse = useCallback(async (id: string) => {
    try {
      console.log("Deleting standard course with ID:", id);
      const courseToDelete = courses.find(course => course.id === id);
      
      if (!courseToDelete) {
        console.error("Course not found in courses array:", id);
        toast.error('Դասընթացը չի գտնվել');
        return false;
      }
      
      // Check permissions
      const canDelete = user?.role === 'admin' || courseToDelete.createdBy === user?.id;
      if (!canDelete) {
        console.error("User doesn't have permission to delete this course");
        toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
        return false;
      }
      
      // Update local state
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
      
      console.log("Standard course successfully deleted from local state");
      return true;
    } catch (error) {
      console.error('Error in handleDeleteCourse:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }, [courses, setCourses, user]);

  // Completely improved handleDeleteProfessionalCourse function
  const handleDeleteProfessionalCourse = useCallback(async (id: string) => {
    console.log("Attempting to delete professional course with ID:", id);
    
    if (!id) {
      console.error("Invalid course ID provided");
      toast.error("Անվավեր դասընթացի ID");
      return false;
    }
    
    // First, find the course in local state to check permissions
    const courseToDelete = professionalCourses.find(course => course.id === id);
    if (!courseToDelete) {
      console.error('Course not found in local state:', id);
      toast.error('Դասընթացը չի գտնվել');
      return false;
    }
    
    // Check permission to delete
    if (!(user?.role === 'admin' || courseToDelete.createdBy === user?.name)) {
      console.error('User does not have permission to delete this course');
      toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
      return false;
    }
    
    try {
      // First update local state
      const updatedCourses = professionalCourses.filter(course => course.id !== id);
      setProfessionalCourses(updatedCourses);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      console.log("Course removed from local state:", id);
      
      // Then try to delete from database
      try {
        // Delete related records first
        console.log("Deleting related course data from Supabase...");
        
        // Using Promise.allSettled to attempt all deletes even if some fail
        const deleteResults = await Promise.allSettled([
          supabase.from('course_lessons').delete().eq('course_id', id),
          supabase.from('course_requirements').delete().eq('course_id', id),
          supabase.from('course_outcomes').delete().eq('course_id', id)
        ]);
        
        // Log results of related deletions
        deleteResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(`Failed to delete related records (group ${index}):`, result.reason);
          }
        });
        
        // Delete the main course record
        console.log("Deleting main course record from Supabase:", id);
        const { error } = await supabase.from('courses').delete().eq('id', id);
        
        if (error) {
          console.error('Error deleting course from Supabase:', error);
          // We don't return false here because the local state is already updated
          toast.warning('Դասընթացը ջնջվել է տեղական հիշողությունից, բայց սերվերը վերադարձրեց սխալ։');
        } else {
          console.log("Successfully deleted course from Supabase");
          toast.success('Դասընթացը հաջողությամբ ջնջվել է');
        }
        
        return true;
      } catch (dbError) {
        console.error('Database error in handleDeleteProfessionalCourse:', dbError);
        toast.warning('Դասընթացը ջնջվել է տեղական հիշողությունից, բայց տվյալների բազայում սխալ է տեղի ունեցել։');
        
        // Still return true because local state was updated successfully
        return true;
      }
    } catch (error) {
      console.error('Unexpected error in handleDeleteProfessionalCourse:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }, [professionalCourses, setProfessionalCourses, user]);

  return {
    handleAddCourse,
    handleAddProfessionalCourse,
    handleUpdateCourse,
    handleUpdateProfessionalCourse,
    handleDeleteCourse,
    handleDeleteProfessionalCourse
  };
};
