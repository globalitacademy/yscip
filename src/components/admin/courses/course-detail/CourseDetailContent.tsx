
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { ActionButtons } from '../actions/ActionButtons';
import CourseDetailHeader from './CourseDetailHeader';
import CourseTabContent from './CourseTabContent';
import { useTheme } from '@/hooks/use-theme';

interface CourseDetailContentProps {
  course: ProfessionalCourse;
  canEdit: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  handlePublishToggle: () => void;
  loading: boolean;
  actionType: 'delete' | 'status' | null;
}

const CourseDetailContent: React.FC<CourseDetailContentProps> = ({
  course,
  canEdit,
  setIsDeleteDialogOpen,
  handlePublishToggle,
  loading,
  actionType
}) => {
  const { theme } = useTheme();
  
  return (
    <>
      <div className={`flex justify-between items-start mb-6 ${theme === 'dark' ? 'text-gray-100' : ''}`}>
        <CourseDetailHeader course={course} />
        
        <ActionButtons 
          courseId={course.id}
          isPublic={course.is_public || false}
          canModify={canEdit}
          onStatusToggle={handlePublishToggle}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
          isLoadingStatus={loading}
          actionType={actionType}
        />
      </div>
      
      <CourseTabContent 
        course={course} 
        canEdit={canEdit}
      />
    </>
  );
};

export default CourseDetailContent;
