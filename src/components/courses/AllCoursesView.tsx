
import React, { useEffect, useState } from 'react';
import { useCourses } from './CourseContext';
import ProfessionalCourseList from './ProfessionalCourseList';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import DatabaseSyncButton from '@/components/DatabaseSyncButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AddProfessionalCourseDialog from './AddProfessionalCourseDialog';

const AllCoursesView: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const {
    professionalCourses,
    userProfessionalCourses,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    newProfessionalCourse,
    setNewProfessionalCourse,
    handleAddProfessionalCourse,
    handleUpdateProfessionalCourse,
    handleEditProfessionalCourseInit,
    handleDeleteProfessionalCourse,
    loadCoursesFromDatabase,
    loadCoursesFromLocalStorage,
    loading
  } = useCourses();

  // Load courses when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setError(null);
        
        // First try to load from localStorage
        await loadCoursesFromLocalStorage();
        
        // Then try to load from database
        await loadCoursesFromDatabase();
      } catch (error) {
        console.error('Error loading courses:', error);
        setError('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
        toast.error('Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել');
      }
    };

    fetchCourses();
  }, [loadCoursesFromDatabase, loadCoursesFromLocalStorage]);

  // Set up subscription for real-time updates in a separate useEffect
  useEffect(() => {
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
          loadCoursesFromDatabase().catch(err => {
            console.error('Error reloading courses after change:', err);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCoursesFromDatabase]);

  // Set up event listener for reloading from localStorage in a separate useEffect
  useEffect(() => {
    const handleReloadFromLocal = () => {
      loadCoursesFromLocalStorage().catch(err => {
        console.error('Error reloading courses from localStorage:', err);
      });
    };

    window.addEventListener('reload-courses-from-local', handleReloadFromLocal);

    return () => {
      window.removeEventListener('reload-courses-from-local', handleReloadFromLocal);
    };
  }, [loadCoursesFromLocalStorage]);

  const handleSyncComplete = () => {
    // Reload courses after sync completes
    loadCoursesFromDatabase().catch(err => {
      console.error('Error reloading courses after sync:', err);
    });
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Սխալ</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Բեռնում...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Մասնագիտական դասընթացներ</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            size="sm" 
            className="mr-2"
          >
            Ավելացնել նոր դասընթաց
          </Button>
          <DatabaseSyncButton 
            size="default" 
            showLabel={true} 
            onSyncComplete={handleSyncComplete}
          />
        </div>
      </div>
      
      <ProfessionalCourseList
        courses={professionalCourses}
        userCourses={userProfessionalCourses}
        isAdmin={false}
        onEdit={handleEditProfessionalCourseInit}
        onDelete={handleDeleteProfessionalCourse}
      />

      <AddProfessionalCourseDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        newCourse={newProfessionalCourse}
        setNewCourse={setNewProfessionalCourse}
        handleAddCourse={handleAddProfessionalCourse}
      />

      <EditProfessionalCourseDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        selectedCourse={selectedProfessionalCourse}
        setSelectedCourse={setSelectedProfessionalCourse}
        handleEditCourse={handleUpdateProfessionalCourse}
      />
    </div>
  );
};

export default AllCoursesView;
