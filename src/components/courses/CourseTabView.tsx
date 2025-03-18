
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import CourseList from './CourseList';
import EditCourseDialog from './EditCourseDialog';
import { Skeleton } from '@/components/ui/skeleton';

const CourseTabView: React.FC = () => {
  const { user } = useAuth();
  const {
    courses,
    userCourses,
    isLoading,
    selectedCourse,
    setSelectedCourse,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newModule,
    setNewModule,
    handleEditCourse,
    handleEditInit,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse
  } = useCourses();

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <CourseList
        courses={courses}
        userCourses={userCourses}
        isAdmin={isAdmin}
        onEdit={handleEditInit}
        onDelete={handleDeleteCourse}
      />

      <EditCourseDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        newModule={newModule}
        setNewModule={setNewModule}
        handleAddModuleToEdit={handleAddModuleToEdit}
        handleRemoveModuleFromEdit={handleRemoveModuleFromEdit}
        handleEditCourse={handleEditCourse}
      />
    </>
  );
};

export default CourseTabView;
