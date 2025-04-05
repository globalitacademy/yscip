
import { ProfessionalCourse } from '../../types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const getCourseBySlug = async (slug: string): Promise<ProfessionalCourse | null> => {
  try {
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid course slug provided:', slug);
      return null;
    }
    
    console.log("Փորձում ենք գտնել դասընթացը հետևյալ slug-ով:", slug);
    
    // Նախ փորձենք slug-ով գտնել
    let { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching course by slug:', error);
      return null;
    }
    
    // Եթե slug-ով չգտնվեց և slug-ը նման է UUID-ի, փորձենք ID-ով գտնել
    if (!data && slug.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      console.log("Slug-ը նման է UUID-ի, փորձում ենք որպես ID օգտագործել:", slug);
      const { data: dataById, error: errorById } = await supabase
        .from('courses')
        .select('*')
        .eq('id', slug)
        .maybeSingle();
        
      if (errorById) {
        console.error('Error fetching course by ID:', errorById);
        return null;
      }
      
      data = dataById;
    }
    
    // Եթե դեռ չենք գտել դասընթացը, վերադարձնենք null
    if (!data) {
      console.log('Դասընթացը չգտնվեց ոչ slug-ով, ոչ էլ ID-ով:', slug);
      return null;
    }
    
    // Ստացանք դասընթացի տվյալները, հիմա լրացուցիչ տվյալներ ենք ստանում
    const { data: lessonsData } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', data.id);
      
    const { data: requirementsData } = await supabase
      .from('course_requirements')
      .select('*')
      .eq('course_id', data.id);
      
    const { data: outcomesData } = await supabase
      .from('course_outcomes')
      .select('*')
      .eq('course_id', data.id);
    
    // Ստանում ենք icon component
    const iconElement = convertIconNameToComponent(data.icon_name);
    
    console.log("Դասընթացը հաջողությամբ գտնվեց:", data.title);
    
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle || 'ԴԱՍԸՆԹԱՑ',
      icon: iconElement,
      iconName: data.icon_name,
      duration: data.duration,
      price: data.price,
      buttonText: data.button_text || 'Դիտել',
      color: data.color || 'text-amber-500',
      createdBy: data.created_by || '',
      institution: data.institution || 'ՀՊՏՀ',
      imageUrl: data.image_url,
      organizationLogo: data.organization_logo,
      description: data.description || '',
      is_public: data.is_public || false,
      lessons: lessonsData?.map(lesson => ({
        title: lesson.title,
        duration: lesson.duration
      })) || [],
      requirements: requirementsData?.map(req => req.requirement) || [],
      outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
      slug: data.slug || ''
    };
  } catch (e) {
    console.error('Error fetching course by slug:', e);
    return null;
  }
};
