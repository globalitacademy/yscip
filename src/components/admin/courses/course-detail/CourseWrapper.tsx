
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CourseDetailContent from './CourseDetailContent';
import CourseDeleteDialog from './CourseDeleteDialog';

interface CourseWrapperProps {
  course: ProfessionalCourse | null;
  loading: boolean;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDeleteCourse: () => Promise<void>;
  handlePublishToggle: () => Promise<void>;
  canEdit: boolean;
  actionType: 'delete' | 'status' | null;
}

const CourseWrapper: React.FC<CourseWrapperProps> = ({
  course,
  loading,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDeleteCourse,
  handlePublishToggle,
  canEdit,
  actionType
}) => {
  const navigate = useNavigate();

  // Rendering logic for loading state
  if (loading && !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p>Դասընթացի բեռնում...</p>
        </div>
      </div>
    );
  }

  // Rendering logic for when the course is not found
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Դասընթացը չի գտնվել</h1>
          <p className="mb-6 text-muted-foreground">Հնարավոր է այն ջնջվել է կամ հասանելի չէ</p>
          <Button onClick={() => navigate('/admin/courses')}>Վերադառնալ դասընթացների էջ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseDetailContent 
        course={course}
        canEdit={canEdit}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handlePublishToggle={handlePublishToggle}
        loading={loading}
        actionType={actionType}
      />
      
      <CourseDeleteDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDeleteCourse={handleDeleteCourse}
        loading={loading}
      />
    </div>
  );
};

export default CourseWrapper;
