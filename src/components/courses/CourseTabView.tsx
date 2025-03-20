
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from './CourseContext';
import CourseList from './CourseList';
import EditCourseDialog from './EditCourseDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from 'lucide-react';

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

  const [courseIdToDelete, setCourseIdToDelete] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';
  const isInstructor = ['lecturer', 'instructor'].includes(user?.role || '');
  const canEdit = isAdmin || isInstructor;

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

  const handleConfirmDelete = () => {
    if (courseIdToDelete) {
      handleDeleteCourse(courseIdToDelete);
      setCourseIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setCourseIdToDelete(null);
  };

  const handleDeleteConfirmation = (courseId: string) => {
    setCourseIdToDelete(courseId);
  };

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Բոլոր դասընթացները</TabsTrigger>
          {user && <TabsTrigger value="my">Իմ դասընթացները</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <CourseList
            courses={courses}
            isAdmin={canEdit}
            onEdit={(course) => {
              setSelectedCourse(course);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteConfirmation}
          />
        </TabsContent>
        
        <TabsContent value="my" className="space-y-4">
          {userCourses.length > 0 ? (
            <CourseList
              courses={userCourses}
              isAdmin={canEdit}
              onEdit={(course) => {
                setSelectedCourse(course);
                setIsEditDialogOpen(true);
              }}
              onDelete={handleDeleteConfirmation}
            />
          ) : (
            <div className="text-center py-10 rounded-lg border border-dashed">
              <h3 className="font-semibold text-lg mb-2">Դուք չունեք դասընթացներ</h3>
              <p className="text-muted-foreground mb-4">Ավելացրեք ձեր առաջին դասընթացը</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <EditCourseDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        newModule={newModule}
        setNewModule={setNewModule}
        handleAddModuleToEdit={handleAddModuleToEdit}
        handleRemoveModuleFromEdit={handleRemoveModuleFromEdit}
        handleEditCourse={handleEditCourse}
      />

      <AlertDialog open={!!courseIdToDelete} onOpenChange={(open) => !open && setCourseIdToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Դասընթացի հեռացում</AlertDialogTitle>
            <AlertDialogDescription>
              Դուք իսկապե՞ս ցանկանում եք հեռացնել այս դասընթացը։ Այս գործողությունը հնարավոր չէ հետ շրջել։
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Չեղարկել</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Հեռացնել
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CourseTabView;
