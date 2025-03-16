
import { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/contexts/AuthContext';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Code } from 'lucide-react';
import React from 'react';
import { initializeProfessionalCourses, saveProfessionalCourses } from '../utils/storageUtils';
import { getIconName } from '../utils/iconUtils';

export const useProfessionalCourseOperations = () => {
  const { user } = useAuth();
  const [professionalCourses, setProfessionalCourses] = useState<ProfessionalCourse[]>(initializeProfessionalCourses());
  const [selectedProfessionalCourse, setSelectedProfessionalCourse] = useState<ProfessionalCourse | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProfessionalCourse, setNewProfessionalCourse] = useState<Partial<ProfessionalCourse>>({
    title: '',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Code, { className: "w-16 h-16" }),
    duration: '',
    price: '',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: user?.name || '',
    institution: 'ՀՊՏՀ',
    imageUrl: undefined,
    description: '',
    lessons: [],
    requirements: [],
    outcomes: []
  });

  // Get user's professional courses
  const userProfessionalCourses = professionalCourses.filter(course => course.createdBy === user?.name);

  const handleAddProfessionalCourse = () => {
    if (!newProfessionalCourse.title || !newProfessionalCourse.duration || !newProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    getIconName(newProfessionalCourse.icon as React.ReactElement);

    const courseToAdd: ProfessionalCourse = {
      ...(newProfessionalCourse as ProfessionalCourse),
      id: uuidv4(),
      createdBy: user?.name || 'Unknown',
      buttonText: newProfessionalCourse.buttonText || 'Դիտել',
      subtitle: newProfessionalCourse.subtitle || 'ԴԱՍԸՆԹԱՑ',
      color: newProfessionalCourse.color || 'text-amber-500',
      institution: newProfessionalCourse.institution || 'ՀՊՏՀ',
    };

    const updatedCourses = [...professionalCourses, courseToAdd];
    setProfessionalCourses(updatedCourses);
    saveProfessionalCourses(updatedCourses);
    
    setNewProfessionalCourse({
      title: '',
      subtitle: 'ԴԱՍԸՆԹԱՑ',
      icon: React.createElement(Code, { className: "w-16 h-16" }),
      duration: '',
      price: '',
      buttonText: 'Դիտել',
      color: 'text-amber-500',
      createdBy: user?.name || '',
      institution: 'ՀՊՏՀ',
      imageUrl: undefined,
      description: '',
      lessons: [],
      requirements: [],
      outcomes: []
    });
    setIsAddDialogOpen(false);
    toast.success('Դասընթացը հաջողությամբ ավելացվել է');
  };

  const handleEditProfessionalCourse = () => {
    if (!selectedProfessionalCourse) return;
    
    if (!selectedProfessionalCourse.title || !selectedProfessionalCourse.duration || !selectedProfessionalCourse.price) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    getIconName(selectedProfessionalCourse.icon as React.ReactElement);

    const updatedCourses = professionalCourses.map(course => 
      course.id === selectedProfessionalCourse.id ? selectedProfessionalCourse : course
    );
    
    setProfessionalCourses(updatedCourses);
    saveProfessionalCourses(updatedCourses);
    setIsEditDialogOpen(false);
    toast.success('Դասընթացը հաջողությամբ թարմացվել է');
  };

  const handleEditProfessionalCourseInit = (course: ProfessionalCourse) => {
    setSelectedProfessionalCourse({...course});
    setIsEditDialogOpen(true);
  };

  const handleDeleteProfessionalCourse = (id: string) => {
    const courseToDelete = professionalCourses.find(course => course.id === id);
    
    // Only allow admins to delete courses
    if (courseToDelete && user?.role === 'admin') {
      const updatedCourses = professionalCourses.filter(course => course.id !== id);
      setProfessionalCourses(updatedCourses);
      saveProfessionalCourses(updatedCourses);
      toast.success('Դասընթացը հաջողությամբ հեռացվել է');
    } else {
      toast.error('Դուք չունեք իրավունք ջնջելու այս դասընթացը');
    }
  };

  return {
    professionalCourses,
    userProfessionalCourses,
    selectedProfessionalCourse,
    setSelectedProfessionalCourse,
    isAddDialogOpen,
    isEditDialogOpen,
    newProfessionalCourse,
    setNewProfessionalCourse,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    handleAddProfessionalCourse,
    handleEditProfessionalCourse,
    handleEditProfessionalCourseInit,
    handleDeleteProfessionalCourse
  };
};
