
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { initializeCourses, getNewProfessionalCourseTemplate } from './utils/mockData';
import { addCourse, editCourse, deleteCourse } from './operations/legacyCourseOperations';
import {
  fetchProfessionalCourses as fetchProfessionalCoursesFromDB,
  addProfessionalCourse,
  editProfessionalCourse,
  deleteProfessionalCourse,
  migrateProfessionalCourses
} from './operations/professionalCourseOperations';
import { getIconFromName } from './utils/iconUtils';

export const useCourseManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initializeCourses());
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProfessionalCourse, setSelectedProfessionalCourse] = useState<ProfessionalCourse | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    specialization: '',
    duration: '',
    modules: [],
    createdBy: user?.id || ''
  });
  
  const [newProfessionalCourse, setNewProfessionalCourse] = useState<Partial<ProfessionalCourse>>(
    getNewProfessionalCourseTemplate(user?.name || '')
  );
  
  const [newModule, setNewModule] = useState('');

  // Fetch professional courses from DB
  const fetchProfessionalCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchProfessionalCoursesFromDB();
      setProfessionalCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchProfessionalCourses();
  }, []);
  
  // Get user's courses
  const userCourses = courses.filter(course => course.createdBy === user?.id);
  
  // Get user's professional courses
  const userProfessionalCourses = professionalCourses.filter(course => course.created_by === user?.name);

  // Legacy course operations
  const handleAddCourse = () => {
    try {
      const updatedCourses = addCourse(courses, newCourse, user?.id);
      setCourses(updatedCourses);
      
      setNewCourse({
        name: '',
        description: '',
        specialization: '',
        duration: '',
        modules: [],
        createdBy: user?.id || ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleEditCourse = () => {
    try {
      const updatedCourses = editCourse(courses, selectedCourse);
      setCourses(updatedCourses);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error editing course:', error);
    }
  };

  const handleEditInit = (course: Course) => {
    setSelectedCourse({...course});
    setIsEditDialogOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    try {
      const updatedCourses = deleteCourse(courses, id, user?.id, user?.role);
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Module operations for legacy courses
  const handleAddModule = () => {
    if (!newModule) return;
    setNewCourse({
      ...newCourse,
      modules: [...(newCourse.modules || []), newModule]
    });
    setNewModule('');
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...(newCourse.modules || [])];
    updatedModules.splice(index, 1);
    setNewCourse({
      ...newCourse,
      modules: updatedModules
    });
  };

  const handleAddModuleToEdit = () => {
    if (!newModule || !selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: [...selectedCourse.modules, newModule]
    });
    setNewModule('');
  };

  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };

  // Professional Courses Operations with Supabase
  const handleAddProfessionalCourse = async () => {
    try {
      const success = await addProfessionalCourse(newProfessionalCourse, user?.name);
      
      if (success) {
        // Refresh the courses list
        await fetchProfessionalCourses();
        
        // Reset the form
        setNewProfessionalCourse(getNewProfessionalCourseTemplate(user?.name || ''));
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      console.error('Error in handleAddProfessionalCourse:', error);
    }
  };

  const handleEditProfessionalCourse = async () => {
    try {
      const success = await editProfessionalCourse(selectedProfessionalCourse);
      
      if (success) {
        // Refresh the courses list to get the updated data
        await fetchProfessionalCourses();
        setIsEditDialogOpen(false);
      }
    } catch (error) {
      console.error('Error in handleEditProfessionalCourse:', error);
    }
  };

  const handleEditProfessionalCourseInit = (course: ProfessionalCourse) => {
    console.log('Editing course:', course);
    // Create a deep copy to avoid reference issues
    const courseCopy = JSON.parse(JSON.stringify(course));
    
    // Re-create the React element for the icon since it can't be stringified
    courseCopy.icon = getIconFromName(course.icon_name);
    
    setSelectedProfessionalCourse(courseCopy);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProfessionalCourse = async (id: string) => {
    try {
      const success = await deleteProfessionalCourse(id, user?.role);
      
      if (success) {
        // Refresh the courses list
        await fetchProfessionalCourses();
      }
    } catch (error) {
      console.error('Error in handleDeleteProfessionalCourse:', error);
    }
  };

  // Run migration on first load
  useEffect(() => {
    if (!loading && professionalCourses.length === 0) {
      migrateProfessionalCourses().then(success => {
        if (success) {
          fetchProfessionalCourses();
        }
      });
    }
  }, [loading, professionalCourses]);

  return {
    courses,
    userCourses,
    professionalCourses,
    userProfessionalCourses,
    selectedCourse,
    selectedProfessionalCourse,
    loading,
    setSelectedCourse,
    setSelectedProfessionalCourse,
    isAddDialogOpen,
    isEditDialogOpen,
    newCourse,
    newProfessionalCourse,
    newModule,
    setNewCourse,
    setNewProfessionalCourse,
    setNewModule,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    handleAddCourse,
    handleAddProfessionalCourse,
    handleEditCourse,
    handleEditProfessionalCourse,
    handleEditInit,
    handleEditProfessionalCourseInit,
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit,
    handleDeleteCourse,
    handleDeleteProfessionalCourse,
    fetchProfessionalCourses
  };
};
