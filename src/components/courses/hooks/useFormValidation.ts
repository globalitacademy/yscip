
import { useEffect, useState } from 'react';
import { ProfessionalCourse } from '../types';
import { validateRequiredField, validateSlug, validateUrl } from '@/utils/validation';

/**
 * Custom hook to handle comprehensive form validation for course creation
 */
export const useFormValidation = (
  professionalCourse: Partial<ProfessionalCourse> | null
) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Validate form fields on every change
  useEffect(() => {
    if (professionalCourse) {
      // Initialize errors object
      const errors: Record<string, string> = {};
      
      // Required fields validation
      if (!validateRequiredField(professionalCourse.title)) {
        errors.title = 'Վերնագիրը պարտադիր է';
      }
      
      if (!validateRequiredField(professionalCourse.duration)) {
        errors.duration = 'Տևողությունը պարտադիր է';
      }
      
      if (!validateRequiredField(professionalCourse.price)) {
        errors.price = 'Արժեքը պարտադիր է';
      }

      if (!validateRequiredField(professionalCourse.institution)) {
        errors.institution = 'Հաստատությունը պարտադիր է';
      }
      
      // URL validations
      if (professionalCourse.imageUrl && !validateUrl(professionalCourse.imageUrl)) {
        errors.imageUrl = 'Նկարի հղումը վավեր չէ';
      }
      
      if (professionalCourse.organizationLogo && !validateUrl(professionalCourse.organizationLogo)) {
        errors.organizationLogo = 'Լոգոյի հղումը վավեր չէ';
      }
      
      // Slug validation for friendly URLs
      if (professionalCourse.slug && !validateSlug(professionalCourse.slug)) {
        errors.slug = 'Slug-ը պետք է պարունակի միայն տառեր, թվեր և հանած գծիկներ';
      }
      
      // Content validations
      if (professionalCourse.lessons && professionalCourse.lessons.length > 0) {
        const invalidLessons = professionalCourse.lessons.filter(
          lesson => !lesson.title || !lesson.duration
        );
        
        if (invalidLessons.length > 0) {
          errors.lessons = 'Բոլոր դասերը պետք է ունենան վերնագիր և տևողություն';
        }
      }
      
      // Update errors state
      setValidationErrors(errors);
      
      // Form is valid if there are no errors
      setIsFormValid(Object.keys(errors).length === 0);
    } else {
      setIsFormValid(false);
      setValidationErrors({});
    }
  }, [professionalCourse]);
  
  const validateCourse = (course: Partial<ProfessionalCourse>): boolean => {
    // Basic required fields validation
    if (!course.title || !course.duration || !course.price || !course.institution) {
      return false;
    }
    
    // URL validations
    if (course.imageUrl && !validateUrl(course.imageUrl)) {
      return false;
    }
    
    if (course.organizationLogo && !validateUrl(course.organizationLogo)) {
      return false;
    }
    
    // Lessons validation - ensure all lessons have title and duration
    if (course.lessons && course.lessons.length > 0) {
      const hasInvalidLessons = course.lessons.some(
        lesson => !lesson.title || !lesson.duration
      );
      
      if (hasInvalidLessons) {
        return false;
      }
    }
    
    return true;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return validationErrors[fieldName];
  };

  return {
    isFormValid,
    validateCourse,
    validationErrors,
    getFieldError
  };
};
