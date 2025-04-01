
import React from 'react';
import { Course } from '../types';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

export const useCourseListActions = () => {
  // Try to use the context, but don't throw an error if it's not available
  const courseContext = React.useContext(React.createContext<any>(null));
  
  const handleEditCourse = (course: Course, onEditCourse?: (course: Course) => void) => {
    if (courseContext?.handleEditInit) {
      courseContext.handleEditInit(course);
    } else if (onEditCourse) {
      onEditCourse(course);
    }
  };
  
  const handleDeleteCourse = (course: Course, onDeleteCourse?: (course: Course) => void) => {
    if (courseContext?.handleOpenDeleteDialog) {
      courseContext.handleOpenDeleteDialog(course);
    } else if (onDeleteCourse) {
      onDeleteCourse(course);
    }
  };
  
  const handleEditProfessionalCourse = (
    course: ProfessionalCourse, 
    onEditProfessionalCourse?: (course: ProfessionalCourse) => void
  ) => {
    if (courseContext?.handleEditProfessionalCourseInit) {
      courseContext.handleEditProfessionalCourseInit(course);
    } else if (onEditProfessionalCourse) {
      onEditProfessionalCourse(course);
    }
  };
  
  const handleDeleteProfessionalCourse = (
    id: string, 
    onDeleteProfessionalCourse?: (id: string) => void
  ) => {
    if (courseContext?.handleDeleteProfessionalCourse) {
      courseContext.handleDeleteProfessionalCourse(id);
    } else if (onDeleteProfessionalCourse) {
      onDeleteProfessionalCourse(id);
    }
  };

  return {
    handleEditCourse,
    handleDeleteCourse,
    handleEditProfessionalCourse,
    handleDeleteProfessionalCourse
  };
};
