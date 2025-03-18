
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/components/courses/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import the refactored components
import CourseViewMode from '@/components/courses/CourseDetails/CourseViewMode';
import CourseEditForm, { courseFormSchema, CourseFormValues } from '@/components/courses/CourseDetails/CourseEditForm';
import CourseLoadingState from '@/components/courses/CourseDetails/CourseLoadingState';
import CourseErrorState from '@/components/courses/CourseDetails/CourseErrorState';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      duration: '',
      price: '',
      specialization: '',
      institution: '',
    },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        const fetchedCourse = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          specialization: data.specialization || undefined,
          duration: data.duration,
          modules: data.modules || [],
          createdBy: data.created_by || 'unknown',
          color: data.color,
          button_text: data.button_text,
          icon_name: data.icon_name,
          subtitle: data.subtitle,
          price: data.price,
          image_url: data.image_url,
          institution: data.institution,
          is_persistent: data.is_persistent
        };

        setCourse(fetchedCourse);
        
        // Initialize form with course data
        form.reset({
          title: fetchedCourse.title,
          subtitle: fetchedCourse.subtitle || '',
          description: fetchedCourse.description,
          duration: fetchedCourse.duration,
          price: fetchedCourse.price || '',
          specialization: fetchedCourse.specialization || '',
          institution: fetchedCourse.institution || '',
        });
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Չհաջողվեց բեռնել դասընթացի մանրամասները');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, form]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    if (!isEditing) {
      // Re-populate the form when entering edit mode
      if (course) {
        form.reset({
          title: course.title,
          subtitle: course.subtitle || '',
          description: course.description,
          duration: course.duration,
          price: course.price || '',
          specialization: course.specialization || '',
          institution: course.institution || '',
        });
      }
    }
  };

  const onSubmit = async (values: CourseFormValues) => {
    if (!user || !course) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: values.title,
          subtitle: values.subtitle || 'ԴԱՍԸՆԹԱՑ',
          description: values.description,
          duration: values.duration,
          price: values.price,
          specialization: values.specialization || null,
          institution: values.institution || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Update local course data
      setCourse({
        ...course,
        title: values.title,
        subtitle: values.subtitle || 'ԴԱՍԸՆԹԱՑ',
        description: values.description,
        duration: values.duration,
        price: values.price,
        specialization: values.specialization,
        institution: values.institution,
      });

      setIsEditing(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } catch (err) {
      console.error('Error updating course:', err);
      toast.error('Չհաջողվեց թարմացնել դասընթացը');
    }
  };

  const canEdit = user && course && (user.id === course.createdBy || user.role === 'admin');

  if (isLoading) {
    return (
      <>
        <Header />
        <CourseLoadingState />
        <Footer />
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Header />
        <CourseErrorState error={error} handleGoBack={handleGoBack} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Վերադառնալ
        </Button>
        
        <div className="grid gap-6">
          <Card>
            {isEditing ? (
              <CourseEditForm 
                form={form} 
                onSubmit={onSubmit} 
                handleEditToggle={handleEditToggle} 
              />
            ) : (
              <CourseViewMode 
                course={course} 
                canEdit={canEdit} 
                handleEditToggle={handleEditToggle} 
              />
            )}
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetailsPage;
