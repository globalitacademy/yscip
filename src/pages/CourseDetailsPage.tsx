
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Import components
import CourseViewMode from '@/components/courses/CourseDetails/CourseViewMode';
import CourseEditForm, { CourseFormValues } from '@/components/courses/CourseDetails/CourseEditForm';
import CourseLoadingState from '@/components/courses/CourseDetails/CourseLoadingState';
import CourseErrorState from '@/components/courses/CourseDetails/CourseErrorState';

// Import the new custom hook
import { useCourseDetails } from '@/components/courses/hooks/useCourseDetails';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use the custom hook
  const { course, isLoading, error, form, updateCourse } = useCourseDetails(id);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    
    if (!isEditing && course) {
      // Re-populate the form when entering edit mode
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
  };

  const onSubmit = async (values: CourseFormValues) => {
    if (!user || !course) return;
    
    const success = await updateCourse(values);
    
    if (success) {
      setIsEditing(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } else {
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
