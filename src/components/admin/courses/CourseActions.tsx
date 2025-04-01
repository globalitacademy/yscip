
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CourseActionsProps {
  course: ProfessionalCourse;
  onStatusChange: (updatedCourse: ProfessionalCourse) => void;
  onDelete: (courseId: string) => void;
}

export const CourseActions: React.FC<CourseActionsProps> = ({
  course,
  onStatusChange,
  onDelete,
}) => {
  const toggleCoursePublishStatus = async () => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: !course.is_public })
        .eq('id', course.id);

      if (error) {
        console.error('Error toggling course status:', error);
        toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
        return;
      }

      const updatedCourse = { ...course, is_public: !course.is_public };
      onStatusChange(updatedCourse);

      toast.success(
        course.is_public
          ? 'Դասընթացը դարձել է անտեսանելի օգտագործողների համար'
          : 'Դասընթացը հաջողությամբ հրապարակվել է'
      );
    } catch (err) {
      console.error('Error toggling course status:', err);
      toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm(`Իսկապե՞ս ցանկանում եք ջնջել "${course.title}" դասընթացը:`)) {
      return;
    }

    try {
      await Promise.allSettled([
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
      
      onDelete(course.id);
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (err) {
      console.error('Error deleting course:', err);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="icon" asChild>
        <Link to={`/course/${course.id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" asChild>
        <Link to={`/admin/courses/${course.id}`}>
          <Edit className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleCoursePublishStatus}
      >
        {course.is_public ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={handleDeleteCourse}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
