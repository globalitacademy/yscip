
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import ProfessionalCourseList from './ProfessionalCourseList';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import DatabaseSyncButton from '@/components/DatabaseSyncButton';

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
    loadCoursesFromDatabase,
    loadCoursesFromLocalStorage,
    loading
  } = useCourses();

  // Load courses from database when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // First try to load from localStorage
        await loadCoursesFromLocalStorage();
        
        // Then try to load from database
        await loadCoursesFromDatabase();
      } catch (error) {
        console.error('Error loading courses:', error);
        toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
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

    // Set up event listener for reloading from localStorage when sync button is clicked
    const handleReloadFromLocal = () => {
      loadCoursesFromLocalStorage();
    };

    window.addEventListener('reload-courses-from-local', handleReloadFromLocal);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('reload-courses-from-local', handleReloadFromLocal);
    };
  }, [loadCoursesFromDatabase, loadCoursesFromLocalStorage]);

  const isAdmin = user?.role === 'admin';

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Բեռնում...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Դասընթացներ</h2>
        <DatabaseSyncButton size="default" showLabel={true} />
      </div>
      
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
