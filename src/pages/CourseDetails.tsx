
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import EditProfessionalCourseDialog from '@/components/courses/EditProfessionalCourseDialog';
import { useAuth } from '@/contexts/AuthContext';
import CourseHeader from '@/components/courses/details/CourseHeader';
import CourseDetailsContent from '@/components/courses/details/CourseDetailsContent';
import CourseDeleteDialog from '@/components/courses/details/CourseDeleteDialog';
import { useCourseDetails } from '@/components/courses/hooks/useCourseDetails';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    course,
    setCourse,
    loading,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isEditing,
    editedCourse,
    setEditedCourse,
    newLesson,
    setNewLesson,
    newRequirement,
    setNewRequirement,
    newOutcome,
    setNewOutcome,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleApply,
    handleEditCourse,
    toggleEditMode,
    cancelEditing,
    handleAddLesson,
    handleRemoveLesson,
    handleAddRequirement,
    handleRemoveRequirement,
    handleAddOutcome,
    handleRemoveOutcome
  } = useCourseDetails(id);

  const handleDeleteCourse = () => {
    setIsDeleteDialogOpen(true);
  };

  const navigateToCoursesPage = () => {
    navigate('/admin/courses');
  };

  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Բեռնում...</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h2>
            <Link to="/admin/courses" className="inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded">
              Վերադառնալ դասընթացների ցանկ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayCourse = isEditing ? editedCourse : course;
  if (!displayCourse) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <CourseHeader 
            canEdit={canEdit} 
            isEditing={isEditing} 
            toggleEditMode={toggleEditMode} 
            cancelEditing={cancelEditing}
            onDelete={handleDeleteCourse}
            courseId={course?.id || ''}
            isPersistentCourse={false}
          />
        </div>
        
        <CourseDetailsContent
          displayCourse={displayCourse}
          isEditing={isEditing}
          editedCourse={editedCourse}
          setEditedCourse={setEditedCourse}
          newLesson={newLesson}
          setNewLesson={setNewLesson}
          newRequirement={newRequirement}
          setNewRequirement={setNewRequirement}
          newOutcome={newOutcome}
          setNewOutcome={setNewOutcome}
          handleApply={handleApply}
          handleAddLesson={handleAddLesson}
          handleRemoveLesson={handleRemoveLesson}
          handleAddRequirement={handleAddRequirement}
          handleRemoveRequirement={handleRemoveRequirement}
          handleAddOutcome={handleAddOutcome}
          handleRemoveOutcome={handleRemoveOutcome}
        />
      </main>
      
      <Footer />

      {course && (
        <EditProfessionalCourseDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          selectedCourse={course}
          setSelectedCourse={setCourse}
          handleEditCourse={handleEditCourse}
        />
      )}
      
      <CourseDeleteDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        course={course}
        onSuccess={navigateToCoursesPage}
      />
    </div>
  );
};

export default CourseDetails;
