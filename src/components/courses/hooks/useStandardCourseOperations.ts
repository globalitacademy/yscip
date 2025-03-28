
import { useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Course } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useStandardCourseOperations = (
  courses: Course[],
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { user } = useAuth();

  const handleAddCourse = useCallback(async (newCourseData: Partial<Course>) => {
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

    try {
      // Save to database
      const { error } = await supabase
        .from('courses')
        .insert({
          id: courseToAdd.id,
          title: courseToAdd.title,
          description: courseToAdd.description,
          specialization: courseToAdd.specialization,
          duration: courseToAdd.duration,
          modules: courseToAdd.modules,
          price: '0', // Default value for standard courses
          icon_name: 'book', // Default icon
          button_text: 'Դիտել',
          color: 'text-amber-500',
          created_by: courseToAdd.createdBy,
          is_public: courseToAdd.is_public
        });

      if (error) throw error;

      // Update local state for immediate UI feedback
      const updatedCourses = [...courses, courseToAdd];
      setCourses(updatedCourses);
      
      setIsAddDialogOpen(false);
      toast.success('Կուրսը հաջողությամբ ավելացվել է');
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Կուրսի ավելացման ժամանակ սխալ է տեղի ունեցել');
    }
  }, [courses, setCourses, setIsAddDialogOpen, user]);

  const handleUpdateStandardCourse = useCallback(async (id: string, courseData: Partial<Course>) => {
    if (!id || !courseData) {
      toast.error('Թարմացման համար տվյալները բացակայում են');
      return false;
    }
    
    // Handle standard course update
    if (!courseData.title || !courseData.description || !courseData.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return false;
    }

    try {
      // Update in database
      const { error } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          description: courseData.description,
          specialization: courseData.specialization,
          duration: courseData.duration,
          modules: courseData.modules,
          is_public: courseData.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state for immediate UI feedback
      const updatedCourses = courses.map(course => 
        course.id === id ? { ...course, ...courseData, updatedAt: new Date().toISOString() } : course
      );
      
      setCourses(updatedCourses);
      setIsEditDialogOpen(false);
      toast.success('Կուրսը հաջողությամբ թարմացվել է');
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Կուրսի թարմացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }, [courses, setCourses, setIsEditDialogOpen]);

  const handleDeleteCourse = useCallback(async (id: string) => {
    try {
      console.log("Deleting standard course with ID:", id);
      
      // Find the course in the array
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

      // Delete from database
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state for immediate UI feedback
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      
      console.log("Standard course successfully deleted");
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
      return true;
    } catch (error) {
      console.error('Error in handleDeleteCourse:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }, [courses, setCourses, user]);

  return {
    handleAddCourse,
    handleUpdateStandardCourse,
    handleDeleteCourse
  };
};
