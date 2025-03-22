
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import ProfessionalCourseList from './ProfessionalCourseList';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';

const ProfessionalCourseTabView: React.FC = () => {
  const { user } = useAuth();
  const permissions = useProjectPermissions(user?.role);
  const {
    professionalCourses,
    userProfessionalCourses,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEditProfessionalCourse,
    handleEditProfessionalCourseInit,
    handleDeleteProfessionalCourse
  } = useCourses();

  // Determine if the user can manage all courses
  const canManageAllCourses = permissions.canViewAllProjects || user?.role === 'admin';
  
  // Determine which courses to display based on user role
  const displayCourses = canManageAllCourses 
    ? professionalCourses 
    : userProfessionalCourses;

  return (
    <>
      <ProfessionalCourseList
        courses={displayCourses}
        userCourses={userProfessionalCourses}
        isAdmin={canManageAllCourses}
        onEdit={handleEditProfessionalCourseInit}
        onDelete={handleDeleteProfessionalCourse}
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
