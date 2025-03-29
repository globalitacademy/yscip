
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfessionalCourseForm from './ProfessionalCourseForm';
import { ProfessionalCourse } from './types/index';
import { useCourseContext } from '@/contexts/CourseContext';
import ProjectFormFooter from '../project-creation/ProjectFormFooter';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const CourseCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
      toast({
        title: "Սխալ",
        description: "Մուտքագրեք դասընթացի վերնագիրը",
        variant: "destructive",
      });
      return false;
    }
    
    if (!course.duration) {
      toast({
        title: "Սխալ",
        description: "Մուտքագրեք դասընթացի տևողությունը",
        variant: "destructive",
      });
      return false;
    }
    
    if (!course.price) {
      toast({
        title: "Սխալ",
        description: "Մուտքագրեք դասընթացի արժեքը",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    try {
      console.log("Creating professional course, user:", user);

      if (professionalCourse) {
        if (!validateCourse(professionalCourse)) return false;
        
        // Ensure required fields are set
        const courseToSubmit = {
          ...professionalCourse,
          createdBy: user?.name || 'Unknown',
          iconName: professionalCourse.iconName || 'book',
          subtitle: professionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
          buttonText: professionalCourse.buttonText || 'Դիտել',
          color: professionalCourse.color || 'text-amber-500',
          institution: professionalCourse.institution || 'ՀՊՏՀ',
        };
        
        // Generate a slug for the URL if not provided
        if (!courseToSubmit.slug && courseToSubmit.title) {
          courseToSubmit.slug = generateSlug(courseToSubmit.title);
        }
        
        console.log("Creating professional course:", courseToSubmit);
        
        const success = await handleCreateProfessionalCourse(courseToSubmit as Omit<ProfessionalCourse, 'id' | 'createdAt'>);
        if (success) {
          toast({
            title: "Դասընթացը ստեղծված է",
            description: "Մասնագիտական դասընթացը հաջողությամբ ստեղծվել է։",
          });
          
          // Redirect to courses page
          navigate('/courses');
          return true;
        }
      } else {
        toast({
          title: "Սխալ",
          description: "Լրացրեք բոլոր պարտադիր դաշտերը",
          variant: "destructive",
        });
      }
      return false;
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Սխալ",
        description: "Դասընթացի ստեղծման ժամանակ սխալ է տեղի ունեցել",
        variant: "destructive",
      });
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
      <ProjectFormFooter onSubmit={handleSubmit} submitText="Ստեղծել դասընթաց" />
    </Card>
  );
};

export default CourseCreationForm;
