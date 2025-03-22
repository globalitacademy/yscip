
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import ProfessionalCourseList from './ProfessionalCourseList';
import EditProfessionalCourseDialog from './EditProfessionalCourseDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';

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
    syncCoursesWithDatabase,
    loading
  } = useCourses();
  const [syncing, setSyncing] = useState(false);

  // Load courses from database when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadCoursesFromDatabase]);

  const handleSyncWithDatabase = async () => {
    setSyncing(true);
    try {
      await syncCoursesWithDatabase();
      toast.success('Դասընթացները հաջողությամբ համաժամեցվել են');
    } catch (error) {
      console.error('Error syncing with database:', error);
      toast.error('Համաժամեցման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setSyncing(false);
    }
  };

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
        <Button 
          variant="outline"
          onClick={handleSyncWithDatabase}
          disabled={syncing}
          className="flex items-center gap-2"
        >
          {syncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Համաժամեցնել բազայի հետ
        </Button>
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
