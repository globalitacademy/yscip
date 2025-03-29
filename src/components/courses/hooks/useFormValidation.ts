
import { useEffect, useState } from 'react';
import { ProfessionalCourse } from '../types';

/**
 * Custom hook to handle form validation for course creation
 */
export const useFormValidation = (
  professionalCourse: Partial<ProfessionalCourse> | null
) => {
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Validate form fields on every change
  useEffect(() => {
    if (professionalCourse) {
      const isValid = Boolean(
        professionalCourse.title && 
        professionalCourse.duration && 
        professionalCourse.price
      );
      setIsFormValid(isValid);
    } else {
      setIsFormValid(false);
    }
  }, [professionalCourse]);
  
  const validateCourse = (course: Partial<ProfessionalCourse>): boolean => {
    if (!course.title) {
      return false;
    }
    
    if (!course.duration) {
      return false;
    }
    
    if (!course.price) {
      return false;
    }
    
    return true;
  };

  return {
    isFormValid,
    validateCourse
  };
};
