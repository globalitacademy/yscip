import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/components/courses/types';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook for handling all course-related database operations
 */
export const useCourseService = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  /**
   * Fetch all courses from the database
   */
  const fetchCourses = async (): Promise<ProfessionalCourse[]> => {
    setLoading(true);
    try {
      const query = supabase
        .from('courses')
        .select('*');
      
      // If user is not admin, only show public courses and their own courses
      if (user && user.role !== 'admin') {
        query.or(`is_public.eq.true,created_by.eq.${user.name}`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast.error('Սխալ դասընթացների ստացման ժամանակ, օգտագործվում են լոկալ տվյալները');
        return [];
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      // Process each course to include lessons, requirements, and outcomes
      const completeCourses = await Promise.all(data.map(async (course) => {
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: requirementsData } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', course.id);
        
        const { data: outcomesData } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', course.id);
        
        // Create icon component
        const iconElement = convertIconNameToComponent(course.icon_name);
        
        return {
          id: course.id,
          title: course.title,
          subtitle: course.subtitle,
          icon: iconElement,
          iconName: course.icon_name,
          duration: course.duration,
          price: course.price,
          buttonText: course.button_text,
          color: course.color,
          createdBy: course.created_by,
          institution: course.institution,
          imageUrl: course.image_url,
          organizationLogo: course.organization_logo,
          description: course.description,
          is_public: course.is_public,
          lessons: lessonsData?.map(lesson => ({
            title: lesson.title, 
            duration: lesson.duration
          })) || [],
          requirements: requirementsData?.map(req => req.requirement) || [],
          outcomes: outcomesData?.map(outcome => outcome.outcome) || []
        } as ProfessionalCourse;
      }));
      
      return completeCourses;
    } catch (error) {
      console.error('Error in fetchCourses:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացների տվյալները բեռնելիս։');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new course in the database
   */
  const createCourse = async (course: Partial<ProfessionalCourse>): Promise<boolean> => {
    setLoading(true);
    try {
      // Determine if the course should be public based on user role
      const isPublic = user && (user.role === 'admin' || 
                               user.role === 'lecturer' || 
                               user.role === 'instructor') 
                       ? course.is_public
                       : false;

      // Insert the main course record
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: course.title,
          subtitle: course.subtitle,
          icon_name: course.iconName || 'book',
          duration: course.duration,
          price: course.price,
          button_text: course.buttonText,
          color: course.color,
          created_by: user?.name || course.createdBy,
          institution: course.institution,
          image_url: course.imageUrl,
          organization_logo: course.organizationLogo,
          description: course.description,
          is_public: isPublic
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating course:', error);
        toast.error('Սխալ է տեղի ունեցել դասընթաց ստեղծելիս։');
        return false;
      }
      
      const courseId = data.id;
      
      // Insert lessons if provided
      if (course.lessons && course.lessons.length > 0) {
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(
            course.lessons.map(lesson => ({
              course_id: courseId,
              title: lesson.title,
              duration: lesson.duration
            }))
          );
          
        if (lessonsError) {
          console.error('Error inserting lessons:', lessonsError);
        }
      }
      
      // Insert requirements if provided
      if (course.requirements && course.requirements.length > 0) {
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(
            course.requirements.map(requirement => ({
              course_id: courseId,
              requirement: requirement
            }))
          );
          
        if (requirementsError) {
          console.error('Error inserting requirements:', requirementsError);
        }
      }
      
      // Insert outcomes if provided
      if (course.outcomes && course.outcomes.length > 0) {
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            course.outcomes.map(outcome => ({
              course_id: courseId,
              outcome: outcome
            }))
          );
          
        if (outcomesError) {
          console.error('Error inserting outcomes:', outcomesError);
        }
      }
      
      toast.success('Դասընթացը հաջողությամբ ստեղծվել է։');
      
      // If the course couldn't be published, show a notification
      if (course.is_public && !isPublic) {
        toast.info('Դասընթացը հաջողությամբ ստեղծվել է, սակայն հրապարակման համար անհրաժեշտ է ադմինիստրատորի հաստատումը։');
      }
      
      return true;
    } catch (error) {
      console.error('Error in createCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթաց ստեղծելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a course in the database
   */
  const updateCourse = async (id: string, updates: Partial<ProfessionalCourse>): Promise<boolean> => {
    setLoading(true);
    try {
      // Determine if the user can publish the course
      let isPublic = updates.is_public;
      
      // If user is not admin or authorized role, they can't publish courses
      if (user && user.role !== 'admin' && 
          user.role !== 'lecturer' && 
          user.role !== 'instructor') {
        // Get current course state
        const { data: currentCourse } = await supabase
          .from('courses')
          .select('is_public, created_by')
          .eq('id', id)
          .single();
          
        // If the course is already public, keep it public
        // If not, it requires admin approval to be published
        isPublic = currentCourse?.is_public || false;
        
        // If the user tries to publish their own course, show a notification
        if (updates.is_public && !isPublic && currentCourse?.created_by === user.name) {
          toast.info('Դասընթացի հրապարակման համար անհրաժեշտ է ադմինիստրատորի հաստատումը։');
        }
      }

      // Update the main course record
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: updates.title,
          subtitle: updates.subtitle,
          icon_name: updates.iconName,
          duration: updates.duration,
          price: updates.price,
          button_text: updates.buttonText,
          color: updates.color,
          institution: updates.institution,
          image_url: updates.imageUrl,
          organization_logo: updates.organizationLogo,
          description: updates.description,
          is_public: isPublic,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (courseError) {
        console.error('Error updating course:', courseError);
        toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
        return false;
      }
      
      // Update lessons if provided
      if (updates.lessons && updates.lessons.length > 0) {
        // First delete existing lessons
        await supabase.from('course_lessons').delete().eq('course_id', id);
        
        // Then insert new lessons
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(
            updates.lessons.map(lesson => ({
              course_id: id,
              title: lesson.title,
              duration: lesson.duration
            }))
          );
          
        if (lessonsError) {
          console.error('Error updating lessons:', lessonsError);
        }
      }
      
      // Update requirements if provided
      if (updates.requirements && updates.requirements.length > 0) {
        // First delete existing requirements
        await supabase.from('course_requirements').delete().eq('course_id', id);
        
        // Then insert new requirements
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(
            updates.requirements.map(requirement => ({
              course_id: id,
              requirement: requirement
            }))
          );
          
        if (requirementsError) {
          console.error('Error updating requirements:', requirementsError);
        }
      }
      
      // Update outcomes if provided
      if (updates.outcomes && updates.outcomes.length > 0) {
        // First delete existing outcomes
        await supabase.from('course_outcomes').delete().eq('course_id', id);
        
        // Then insert new outcomes
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            updates.outcomes.map(outcome => ({
              course_id: id,
              outcome: outcome
            }))
          );
          
        if (outcomesError) {
          console.error('Error updating outcomes:', outcomesError);
        }
      }
      
      toast.success('Դասընթացը հաջողությամբ թարմացվել է։');
      return true;
    } catch (error) {
      console.error('Error in updateCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացը թարմացնելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a course from the database
   */
  const deleteCourse = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Check if user can delete this course
      if (user && user.role !== 'admin') {
        const { data: course } = await supabase
          .from('courses')
          .select('created_by')
          .eq('id', id)
          .single();
          
        if (course?.created_by !== user.name) {
          toast.error('Դուք չունեք այս դասընթացը ջնջելու իրավունք։');
          return false;
        }
      }
      
      // Delete related records first (they will cascade, but let's be explicit)
      await Promise.allSettled([
        supabase.from('course_lessons').delete().eq('course_id', id),
        supabase.from('course_requirements').delete().eq('course_id', id),
        supabase.from('course_outcomes').delete().eq('course_id', id)
      ]);
      
      // Delete the main course record
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Սխալ է տեղի ունեցել դասընթաց ջնջելիս։');
        return false;
      }
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է։');
      return true;
    } catch (error) {
      console.error('Error in deleteCourse:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթաց ջնջելիս։');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    loading
  };
};
