
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';
import CourseList from './CourseList';
import CourseFilterSection from './CourseFilterSection';
import CourseDialogManager from './CourseDialogManager';
import CourseCreationForm from './CourseCreationForm';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useCoursePermissions } from '@/hooks/useCoursePermissions';

// Inner component that uses the context
const CourseManagementContent: React.FC = () => {
  const { 
    isCreateDialogOpen, 
    setIsCreateDialogOpen,
    loadCourses,
    handleCreateInit,
    courses,
    professionalCourses,
    loading: contextLoading,
    error: contextError
  } = useCourseContext();
  
  const { user } = useAuth();
  const permissions = useCoursePermissions();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await loadCourses();
      } catch (error: any) {
        console.error("Error loading courses:", error);
        setError("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
        toast.error("Դասընթացների բեռնման ժամանակ սխալ է տեղի ունեցել");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [loadCourses]);

  // Combined loading and error states
  const combinedLoading = isLoading || contextLoading;
  const combinedError = error || contextError;

  // Check if user has permission to manage courses
  const canManageCourses = permissions.canCreateCourse;
  
  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Դուք պետք է լինեք մուտք գործած համակարգ դասընթացների կառավարման համար
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Դասընթացներ</h2>
        {canManageCourses && (
          <div className="flex gap-2">
            <Button onClick={() => handleCreateInit('professional')}>
              <Plus className="h-4 w-4 mr-2" /> Մասնագիտական դասընթաց
            </Button>
            <Button variant="default" asChild>
              <Link to="/courses/create">
                <Plus className="h-4 w-4 mr-2" /> Նոր դասընթաց
              </Link>
            </Button>
          </div>
        )}
      </div>
      
      <CourseFilterSection />
      
      {combinedLoading ? (
        <div className="flex justify-center items-center p-8 space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-muted-foreground">Բեռնում...</span>
        </div>
      ) : combinedError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{combinedError}</AlertDescription>
        </Alert>
      ) : (professionalCourses.length === 0 && courses.length === 0) ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2">Դասընթացներ չեն գտնվել</h3>
          {canManageCourses && (
            <p className="text-muted-foreground mb-4">
              Ստեղծեք ձեր առաջին դասընթացը սեղմելով «Նոր դասընթաց» կոճակը
            </p>
          )}
        </div>
      ) : (
        <CourseList 
          courses={courses} 
          professionalCourses={professionalCourses} 
          userPermissions={permissions}
          currentUserId={user?.id || ''}
        />
      )}
      
      <CourseDialogManager />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-screen">
          <CourseCreationForm />
        </DialogContent>
      </Dialog>
      
      {permissions.requiresApproval && (
        <Alert className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ձեր ստեղծած դասընթացները պետք է հաստատվեն ադմինիստրատորի կողմից նախքան դրանք կհասանելի դառնան համակարգում
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Main component that provides the context
const CourseManagement: React.FC = () => {
  return (
    <CourseProvider>
      <CourseManagementContent />
    </CourseProvider>
  );
};

export default CourseManagement;
