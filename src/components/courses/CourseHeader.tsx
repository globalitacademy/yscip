
import React from 'react';
import { useCourses } from './CourseContext';
import AddCourseDialog from './AddCourseDialog';

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
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Կուրսերի կառավարում</h1>
      {canAddCourses && (
        <AddCourseDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          newCourse={newCourse}
          setNewCourse={setNewCourse}
          newModule={newModule}
          setNewModule={setNewModule}
          handleAddModule={handleAddModule}
          handleRemoveModule={handleRemoveModule}
          handleAddCourse={handleAddCourse}
        />
      )}
    </div>
  );
};

export default CourseHeader;
