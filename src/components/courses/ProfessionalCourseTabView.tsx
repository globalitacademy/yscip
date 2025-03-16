
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import ProfessionalCourseList from './ProfessionalCourseList';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';

const ProfessionalCourseTabView: React.FC = () => {
  const { user } = useAuth();
  const {
    professionalCourses,
    userProfessionalCourses,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEditProfessionalCourse,
    handleEditProfessionalCourseInit,
    handleDeleteProfessionalCourse,
    loading
  } = useCourses();

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <ProfessionalCourseList
        courses={professionalCourses}
        userCourses={userProfessionalCourses}
        isAdmin={isAdmin}
        onEdit={handleEditProfessionalCourseInit}
        onDelete={handleDeleteProfessionalCourse}
        loading={loading}
      />

      <EditProfessionalCourseDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedCourse={selectedProfessionalCourse}
        setSelectedCourse={setSelectedProfessionalCourse}
        handleEditCourse={handleEditProfessionalCourse}
      />
    </>
  );
};

export default ProfessionalCourseTabView;
