
import { useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ProfessionalCourse } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useProfessionalCourseOperations = (
  professionalCourses: ProfessionalCourse[],
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setNewProfessionalCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>,
  newProfessionalCourse: Partial<ProfessionalCourse>
) => {
  const { user } = useAuth();

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

    try {
      // Insert main course data
      const { data, error } = await supabase
        .from('courses')
        .insert({
          id: courseToAdd.id,
          title: courseToAdd.title,
          subtitle: courseToAdd.subtitle,
          icon_name: courseToAdd.iconName || 'book',
          duration: courseToAdd.duration,
          price: courseToAdd.price,
          button_text: courseToAdd.buttonText,
          color: courseToAdd.color,
          created_by: courseToAdd.createdBy,
          institution: courseToAdd.institution,
          image_url: courseToAdd.imageUrl,
          organization_logo: courseToAdd.organizationLogo,
          description: courseToAdd.description,
          is_public: courseToAdd.is_public
        })
        .select()
        .single();

      if (error) throw error;

      // Insert course lessons
      if (courseToAdd.lessons && courseToAdd.lessons.length > 0) {
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(
            courseToAdd.lessons.map(lesson => ({
              course_id: courseToAdd.id,
              title: lesson.title,
              duration: lesson.duration
            }))
          );

        if (lessonsError) {
          console.error('Error inserting course lessons:', lessonsError);
        }
      }

      // Insert course requirements
      if (courseToAdd.requirements && courseToAdd.requirements.length > 0) {
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(
            courseToAdd.requirements.map(requirement => ({
              course_id: courseToAdd.id,
              requirement: requirement
            }))
          );

        if (requirementsError) {
          console.error('Error inserting course requirements:', requirementsError);
        }
      }

      // Insert course outcomes
      if (courseToAdd.outcomes && courseToAdd.outcomes.length > 0) {
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            courseToAdd.outcomes.map(outcome => ({
              course_id: courseToAdd.id,
              outcome: outcome
            }))
          );

        if (outcomesError) {
          console.error('Error inserting course outcomes:', outcomesError);
        }
      }

      // Update local state for immediate UI feedback
      const updatedCourses = [...professionalCourses, courseToAdd];
      setProfessionalCourses(updatedCourses);
      
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
      return true;
    } catch (error) {
      console.error('Error adding professional course:', error);
      toast.error('Դասընթացի ավելացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }, [professionalCourses, setProfessionalCourses, setIsAddDialogOpen, user, setNewProfessionalCourse, newProfessionalCourse]);

  const handleUpdateProfessionalCourse = useCallback(async (id: string, courseData: Partial<ProfessionalCourse>) => {
    if (!id || !courseData) {
      toast.error('Թարմացման համար տվյալները բացակայում են');
      return false;
    }
    
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
    
    try {
      // Update the main course record
      const { error: updateError } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          subtitle: courseData.subtitle,
          icon_name: courseData.iconName,
          duration: courseData.duration,
          price: courseData.price,
          button_text: courseData.buttonText,
          color: courseData.color,
          institution: courseData.institution,
          image_url: courseData.imageUrl,
          organization_logo: courseData.organizationLogo,
          description: courseData.description,
          is_public: courseData.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Update lessons if provided
      if (courseData.lessons) {
        // First delete existing lessons
        await supabase.from('course_lessons').delete().eq('course_id', id);
        
        // Then insert new lessons
        if (courseData.lessons.length > 0) {
          const { error: lessonsError } = await supabase
            .from('course_lessons')
            .insert(
              courseData.lessons.map(lesson => ({
                course_id: id,
                title: lesson.title,
                duration: lesson.duration
              }))
            );
            
          if (lessonsError) {
            console.error('Error updating lessons:', lessonsError);
          }
        }
      }
      
      // Update requirements if provided
      if (courseData.requirements) {
        // First delete existing requirements
        await supabase.from('course_requirements').delete().eq('course_id', id);
        
        // Then insert new requirements
        if (courseData.requirements.length > 0) {
          const { error: requirementsError } = await supabase
            .from('course_requirements')
            .insert(
              courseData.requirements.map(requirement => ({
                course_id: id,
                requirement: requirement
              }))
            );
            
          if (requirementsError) {
            console.error('Error updating requirements:', requirementsError);
          }
        }
      }
      
      // Update outcomes if provided
      if (courseData.outcomes) {
        // First delete existing outcomes
        await supabase.from('course_outcomes').delete().eq('course_id', id);
        
        // Then insert new outcomes
        if (courseData.outcomes.length > 0) {
          const { error: outcomesError } = await supabase
            .from('course_outcomes')
            .insert(
              courseData.outcomes.map(outcome => ({
                course_id: id,
                outcome: outcome
              }))
            );
            
          if (outcomesError) {
            console.error('Error updating outcomes:', outcomesError);
          }
        }
      }
      
      // For immediate UI feedback, update the local state
      const updatedCourse = { 
        ...courseToUpdate, 
        ...courseData, 
        updatedAt: new Date().toISOString(),
        // Generate or update slug if title changed
        slug: courseData.title !== courseToUpdate.title
          ? courseData.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()
          : courseToUpdate.slug
      } as ProfessionalCourse;
      
      const updatedCourses = professionalCourses.map(course => 
        course.id === id ? updatedCourse : course
      );
      
      setProfessionalCourses(updatedCourses);
      setIsEditDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
      
      return true;
    } catch (error) {
      console.error('Error updating professional course:', error);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }, [professionalCourses, setProfessionalCourses, setIsEditDialogOpen]);

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
        toast.error('Սխալ է տեղի ունեցել դասընթաց ջնջելիս։');
        return false;
      }
      
      // Update local state for immediate UI feedback
      const updatedCourses = professionalCourses.filter(course => course.id !== id);
      setProfessionalCourses(updatedCourses);
      
      console.log("Successfully deleted course from Supabase");
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
      return true;
    } catch (error) {
      console.error('Unexpected error in handleDeleteProfessionalCourse:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }
  }, [professionalCourses, setProfessionalCourses, user]);

  return {
    handleAddProfessionalCourse,
    handleUpdateProfessionalCourse,
    handleDeleteProfessionalCourse
  };
};
