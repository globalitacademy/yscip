
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from '../types';
import { createCourseDirectly, generateSlug } from '../utils/courseSubmission';

interface UseCourseFormSubmissionProps {
  professionalCourse: Partial<ProfessionalCourse> | null;
  handleCreateProfessionalCourse: (course: Omit<ProfessionalCourse, 'id' | 'createdAt'>) => Promise<boolean>;
  validateCourse: (course: Partial<ProfessionalCourse>) => boolean;
  user: { name?: string } | null;
  isAuthenticated: boolean;
}

export const useCourseFormSubmission = ({
  professionalCourse,
  handleCreateProfessionalCourse,
  validateCourse,
  user,
  isAuthenticated
}: UseCourseFormSubmissionProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      console.log("Creating professional course, user:", user);

      if (!isAuthenticated || !user) {
        toast.error("Դուք պետք է մուտք գործեք համակարգ դասընթաց ստեղծելու համար");
        return false;
      }

      if (!professionalCourse || !validateCourse(professionalCourse)) {
        return false;
      }
      
      // At this point, we know professionalCourse has title, duration and price since validateCourse passed
      // Create a complete object with all required properties for ProfessionalCourse
      const courseToSubmit: Omit<ProfessionalCourse, 'id' | 'createdAt'> = {
        title: professionalCourse.title!,
        subtitle: professionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
        icon: professionalCourse.icon!,
        iconName: professionalCourse.iconName || 'book',
        duration: professionalCourse.duration!,
        price: professionalCourse.price!,
        buttonText: professionalCourse.buttonText || 'Դիտել',
        color: professionalCourse.color || 'text-amber-500',
        createdBy: user?.name || 'Unknown',
        institution: professionalCourse.institution || 'ՀՊՏՀ',
        description: professionalCourse.description || '',
        imageUrl: professionalCourse.imageUrl,
        organizationLogo: professionalCourse.organizationLogo,
        lessons: professionalCourse.lessons || [],
        requirements: professionalCourse.requirements || [],
        outcomes: professionalCourse.outcomes || [],
        is_public: professionalCourse.is_public !== undefined ? professionalCourse.is_public : true,
        slug: professionalCourse.slug || generateSlug(professionalCourse.title!)
      };
      
      console.log("Prepared course data for submission:", courseToSubmit);
      
      // Try direct creation first
      const directResult = await createCourseDirectly(courseToSubmit, setIsLoading);
      if (directResult) {
        // Redirect to courses page on success
        setTimeout(() => navigate('/courses'), 1000);
        return true;
      }
      
      // Fall back to context method if direct creation failed
      console.log("Falling back to context method for course creation");
      const contextResult = await handleCreateProfessionalCourse(courseToSubmit);
      
      if (contextResult) {
        toast.success("Դասընթացը հաջողությամբ ստեղծվել է։");
        // Redirect to courses page
        setTimeout(() => navigate('/courses'), 1000);
        return true;
      } else {
        toast.error("Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել։");
      }
      
      return false;
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(`Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել: ${error instanceof Error ? error.message : 'Անհայտ սխալ'}`);
      return false;
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};
