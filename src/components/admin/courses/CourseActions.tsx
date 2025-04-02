
import React, { useState } from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Pencil, Trash2, GlobeLock, Globe, AlertCircle, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Check if user can modify this course
  const canModify = user && (
    user.role === 'admin' || 
    course.createdBy === user.id || 
    course.createdBy === user.name
  );

  const handleStatusToggle = async () => {
    if (!canModify) {
      toast.error("Դուք չունեք իրավունք փոխելու այս դասընթացի կարգավիճակը");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: !course.is_public })
        .eq('id', course.id);

      if (error) {
        console.error('Error updating course status:', error);
        toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
        return;
      }

      // Update local state
      const updatedCourse = { ...course, is_public: !course.is_public };
      onStatusChange(updatedCourse);
      
      toast.success(
        course.is_public 
          ? 'Դասընթացը հանվել է հրապարակումից' 
          : 'Դասընթացը հաջողությամբ հրապարակվել է'
      );
    } catch (error) {
      console.error('Error toggling course status:', error);
      toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!canModify) {
      toast.error("Դուք չունեք իրավունք ջնջելու այս դասընթացը");
      return;
    }
    
    setIsLoading(true);
    try {
      // First delete related data
      await Promise.all([
        supabase.from('course_lessons').delete().eq('course_id', course.id),
        supabase.from('course_requirements').delete().eq('course_id', course.id),
        supabase.from('course_outcomes').delete().eq('course_id', course.id)
      ]);

      // Then delete the course
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);

      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
        return;
      }

      // Update parent component state
      onDelete(course.id);
      setIsDeleteDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Գործողություններ</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/admin/courses/${course.id}`} className="cursor-pointer">
              <Eye className="h-4 w-4 mr-2" />
              Դիտել
            </Link>
          </DropdownMenuItem>
          
          {canModify && (
            <>
              <DropdownMenuItem asChild>
                <Link to={`/admin/courses/${course.id}/edit`} className="cursor-pointer">
                  <Pencil className="h-4 w-4 mr-2" />
                  Խմբագրել
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={handleStatusToggle} disabled={isLoading}>
                {course.is_public ? (
                  <>
                    <GlobeLock className="h-4 w-4 mr-2" />
                    Հանել հրապարակումից
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Հրապարակել
                  </>
                )}
                {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Ջնջել
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Հաստատեք ջնջումը
            </AlertDialogTitle>
            <AlertDialogDescription>
              Դուք պատրաստվում եք ջնջել "{course.title}" դասընթացը։ Այս գործողությունը անդառնալի է։
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Չեղարկել</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDeleteCourse();
              }}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ջնջում...
                </>
              ) : (
                'Ջնջել'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
