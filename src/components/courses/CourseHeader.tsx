
import React from 'react';
import { useCourses } from './CourseContext';
import AddProfessionalCourseDialog from './AddProfessionalCourseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CourseHeaderProps {
  canAddCourses: boolean;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ canAddCourses }) => {
  const courses = useCourses();
  
  // These properties were missing in the context type
  // Instead of using them directly from context, we'll handle dialog state locally
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newProfessionalCourse, setNewProfessionalCourse] = React.useState({
    id: '',
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    duration: '',
    price: '',
    buttonText: 'Դիտել',
    color: 'text-blue-500',
    createdBy: '',
    institution: ''
  });

  const handleAddProfessionalCourse = async () => {
    try {
      await courses.handleCreateProfessionalCourse(newProfessionalCourse);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">Դասընթացների կառավարում</h1>
      {canAddCourses && (
        <>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Ավելացնել դասընթաց
          </Button>
          
          <AddProfessionalCourseDialog
            isOpen={isAddDialogOpen}
            setIsOpen={setIsAddDialogOpen}
            newCourse={newProfessionalCourse}
            setNewCourse={setNewProfessionalCourse}
            handleAddCourse={handleAddProfessionalCourse}
          />
        </>
      )}
    </div>
  );
};

export default CourseHeader;
