
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CourseDetailContent from './course-detail/CourseDetailContent';
import CourseEditDialog from './course-detail/CourseEditDialog';
import CourseDeleteDialog from './course-detail/CourseDeleteDialog';
import { useCourseUpdating } from '@/hooks/courseService/useCourseUpdating';

interface CourseDetailPageProps {
  id?: string;
  isEditMode?: boolean;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ id, isEditMode = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState<'delete' | 'status' | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Partial<ProfessionalCourse>>({});
  
  const { updateCourse } = useCourseUpdating(setLoading);

  // Automatically open edit dialog if in edit mode
  useEffect(() => {
    if (isEditMode && course && !isEditDialogOpen) {
      setIsEditDialogOpen(true);
    }
  }, [isEditMode, course, isEditDialogOpen]);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        console.log('Fetching course with ID:', id);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching course:', error);
          toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
          return;
        }
        
        if (!data) {
          toast.error('Դասընթացը չի գտնվել');
          navigate('/admin/courses');
          return;
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
        
        const professionalCourse: ProfessionalCourse = {
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
        
        setCourse(professionalCourse);
        setEditedCourse(professionalCourse);
        console.log('Fetched course:', professionalCourse);
      } catch (e) {
        console.error('Error fetching course details:', e);
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
    
    if (id) {
      const channel = supabase
        .channel('course-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'courses',
            filter: `id=eq.${id}`
          },
          () => {
            fetchCourse();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id, navigate]);

  const handleSaveChanges = async () => {
    if (!course || !editedCourse) {
      console.error('No course or edited course data available');
      return;
    }
    
    console.log('Saving changes:', editedCourse);
    setLoading(true);
    setActionType('status');
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
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (e) {
      console.error('Error updating course:', e);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) return;
    
    setLoading(true);
    setActionType('delete');
    try {
      await Promise.all([
        supabase.from('course_lessons').delete().eq('course_id', course.id),
        supabase.from('course_requirements').delete().eq('course_id', course.id),
        supabase.from('course_outcomes').delete().eq('course_id', course.id)
      ]);
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
      navigate('/admin/courses');
    } catch (e) {
      console.error('Error deleting course:', e);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
      setActionType(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!course) return;
    
    setLoading(true);
    setActionType('status');
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: !course.is_public })
        .eq('id', course.id);
        
      if (error) {
        console.error('Error toggling publish status:', error);
        toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      setCourse({
        ...course,
        is_public: !course.is_public
      });
      
      toast.success(course.is_public ? 
        'Դասընթացը հանվել է հրապարակումից' : 
        'Դասընթացը հաջողությամբ հրապարակվել է'
      );
    } catch (e) {
      console.error('Error toggling publish status:', e);
      toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);

  if (loading && !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p>Դասընթացի բեռնում...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Դասընթացը չի գտնվել</h1>
          <p className="mb-6 text-muted-foreground">Հնարավոր է այն ջնջվել է կամ հասանելի չէ</p>
          <Button onClick={() => navigate('/admin/courses')}>Վերադառնալ դասընթացների էջ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseDetailContent 
        course={course}
        canEdit={canEdit}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handlePublishToggle={handlePublishToggle}
        loading={loading}
        actionType={actionType}
      />
      
      <CourseEditDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={(open) => {
          setIsEditDialogOpen(open);
          // If closing dialog in edit mode, navigate back to view mode
          if (!open && isEditMode) {
            navigate(`/admin/course/${course.id}`);
          }
        }}
        editedCourse={editedCourse}
        setEditedCourse={setEditedCourse}
        handleSaveChanges={handleSaveChanges}
        loading={loading}
      />
      
      <CourseDeleteDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDeleteCourse={handleDeleteCourse}
        loading={loading}
      />
    </div>
  );
};

export default CourseDetailPage;
