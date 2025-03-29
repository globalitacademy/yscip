
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

const CourseCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isFormValid, setIsFormValid] = useState(false);
  
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

  const handleSubmit = async () => {
    try {
      console.log("Creating professional course, user:", user);

      if (!isAuthenticated || !user) {
        toast.error("Դուք պետք է մուտք գործեք համակարգ դասընթաց ստեղծելու համար");
        return false;
      }

      if (professionalCourse) {
        if (!validateCourse(professionalCourse)) return false;
        
        // Ensure required fields are set
        const courseToSubmit = {
          ...professionalCourse,
          id: uuidv4(), // Generate unique ID
          createdBy: user?.name || 'Unknown',
          iconName: professionalCourse.iconName || 'book',
          subtitle: professionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
          buttonText: professionalCourse.buttonText || 'Դիտել',
          color: professionalCourse.color || 'text-amber-500',
          institution: professionalCourse.institution || 'ՀՊՏՀ',
          is_public: true,
          createdAt: new Date().toISOString()
        };
        
        // Generate a slug for the URL if not provided
        if (!courseToSubmit.slug && courseToSubmit.title) {
          courseToSubmit.slug = generateSlug(courseToSubmit.title);
        }
        
        console.log("Creating professional course:", courseToSubmit);
        
        const success = await handleCreateProfessionalCourse(courseToSubmit as Omit<ProfessionalCourse, 'id' | 'createdAt'>);
        if (success) {
          toast.success("Դասընթացը հաջողությամբ ստեղծվել է։");
          
          // Redirect to courses page
          navigate('/courses');
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
        isDisabled={!isFormValid}
      />
    </Card>
  );
};

export default CourseCreationForm;
