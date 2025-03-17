
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

export const deleteCourse = async (course: ProfessionalCourse, onSuccess: () => void): Promise<void> => {
  if (!course) return;
  
  try {
    // Delete from localStorage
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const updatedCourses = courses.filter(c => c.id !== course.id);
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
    }
    
    // Delete from Supabase
    try {
      // Delete related data first
      await Promise.all([
        supabase.from('course_lessons').delete().eq('course_id', course.id),
        supabase.from('course_requirements').delete().eq('course_id', course.id),
        supabase.from('course_outcomes').delete().eq('course_id', course.id)
      ]);
      
      // Then delete the course itself
      await supabase.from('courses').delete().eq('id', course.id);
    } catch (supabaseError) {
      console.error('Error deleting from Supabase:', supabaseError);
      // If Supabase fails, we still continue since we removed from localStorage
    }
    
    toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    
    // Call the success callback (usually navigation)
    onSuccess();
  } catch (error) {
    console.error('Error deleting course:', error);
    toast.error('Սխալ դասընթացի ջնջման ժամանակ');
  }
};
