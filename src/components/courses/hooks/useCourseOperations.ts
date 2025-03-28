
import { useCallback } from 'react';
import { Course, ProfessionalCourse } from '../types';
import { useStandardCourseOperations } from './useStandardCourseOperations';
import { useProfessionalCourseOperations } from './useProfessionalCourseOperations';

export const useCourseOperations = (
  courses: Course[],
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
  professionalCourses: ProfessionalCourse[],
  setProfessionalCourses: React.Dispatch<React.SetStateAction<ProfessionalCourse[]>>,
  setIsAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setNewProfessionalCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>,
  newProfessionalCourse: Partial<ProfessionalCourse>
) => {
  // Get standard course operations
  const standardCourseOps = useStandardCourseOperations(
    courses,
    setCourses,
    setIsAddDialogOpen,
    setIsEditDialogOpen
  );

  // Get professional course operations
  const professionalCourseOps = useProfessionalCourseOperations(
    professionalCourses,
    setProfessionalCourses,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setNewProfessionalCourse,
    newProfessionalCourse
  );

  // Generic update function that routes to the appropriate handler
  const handleUpdateCourse = useCallback(async (id: string, courseData: Partial<Course | ProfessionalCourse>) => {
    if (!id || !courseData) {
      return false;
    }
    
    console.log("Updating course with ID:", id, "and data:", courseData);
    
    // Check if this is a standard or professional course
    const isStandard = courses.some(course => course.id === id);
    const isProfessional = professionalCourses.some(course => course.id === id);
    
    if (isStandard) {
      return standardCourseOps.handleUpdateStandardCourse(id, courseData as Partial<Course>);
    } 
    else if (isProfessional) {
      return professionalCourseOps.handleUpdateProfessionalCourse(id, courseData as Partial<ProfessionalCourse>);
    } else {
      return false;
    }
  }, [courses, professionalCourses, standardCourseOps, professionalCourseOps]);

  return {
    handleAddCourse: standardCourseOps.handleAddCourse,
    handleAddProfessionalCourse: professionalCourseOps.handleAddProfessionalCourse,
    handleUpdateCourse,
    handleUpdateProfessionalCourse: professionalCourseOps.handleUpdateProfessionalCourse,
    handleDeleteCourse: standardCourseOps.handleDeleteCourse,
    handleDeleteProfessionalCourse: professionalCourseOps.handleDeleteProfessionalCourse
  };
};
