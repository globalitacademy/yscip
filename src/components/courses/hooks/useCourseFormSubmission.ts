
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from '../types';
import { createCourseDirectly, generateSlug } from '../utils/courseSubmission';
import { v4 as uuidv4 } from 'uuid';

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

      // Even if not authenticated, we'll allow course creation with a warning
      if (!isAuthenticated || !user) {
        toast.warning("Դուք մուտք չեք գործել համակարգ, դասընթացը կստեղծվի բայց չի հրապարակվի");
      }

      if (!professionalCourse || !validateCourse(professionalCourse)) {
        toast.error("Դասընթացի տվյալները սխալ են։ Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։");
        return false;
      }
      
      setIsLoading(true);
      
      // At this point, we know professionalCourse has title, duration and price since validateCourse passed
      // Generate ID beforehand in case we need to save locally
      const courseId = uuidv4();
      
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
      const directResult = await createCourseDirectly(courseToSubmit);
      
      if (directResult) {
        // Redirect to courses page on success
        toast.success("Դասընթացը հաջողությամբ ստեղծվել է։");
        setTimeout(() => navigate('/courses'), 1000);
        return true;
      }
      
      // Fall back to context method if direct creation failed
      console.log("Falling back to context method for course creation");
      
      try {
        const contextResult = await handleCreateProfessionalCourse(courseToSubmit);
        
        if (contextResult) {
          toast.success("Դասընթացը հաջողությամբ ստեղծվել է։");
          // Redirect to courses page
          setTimeout(() => navigate('/courses'), 1000);
          return true;
        }
      } catch (contextError) {
        console.error("Error with context method:", contextError);
        
        // Last resort - save to localStorage directly
        try {
          const storedCourses = localStorage.getItem('professional_courses');
          let courses = storedCourses ? JSON.parse(storedCourses) : [];
          
          const courseWithId = {
            ...courseToSubmit,
            id: courseId,
            createdAt: new Date().toISOString()
          };
          
          // Remove icon for localStorage
          const { icon, ...courseToStore } = courseWithId;
          
          courses.push(courseToStore);
          localStorage.setItem('professional_courses', JSON.stringify(courses));
          
          toast.success("Դասընթացը պահվել է լոկալ, և կսինխրոնիզացվի հետագայում։");
          setTimeout(() => navigate('/courses'), 1000);
          return true;
        } catch (localError) {
          console.error("Error saving to localStorage:", localError);
          toast.error("Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել։");
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(`Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել: ${error instanceof Error ? error.message : 'Անհայտ սխալ'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
};
