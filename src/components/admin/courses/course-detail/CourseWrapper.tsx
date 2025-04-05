
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import CourseDetailContent from './CourseDetailContent';
import CourseEditDialog from './CourseEditDialog';
import CourseDeleteDialog from './CourseDeleteDialog';

interface CourseWrapperProps {
  course: ProfessionalCourse | null;
  loading: boolean;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleSaveChanges: () => Promise<void>;
  handleDeleteCourse: () => Promise<void>;
  handlePublishToggle: () => Promise<void>;
  canEdit: boolean;
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
  actionType: 'delete' | 'status' | null;
  isEditMode: boolean;
}

const CourseWrapper: React.FC<CourseWrapperProps> = ({
  course,
  loading,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleSaveChanges,
  handleDeleteCourse,
  handlePublishToggle,
  canEdit,
  editedCourse,
  setEditedCourse,
  actionType,
  isEditMode
}) => {
  const navigate = useNavigate();

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

  // If we're in edit mode but the dialog isn't open yet, open it
  React.useEffect(() => {
    if (isEditMode && !isEditDialogOpen) {
      setIsEditDialogOpen(true);
    }
  }, [isEditMode, isEditDialogOpen, setIsEditDialogOpen]);

  return (
    <div className="container mx-auto px-4 py-8">
      <CourseDetailContent 
        course={course}
        canEdit={canEdit}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handlePublishToggle={handlePublishToggle}
        loading={loading}
        actionType={actionType}
      />
      
      <CourseEditDialog 
        isOpen={isEditDialogOpen}
        setIsOpen={(open) => {
          setIsEditDialogOpen(open);
          // If closing dialog in edit mode, navigate back to view mode
          if (!open && isEditMode) {
            navigate(`/admin/course/${course.id}`);
          }
          // Reset editedCourse to current course state if dialog is closed without saving
          if (!open) {
            setEditedCourse(JSON.parse(JSON.stringify(course))); // Deep copy
          }
        }}
        editedCourse={editedCourse}
        setEditedCourse={setEditedCourse}
        handleSaveChanges={handleSaveChanges}
        loading={loading}
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
