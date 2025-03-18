
import React from 'react';
import { useCourses } from './CourseContext';
import AddCourseDialog from './AddCourseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CourseHeaderProps {
  canAddCourses: boolean;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ canAddCourses }) => {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    newCourse,
    newModule,
    setNewCourse,
    setNewModule,
    handleAddModule,
    handleRemoveModule,
    handleAddCourse
  } = useCourses();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Կուրսերի կառավարում</h1>
      {canAddCourses && (
        <>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Ավելացնել կուրս
          </Button>
          
          <AddCourseDialog
            isOpen={isAddDialogOpen}
            onClose={() => setIsAddDialogOpen(false)}
            newCourse={newCourse}
            setNewCourse={setNewCourse}
            newModule={newModule}
            setNewModule={setNewModule}
            handleAddModule={handleAddModule}
            handleRemoveModule={handleRemoveModule}
            handleAddCourse={handleAddCourse}
          />
        </>
      )}
    </div>
  );
};

export default CourseHeader;
