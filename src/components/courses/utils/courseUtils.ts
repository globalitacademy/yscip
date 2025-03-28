
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';
import { convertIconNameToComponent } from '@/utils/iconUtils';

// Define the event name as a constant
export const COURSE_UPDATED_EVENT = 'courseUpdated';

export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    console.log('Fetching course with ID:', id);
    
    // Fetch from Supabase
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching course from Supabase:', error);
      toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
      return null;
    }

    if (!course) {
      console.log('Course not found in Supabase');
      toast.error('Դասընթացը չի գտնվել');
      return null;
    }

    let lessons = [], requirements = [], outcomes = [];
    
    try {
      const { data: lessonsData } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', id);
        
      if (lessonsData) lessons = lessonsData;
    } catch (e) {
      console.error('Error fetching lessons:', e);
    }
    
    try {
      const { data: requirementsData } = await supabase
        .from('course_requirements')
        .select('*')
        .eq('course_id', id);
        
      if (requirementsData) requirements = requirementsData;
    } catch (e) {
      console.error('Error fetching requirements:', e);
    }
    
    try {
      const { data: outcomesData } = await supabase
        .from('course_outcomes')
        .select('*')
        .eq('course_id', id);
        
      if (outcomesData) outcomes = outcomesData;
    } catch (e) {
      console.error('Error fetching outcomes:', e);
    }

    // Create a proper React element for the icon
    const iconElement = convertIconNameToComponent(course.icon_name);

    const formattedCourse: ProfessionalCourse = {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      icon: iconElement,
      iconName: course.icon_name,
      duration: course.duration,
      price: course.price,
      buttonText: course.button_text || "Մանրամասն",
      color: course.color,
      createdBy: course.created_by || "",
      institution: course.institution || "",
      imageUrl: course.image_url,
      organizationLogo: course.organization_logo,
      description: course.description || "",
      lessons: lessons?.map(lesson => ({
        title: lesson.title, 
        duration: lesson.duration
      })) || [],
      requirements: requirements?.map(req => req.requirement) || [],
      outcomes: outcomes?.map(outcome => outcome.outcome) || [],
      is_public: course.is_public || false,
      show_on_homepage: course.show_on_homepage || false,
      display_order: course.display_order || 0,
      slug: course.slug || course.id
    };

    return formattedCourse;
  } catch (error) {
    console.error('Error in getCourseById:', error);
    toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
    return null;
  }
};

export const getAllCoursesFromSupabase = async (): Promise<ProfessionalCourse[]> => {
  try {
    console.log('Fetching all courses from Supabase');
    const { data, error } = await supabase
      .from('courses')
      .select('*');
      
    if (error) {
      console.error('Error fetching courses from Supabase:', error);
      toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log('No courses found in Supabase');
      return [];
    }
    
    // Process each course to format it properly
    const formattedCourses: ProfessionalCourse[] = await Promise.all(data.map(async (course) => {
      // Fetch related data for each course
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
        buttonText: course.button_text || "Մանրամասն",
        color: course.color,
        createdBy: course.created_by || "",
        institution: course.institution || "",
        imageUrl: course.image_url,
        organizationLogo: course.organization_logo,
        description: course.description || "",
        lessons: lessonsData?.map(lesson => ({
          title: lesson.title, 
          duration: lesson.duration
        })) || [],
        requirements: requirementsData?.map(req => req.requirement) || [],
        outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
        is_public: course.is_public || false,
        show_on_homepage: course.show_on_homepage || false,
        display_order: course.display_order || 0,
        slug: course.slug || course.id
      };
    }));
    
    return formattedCourses;
  } catch (error) {
    console.error('Error fetching all courses from Supabase:', error);
    toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
    return [];
  }
};

export const saveCourseChanges = async (course: ProfessionalCourse): Promise<boolean> => {
  try {
    if (!course) return false;

    console.log('Saving course changes to Supabase:', course);

    // Extract the icon name from the course object or from the iconName property
    const iconName = course.iconName || getIconNameFromElement(course.icon);

    // Save to Supabase
    try {
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: course.title,
          subtitle: course.subtitle,
          icon_name: iconName,
          duration: course.duration,
          price: course.price,
          button_text: course.buttonText,
          color: course.color,
          created_by: course.createdBy,
          institution: course.institution,
          image_url: course.imageUrl,
          organization_logo: course.organizationLogo,
          description: course.description,
          is_public: course.is_public,
          show_on_homepage: course.show_on_homepage || false,
          display_order: course.display_order || 0,
          slug: course.slug || course.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id);

      if (courseError) {
        console.error('Error updating course in Supabase:', courseError);
        // Try to check if course exists
        const { data: existingCourse, error: checkError } = await supabase
          .from('courses')
          .select('id')
          .eq('id', course.id)
          .maybeSingle();
          
        if (checkError || !existingCourse) {
          // Course does not exist, let's create it
          const { error: insertError } = await supabase
            .from('courses')
            .insert({
              id: course.id,
              title: course.title,
              subtitle: course.subtitle,
              icon_name: iconName,
              duration: course.duration,
              price: course.price,
              button_text: course.buttonText,
              color: course.color,
              created_by: course.createdBy,
              institution: course.institution,
              image_url: course.imageUrl,
              organization_logo: course.organizationLogo,
              description: course.description,
              is_public: course.is_public,
              show_on_homepage: course.show_on_homepage || false,
              display_order: course.display_order || 0,
              slug: course.slug || course.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (insertError) {
            console.error('Error inserting course in Supabase:', insertError);
            toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
            return false;
          }
        } else {
          toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
          return false;
        }
      } else {
        // If course update was successful, also update related tables
        if (course.lessons && course.lessons.length > 0) {
          // First delete existing lessons
          await supabase.from('course_lessons').delete().eq('course_id', course.id);
          
          // Then insert new lessons
          const { error: lessonsError } = await supabase
            .from('course_lessons')
            .insert(
              course.lessons.map(lesson => ({
                course_id: course.id,
                title: lesson.title,
                duration: lesson.duration
              }))
            );

          if (lessonsError) {
            console.error('Error inserting lessons:', lessonsError);
          }
        }

        if (course.requirements && course.requirements.length > 0) {
          // First delete existing requirements
          await supabase.from('course_requirements').delete().eq('course_id', course.id);
          
          // Then insert new requirements
          const { error: requirementsError } = await supabase
            .from('course_requirements')
            .insert(
              course.requirements.map(requirement => ({
                course_id: course.id,
                requirement: requirement
              }))
            );

          if (requirementsError) {
            console.error('Error inserting requirements:', requirementsError);
          }
        }

        if (course.outcomes && course.outcomes.length > 0) {
          // First delete existing outcomes
          await supabase.from('course_outcomes').delete().eq('course_id', course.id);
          
          // Then insert new outcomes
          const { error: outcomesError } = await supabase
            .from('course_outcomes')
            .insert(
              course.outcomes.map(outcome => ({
                course_id: course.id,
                outcome: outcome
              }))
            );

          if (outcomesError) {
            console.error('Error inserting outcomes:', outcomesError);
          }
        }
      }
    } catch (supabaseError) {
      console.error('Error with Supabase operations:', supabaseError);
      toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
      return false;
    }

    // Notify any listeners about the course change with a custom event
    const event = new CustomEvent(COURSE_UPDATED_EVENT, { detail: course });
    window.dispatchEvent(event);
    
    toast.success('Դասընթացը հաջողությամբ պահպանվել է');
    return true;
  } catch (error) {
    console.error('Error saving course changes:', error);
    toast.error('Դասընթացի պահպանման ժամանակ սխալ է տեղի ունեցել');
    return false;
  }
};

// Helper function to extract icon name from React element
const getIconNameFromElement = (iconElement: React.ReactElement): string => {
  if (!iconElement) return 'book';
  
  const iconType = iconElement.type;
  
  // Check if iconType is a function (component) and access properties safely
  if (typeof iconType === 'function') {
    // Try to get displayName or name from the function component
    // Use type assertion to help TypeScript understand this is a function component
    const component = iconType as React.FC;
    const iconName = component.displayName || component.name;
    if (iconName) {
      return iconName.toLowerCase();
    }
  } else if (typeof iconType === 'string') {
    // If it's a string (HTML element), use that
    return iconType.toLowerCase();
  }
  
  // Default fallback
  return 'book';
};

export const syncCoursesToSupabase = async (): Promise<void> => {
  try {
    toast.info('Համաժամեցում բազայի հետ...');
    
    // Get all courses from Supabase again to refresh local data
    await getAllCoursesFromSupabase();
    
    toast.success('Դասընթացները հաջողությամբ համաժամեցվել են բազայի հետ');
  } catch (error) {
    console.error('Error syncing courses to Supabase:', error);
    toast.error('Դասընթացների համաժամեցման ժամանակ սխալ է տեղի ունեցել');
  }
};
