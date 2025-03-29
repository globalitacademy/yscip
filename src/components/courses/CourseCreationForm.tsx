
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/index';
import { useCourseContext } from '@/contexts/CourseContext';
import ProjectFormFooter from '../project-creation/ProjectFormFooter';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

const CourseCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    professionalCourse,
    courseType,
    setCourseType,
    setProfessionalCourse,
    handleCreateProfessionalCourse
  } = useCourseContext();

  // Force courseType to 'professional' on component mount
  useEffect(() => {
    setCourseType('professional');
  }, [setCourseType]);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error("Դուք պետք է մուտք գործեք համակարգ դասընթաց ստեղծելու համար");
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

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

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/--+/g, '-') // Replace multiple - with single -
      .trim(); // Trim - from start and end
  };

  const validateCourse = (course: Partial<ProfessionalCourse>): boolean => {
    if (!course.title) {
      toast.error("Մուտքագրեք դասընթացի վերնագիրը");
      return false;
    }
    
    if (!course.duration) {
      toast.error("Մուտքագրեք դասընթացի տևողությունը");
      return false;
    }
    
    if (!course.price) {
      toast.error("Մուտքագրեք դասընթացի արժեքը");
      return false;
    }
    
    return true;
  };

  const createCourseDirectly = async (courseData: Omit<ProfessionalCourse, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log("Creating course directly with Supabase, course data:", courseData);
      
      const courseId = uuidv4();
      
      // Insert main course data
      const { data, error } = await supabase
        .from('courses')
        .insert({
          id: courseId,
          title: courseData.title,
          subtitle: courseData.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon_name: courseData.iconName || 'book',
          duration: courseData.duration,
          price: courseData.price,
          button_text: courseData.buttonText || 'Դիտել',
          color: courseData.color || 'text-amber-500',
          created_by: user?.name || 'Unknown',
          institution: courseData.institution || 'ՀՊՏՀ',
          image_url: courseData.imageUrl,
          organization_logo: courseData.organizationLogo,
          description: courseData.description || '',
          is_public: true,
          slug: courseData.slug || generateSlug(courseData.title)
        })
        .select();
      
      if (error) {
        console.error('Error inserting course to Supabase:', error);
        toast.error(`Դասընթացի ստեղծման սխալ: ${error.message}`);
        return false;
      }
      
      console.log("Course created successfully:", data);
      
      // Insert related data if provided
      if (courseData.lessons && courseData.lessons.length > 0) {
        const { error: lessonsError } = await supabase
          .from('course_lessons')
          .insert(
            courseData.lessons.map(lesson => ({
              course_id: courseId,
              title: lesson.title,
              duration: lesson.duration
            }))
          );
          
        if (lessonsError) {
          console.error('Error inserting lessons:', lessonsError);
        }
      }
      
      if (courseData.requirements && courseData.requirements.length > 0) {
        const { error: requirementsError } = await supabase
          .from('course_requirements')
          .insert(
            courseData.requirements.map(requirement => ({
              course_id: courseId,
              requirement: requirement
            }))
          );
          
        if (requirementsError) {
          console.error('Error inserting requirements:', requirementsError);
        }
      }
      
      if (courseData.outcomes && courseData.outcomes.length > 0) {
        const { error: outcomesError } = await supabase
          .from('course_outcomes')
          .insert(
            courseData.outcomes.map(outcome => ({
              course_id: courseId,
              outcome: outcome
            }))
          );
          
        if (outcomesError) {
          console.error('Error inserting outcomes:', outcomesError);
        }
      }
      
      toast.success("Դասընթացը հաջողությամբ ստեղծվել է։");
      return true;
    } catch (error) {
      console.error("Error during direct course creation:", error);
      toast.error("Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Creating professional course, user:", user);

      if (!isAuthenticated || !user) {
        toast.error("Դուք պետք է մուտք գործեք համակարգ դասընթաց ստեղծելու համար");
        return false;
      }

      if (professionalCourse) {
        if (!validateCourse(professionalCourse)) return false;
        
        // Make sure title is not optional by asserting it exists after validation
        if (!professionalCourse.title) {
          toast.error("Դասընթացի վերնագիրը պարտադիր է");
          return false;
        }
        
        // Create a new object with all required fields guaranteed to be defined
        const courseToSubmit: Omit<ProfessionalCourse, 'id' | 'createdAt'> = {
          title: professionalCourse.title,
          subtitle: professionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon: professionalCourse.icon,
          iconName: professionalCourse.iconName || 'book',
          duration: professionalCourse.duration,
          price: professionalCourse.price,
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
          is_public: professionalCourse.is_public || true,
          slug: professionalCourse.slug || generateSlug(professionalCourse.title)
        };
        
        console.log("Prepared course data for submission:", courseToSubmit);
        
        // Try direct creation first
        const directResult = await createCourseDirectly(courseToSubmit);
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
      } else {
        toast.error("Լրացրեք բոլոր պարտադիր դաշտերը");
      }
      return false;
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(`Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել: ${error instanceof Error ? error.message : 'Անհայտ սխալ'}`);
      return false;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Նոր դասընթացի ստեղծում</CardTitle>
        <CardDescription>Ստեղծեք նոր դասընթաց ձեր ուսանողների համար</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={courseType} onValueChange={(value: 'standard' | 'professional') => setCourseType(value)}>
          <TabsList className="grid grid-cols-1 w-full">
            <TabsTrigger value="professional">Մասնագիտական դասընթաց</TabsTrigger>
          </TabsList>
          
          <TabsContent value="professional">
            {professionalCourse && (
              <ProfessionalCourseForm
                course={professionalCourse}
                setCourse={setProfessionalCourse}
                isEdit={false}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <ProjectFormFooter 
        onSubmit={handleSubmit} 
        submitText="Ստեղծել դասընթաց" 
        isDisabled={!isFormValid || isLoading}
      />
    </Card>
  );
};

export default CourseCreationForm;
