
import { ProfessionalCourse } from '../../types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const getCourseById = async (id: string): Promise<ProfessionalCourse | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching course by ID:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', id);
      
    const { data: requirementsData } = await supabase
      .from('course_requirements')
      .select('*')
      .eq('course_id', id);
      
    const { data: outcomesData } = await supabase
      .from('course_outcomes')
      .select('*')
      .eq('course_id', id);
    
    const iconElement = convertIconNameToComponent(data.icon_name);
    
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      icon: iconElement,
      iconName: data.icon_name,
      duration: data.duration,
      price: data.price,
      buttonText: data.button_text,
      color: data.color,
      createdBy: data.created_by,
      institution: data.institution,
      imageUrl: data.image_url,
      organizationLogo: data.organization_logo,
      description: data.description,
      is_public: data.is_public,
      lessons: lessonsData?.map(lesson => ({
        title: lesson.title,
        duration: lesson.duration
      })) || [],
      requirements: requirementsData?.map(req => req.requirement) || [],
      outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
      slug: data.slug
    };
  } catch (e) {
    console.error('Error fetching course by ID:', e);
    return null;
  }
};
