
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCourseUpdating } from './useCourseUpdating';
import { convertIconNameToComponent } from '@/utils/iconUtils';

export const useCourseEdit = (
  course: ProfessionalCourse | null,
  editedCourse: Partial<ProfessionalCourse>,
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>,
  setCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>,
  isEditMode: boolean
) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const { updateCourse } = useCourseUpdating(setLoading);

  const handleSaveChanges = async () => {
    if (!course || !editedCourse) {
      console.error('No course or edited course data available');
      return;
    }
    
    console.log('Saving changes:', editedCourse);
    setLoading(true);
    try {
      // Make sure is_public status is not undefined
      if (editedCourse.is_public === undefined) {
        editedCourse.is_public = course.is_public;
      }

      console.log('Updating course with data:', {
        id: course.id,
        updates: editedCourse
      });
      
      const success = await updateCourse(course.id, editedCourse);
      
      if (success) {
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsEditDialogOpen(false);
        
        // If in edit mode, navigate back to view mode
        if (isEditMode) {
          navigate(`/admin/course/${course.id}`);
        }
        
        // Update the local state with the edited values
        setCourse({
          ...course,
          ...editedCourse,
          icon: convertIconNameToComponent(editedCourse.iconName || course.iconName || 'book')
        });
        
        // Refetch the course to ensure we have the latest data
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', course.id)
          .single();
          
        if (!error && data) {
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
            
          const updatedCourse: ProfessionalCourse = {
            ...course,
            title: data.title,
            subtitle: data.subtitle,
            iconName: data.icon_name,
            icon: convertIconNameToComponent(data.icon_name),
            duration: data.duration,
            price: data.price,
            buttonText: data.button_text,
            color: data.color,
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
          
          setCourse(updatedCourse);
        }
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (e) {
      console.error('Error updating course:', e);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleSaveChanges,
    loading
  };
};
