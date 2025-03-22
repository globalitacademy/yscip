
import React from 'react';
import { useCourses } from './CourseContext';
import AddProfessionalCourseDialog from './AddProfessionalCourseDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';

interface CourseHeaderProps {
  canAddCourses: boolean;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ canAddCourses }) => {
  const courses = useCourses();
  const { user } = useAuth();
  
  // Handle dialog state locally
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [newProfessionalCourse, setNewProfessionalCourse] = React.useState({
    id: uuidv4(),
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    duration: '',
    price: '',
    buttonText: 'Դիտել',
    color: 'text-blue-500',
    createdBy: user?.name || '',
    institution: user?.organization || 'Գիտելիք Էդյու'
  });

  const handleAddProfessionalCourse = async () => {
    try {
      if (!newProfessionalCourse.title || !newProfessionalCourse.duration || !newProfessionalCourse.price) {
        console.error('Missing required fields for course creation');
        return;
      }
      
      // Ensure createdBy is set correctly
      const courseToCreate = {
        ...newProfessionalCourse,
        createdBy: user?.name || '',
        id: uuidv4() // Generate a new ID for each course
      };
      
      await courses.handleCreateProfessionalCourse(courseToCreate);
      setIsAddDialogOpen(false);
      
      // Reset the form after successful creation
      setNewProfessionalCourse({
        id: uuidv4(),
        title: '',
        subtitle: 'ԴԱՍԸՆԹԱՑ',
        duration: '',
        price: '',
        buttonText: 'Դիտել',
        color: 'text-blue-500',
        createdBy: user?.name || '',
        institution: user?.organization || 'Գիտելիք Էդյու'
      });
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
