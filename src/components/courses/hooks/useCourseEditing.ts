
import { useCallback } from 'react';
import { Course, ProfessionalCourse } from '../types';
import { toast } from 'sonner';

export const useCourseEditing = (
  courses: Course[],
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
  selectedCourse: Course | null,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedProfessionalCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>
) => {
  const handleEditCourse = useCallback(() => {
    if (!selectedCourse) return;
    
    if (!selectedCourse.title || !selectedCourse.description || !selectedCourse.duration) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id ? selectedCourse : course
    );
    
    setCourses(updatedCourses);
    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    setIsEditDialogOpen(false);
    toast.success('Կուրսը հաջողությամբ թարմացվել է');
  }, [selectedCourse, courses, setCourses, setIsEditDialogOpen]);

  const handleEditInit = useCallback((course: Course) => {
    setSelectedCourse({...course});
    setIsEditDialogOpen(true);
  }, [setSelectedCourse, setIsEditDialogOpen]);

  const handleEditProfessionalCourseInit = useCallback((course: ProfessionalCourse) => {
    setSelectedProfessionalCourse({...course});
    setIsEditDialogOpen(true);
  }, [setSelectedProfessionalCourse, setIsEditDialogOpen]);

  return {
    handleEditCourse,
    handleEditInit,
    handleEditProfessionalCourseInit
  };
};
