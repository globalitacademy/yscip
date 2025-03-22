
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import ProfessionalCourseList from './ProfessionalCourseList';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    loadCoursesFromDatabase
  } = useCourses();
  const [isLoading, setIsLoading] = useState(false);

  // Load courses from database when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        await loadCoursesFromDatabase();
      } catch (error) {
        console.error('Error loading courses:', error);
        toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();

    // Set up subscription for real-time updates
    const channel = supabase
      .channel('courses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'courses'
        },
        () => {
          // Reload courses when any changes happen
          loadCoursesFromDatabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCoursesFromDatabase]);

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return <div className="p-8 text-center">Բեռնում...</div>;
  }

  return (
    <>
      <ProfessionalCourseList
        courses={professionalCourses}
        userCourses={userProfessionalCourses}
        isAdmin={isAdmin}
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
