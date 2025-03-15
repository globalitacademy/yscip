
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AddCourseDialog from './AddCourseDialog';
import EditCourseDialog from './EditCourseDialog';
import CourseList from './CourseList';
import { useCourseManagement } from './useCourseManagement';

const CourseManagement: React.FC = () => {
  const { user } = useAuth();
  const {
    courses,
    userCourses,
    selectedCourse,
    setSelectedCourse,
    isAddDialogOpen,
    isEditDialogOpen,
    newCourse,
    newModule,
    setNewCourse,
    setNewModule,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    handleAddCourse,
    handleEditCourse,
    handleEditInit,
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse
  } = useCourseManagement();

  const isAdmin = user?.role === 'admin';
  const isLecturer = ['lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user?.role || '');
  const canAddCourses = isAdmin || isLecturer;

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default CourseManagement;
