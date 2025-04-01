
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';

/**
 * Update course directly in the database
 */
export const updateCourseDirectly = async (
  courseId: string, 
  courseData: Partial<ProfessionalCourse>
): Promise<boolean> => {
  try {
    // Update the main course record
    const { error: courseError } = await supabase
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
      .eq('id', courseId);
      
    if (courseError) {
      console.error('Error updating course:', courseError);
      return false;
    }
    
    // Update lessons if provided
    if (courseData.lessons && courseData.lessons.length > 0) {
      // First delete existing lessons
      await supabase.from('course_lessons').delete().eq('course_id', courseId);
      
      // Then insert new lessons
      const { error: lessonsError } = await supabase
        .from('course_lessons')
        .insert(
          courseData.lessons.map(lesson => ({
            course_id: courseId,
            title: lesson.title,
            duration: lesson.duration
          }))
        );
        
      if (lessonsError) {
        console.error('Error updating lessons:', lessonsError);
      }
    }
    
    // Update requirements if provided
    if (courseData.requirements && courseData.requirements.length > 0) {
      // First delete existing requirements
      await supabase.from('course_requirements').delete().eq('course_id', courseId);
      
      // Then insert new requirements
      const { error: requirementsError } = await supabase
        .from('course_requirements')
        .insert(
          courseData.requirements.map(requirement => ({
            course_id: courseId,
            requirement: requirement
          }))
        );
        
      if (requirementsError) {
        console.error('Error updating requirements:', requirementsError);
      }
    }
    
    // Update outcomes if provided
    if (courseData.outcomes && courseData.outcomes.length > 0) {
      // First delete existing outcomes
      await supabase.from('course_outcomes').delete().eq('course_id', courseId);
      
      // Then insert new outcomes
      const { error: outcomesError } = await supabase
        .from('course_outcomes')
        .insert(
          courseData.outcomes.map(outcome => ({
            course_id: courseId,
            outcome: outcome
          }))
        );
        
      if (outcomesError) {
        console.error('Error updating outcomes:', outcomesError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating course:', error);
    return false;
  }
};

/**
 * Get all courses from the database including non-public ones (for admin view)
 */
export const getAllCoursesForAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching all courses:', error);
      toast.error('Սխալ է տեղի ունեցել դասընթացների բեռնման ժամանակ');
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('No courses found in database');
      return [];
    }
    
    // Process each course to include related data
    const completeCourses = await Promise.all(data.map(async (course) => {
      // Fetch lessons, requirements, and outcomes in parallel
      const [lessonsResponse, requirementsResponse, outcomesResponse] = await Promise.all([
        supabase.from('course_lessons').select('*').eq('course_id', course.id),
        supabase.from('course_requirements').select('*').eq('course_id', course.id),
        supabase.from('course_outcomes').select('*').eq('course_id', course.id)
      ]);
      
      // Create icon component
      const iconElement = convertIconNameToComponent(course.icon_name);
      
      return {
        id: course.id,
        title: course.title,
        subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon: iconElement,
        iconName: course.icon_name,
        duration: course.duration,
        price: course.price,
        buttonText: course.button_text || 'Դիտել',
        color: course.color || 'text-amber-500',
        createdBy: course.created_by || '',
        institution: course.institution || 'ՀՊՏՀ',
        imageUrl: course.image_url,
        organizationLogo: course.organization_logo,
        description: course.description || '',
        is_public: course.is_public || false,
        lessons: lessonsResponse.data?.map(lesson => ({
          title: lesson.title, 
          duration: lesson.duration
        })) || [],
        requirements: requirementsResponse.data?.map(req => req.requirement) || [],
        outcomes: outcomesResponse.data?.map(outcome => outcome.outcome) || [],
        slug: course.slug || '',
        createdAt: course.created_at
      };
    }));
    
    console.log(`Found ${completeCourses.length} courses in database`);
    return completeCourses;
  } catch (error) {
    console.error('Error fetching all courses for admin:', error);
    toast.error('Սխալ է տեղի ունեցել դասընթացների բեռնման ժամանակ');
    return [];
  }
};
