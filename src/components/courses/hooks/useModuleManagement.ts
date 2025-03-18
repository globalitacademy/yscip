
import { Dispatch, SetStateAction } from 'react';
import { Course } from '../types';

export const useModuleManagement = (
  newCourse: Partial<Course>,
  setNewCourse: Dispatch<SetStateAction<Partial<Course>>>,
  selectedCourse: Course | null,
  setSelectedCourse: Dispatch<SetStateAction<Course | null>>
) => {
  const handleAddModule = (newModule: string) => {
    if (!newModule) return;
    setNewCourse({
      ...newCourse,
      modules: [...(newCourse.modules || []), newModule]
    });
  };

  const handleRemoveModule = (index: number) => {
    const updatedModules = [...(newCourse.modules || [])];
    updatedModules.splice(index, 1);
    setNewCourse({
      ...newCourse,
      modules: updatedModules
    });
  };

  const handleAddModuleToEdit = (newModule: string) => {
    if (!newModule || !selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: [...(selectedCourse.modules || []), newModule]
    });
  };

  const handleRemoveModuleFromEdit = (index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...(selectedCourse.modules || [])];
    updatedModules.splice(index, 1);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  };

  return {
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit
  };
};
