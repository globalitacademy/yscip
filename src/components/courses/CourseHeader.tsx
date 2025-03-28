
import React from 'react';
import { useCourses } from './CourseContext';
import AddProfessionalCourseDialog from './AddProfessionalCourseDialog';

interface CourseHeaderProps {
  canAddCourses: boolean;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ canAddCourses }) => {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    newProfessionalCourse,
    setNewProfessionalCourse,
    handleCreateProfessionalCourse
  } = useCourses();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Դասընթացների կառավարում</h1>
      {canAddCourses && (
        <AddProfessionalCourseDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          newCourse={newProfessionalCourse}
          setNewCourse={setNewProfessionalCourse}
          handleAddCourse={handleCreateProfessionalCourse}
        />
      )}
    </div>
  );
};

export default CourseHeader;
