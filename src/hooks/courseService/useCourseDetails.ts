
import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse, CourseInstructor } from '@/components/courses/types/ProfessionalCourse';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const useCourseDetails = (initialId?: string) => {
  const { id: routeId } = useParams<{ id: string }>();
  const courseId = initialId || routeId;
  
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCourse = useCallback(async () => {
    if (!courseId) {
      setError('No course ID provided');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching course with ID: ${courseId}`);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) {
        console.error('Error fetching course:', error);
        setError(`Failed to fetch course: ${error.message}`);
        setLoading(false);
        return;
      }
      
      if (!data) {
        setError('Course not found');
        setLoading(false);
        return;
      }
      
      console.log('Fetched course data:', data);
      
      // Fetch related data in parallel
      const [
        lessonsResult, 
        requirementsResult, 
        outcomesResult,
        instructorsResult
      ] = await Promise.all([
        supabase.from('course_lessons').select('*').eq('course_id', courseId),
        supabase.from('course_requirements').select('*').eq('course_id', courseId),
        supabase.from('course_outcomes').select('*').eq('course_id', courseId),
        supabase.from('course_instructors').select('*').eq('course_id', courseId)
      ]);
      
      // Parse lessons
      const lessons = lessonsResult.data?.map(lesson => ({
        title: lesson.title,
        duration: lesson.duration
      })) || [];
      
      // Parse requirements
      const requirements = requirementsResult.data?.map(req => req.requirement) || [];
      
      // Parse outcomes
      const outcomes = outcomesResult.data?.map(outcome => outcome.outcome) || [];
      
      // Parse instructors
      const instructors = instructorsResult.data?.map(instructor => ({
        id: instructor.id,
        name: instructor.name,
        title: instructor.title,
        bio: instructor.bio,
        avatar_url: instructor.avatar_url,
        course_id: instructor.course_id,
        created_at: instructor.created_at,
        updated_at: instructor.updated_at
      })) || [];
      
      // Create the course object with careful handling of optional fields
      const professionalCourse: ProfessionalCourse = {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle || 'ԴԱՍԸՆԹԱՑ',
        iconName: data.icon_name,
        icon: convertIconNameToComponent(data.icon_name),
        duration: data.duration,
        price: data.price,
        buttonText: data.button_text || 'Դիտել',
        color: data.color || 'text-amber-500',
        institution: data.institution || '',
        imageUrl: data.image_url,
        organizationLogo: data.organization_logo,
        description: data.description || '',
        createdBy: data.created_by || '',
        instructor: data.instructor || '',
        lessons,
        requirements,
        outcomes,
        instructors,
        is_public: data.is_public,
        show_on_homepage: data.show_on_homepage,
        display_order: data.display_order,
        category: (data as any).category, // Use type assertion for optional fields
        learning_formats: (data as any).learning_formats as string[] | undefined,
        languages: (data as any).languages as string[] | undefined,
        author_type: (data as any).author_type as 'lecturer' | 'institution' | undefined,
        instructor_ids: (data as any).instructor_ids,
        syllabus_file: (data as any).syllabus_file as string | undefined,
        resources: (data as any).resources,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      
      setCourse(professionalCourse);
    } catch (err) {
      console.error('Error in fetchCourse:', err);
      setError(`An unexpected error occurred: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [courseId]);
  
  // Fetch course data on mount
  if (!course && !loading && !error) {
    fetchCourse();
  }
  
  return { course, setCourse, loading, error, fetchCourse };
};
