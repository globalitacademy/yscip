
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CourseProvider, useCourseContext } from '@/contexts/CourseContext';
import CourseList from './CourseList';
import CourseFilterSection from './CourseFilterSection';
import CourseDialogManager from './CourseDialogManager';
import CourseCreationForm from './CourseCreationForm';

// Inner component that uses the context
const CourseManagementContent: React.FC = () => {
  const { 
    isCreateDialogOpen, 
    setIsCreateDialogOpen,
    loadCourses,
    handleCreateCourse,
    handleCreateInit,
    courses,
    professionalCourses,
    selectedCourse,
    professionalCourse,
    courseType
  } = useCourseContext();
  
  // Load courses on component mount
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Դասընթացներ</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleCreateInit('standard')}>
            <Plus className="h-4 w-4 mr-2" /> Ստանդարտ դասընթաց
          </Button>
          <Button onClick={() => handleCreateInit('professional')}>
            <Plus className="h-4 w-4 mr-2" /> Մասնագիտական դասընթաց
          </Button>
          <Button variant="default" asChild>
            <Link to="/courses/create">
              <Plus className="h-4 w-4 mr-2" /> Նոր դասընթաց
            </Link>
          </Button>
        </div>
      </div>
      
      <CourseFilterSection />
      <CourseList courses={courses} professionalCourses={professionalCourses} />
      <CourseDialogManager />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-screen">
          <CourseCreationForm />
        </DialogContent>
      </Dialog>
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
