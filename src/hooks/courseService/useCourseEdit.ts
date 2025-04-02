
import { useState, useEffect } from 'react';
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

  // When isEditDialogOpen or course changes, reset editedCourse to ensure we have latest data
  useEffect(() => {
    if (isEditDialogOpen && course) {
      // Make a deep copy to avoid reference issues
      setEditedCourse(JSON.parse(JSON.stringify(course)));
      console.log('Initialized editedCourse with current course data:', course);
    }
  }, [isEditDialogOpen, course, setEditedCourse]);

  // When in edit mode and course data is loaded, open dialog automatically
  useEffect(() => {
    if (isEditMode && course && !isEditDialogOpen) {
      setIsEditDialogOpen(true);
      console.log('Opening edit dialog in edit mode with course:', course);
    }
  }, [isEditMode, course, isEditDialogOpen, setIsEditDialogOpen]);

  const handleSaveChanges = async () => {
    if (!course || !editedCourse) {
      console.error('No course or edited course data available');
      toast.error('Դասընթացի տվյալները բացակայում են');
      return;
    }
    
    console.log('Saving changes with data:', editedCourse);
    setLoading(true);
    try {
      // Make sure is_public status is properly set
      if (editedCourse.is_public === undefined && course.is_public !== undefined) {
        editedCourse.is_public = course.is_public;
      }

      // Ensure we have all required fields from the original course if not in edited data
      const completeEditedCourse = {
        ...course,
        ...editedCourse,
      };

      console.log('Updating course with complete data:', {
        id: course.id,
        updates: completeEditedCourse
      });
      
      const success = await updateCourse(course.id, completeEditedCourse);
      
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
          ...completeEditedCourse,
          icon: convertIconNameToComponent(completeEditedCourse.iconName || course.iconName || 'book')
        });
        
        // Refetch the course to ensure we have the latest data
        console.log('Refetching course data after update');
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', course.id)
          .single();
          
        if (!error && data) {
          console.log('Successfully refetched course main data:', data);
          
          // Fetch related data in parallel
          const [lessonsData, requirementsData, outcomesData] = await Promise.all([
            supabase.from('course_lessons').select('*').eq('course_id', course.id),
            supabase.from('course_requirements').select('*').eq('course_id', course.id),
            supabase.from('course_outcomes').select('*').eq('course_id', course.id)
          ]);
            
          console.log('Fetched related data:', {
            lessons: lessonsData.data,
            requirements: requirementsData.data,
            outcomes: outcomesData.data
          });
          
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
            lessons: lessonsData?.data?.map(lesson => ({
              title: lesson.title,
              duration: lesson.duration
            })) || [],
            requirements: requirementsData?.data?.map(req => req.requirement) || [],
            outcomes: outcomesData?.data?.map(outcome => outcome.outcome) || [],
            slug: data.slug
          };
          
          console.log('Setting updated course with complete data:', updatedCourse);
          setCourse(updatedCourse);
          setEditedCourse(JSON.parse(JSON.stringify(updatedCourse))); // Deep copy
        } else {
          console.error('Error refetching course:', error);
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
