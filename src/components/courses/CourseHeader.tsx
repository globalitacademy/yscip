
import React from 'react';
import { useCourses } from './CourseContext';
import AddProfessionalCourseDialog from './AddProfessionalCourseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CourseHeaderProps {
  canAddCourses: boolean;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ canAddCourses }) => {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    handleAddProfessionalCourse
  } = useCourses();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Դասընթացների կառավարում</h1>
      {canAddCourses && (
        <div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Ավելացնել դասընթաց
          </Button>
          
          <AddProfessionalCourseDialog
            isOpen={isAddDialogOpen}
            setIsOpen={setIsAddDialogOpen}
            onAddCourse={handleAddProfessionalCourse}
          />
        </div>
      )}
    </div>
  );
};

export default CourseHeader;
