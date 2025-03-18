
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Import components
import CourseViewMode from '@/components/courses/CourseDetails/CourseViewMode';
import CourseEditForm, { CourseFormValues } from '@/components/courses/CourseDetails/CourseEditForm';
import { Course } from '@/components/courses/types';
import { UseFormReturn } from 'react-hook-form';

interface CourseContentProps {
  course: Course;
  form: UseFormReturn<CourseFormValues>;
  updateCourse: (values: CourseFormValues) => Promise<boolean>;
}

const CourseContent: React.FC<CourseContentProps> = ({
  course,
  form,
  updateCourse
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  
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

  return (
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
  );
};

export default CourseContent;
