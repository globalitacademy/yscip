
import { useState } from 'react';
import { Course } from '../types';
import { useAuth } from '@/contexts/AuthContext';

export const useCourseState = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    specialization: '',
    duration: '',
    modules: [],
    createdBy: user?.id || '',
    price: '',
    institution: 'Qolej',
    subtitle: 'ԴԱՍԸՆԹԱՑ'
  });
  const [newModule, setNewModule] = useState('');

  return {
    selectedCourse,
    setSelectedCourse,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    newCourse,
    setNewCourse,
    newModule,
    setNewModule
  };
};
