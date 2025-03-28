
import { useCallback } from 'react';
import { Course } from '../types';

export const useCourseModuleManagement = (
  selectedCourse: Course | null,
  setSelectedCourse: React.Dispatch<React.SetStateAction<Course | null>>,
  newCourse: Partial<Course>,
  setNewCourse: React.Dispatch<React.SetStateAction<Partial<Course>>>,
  newModule: string,
  setNewModule: React.Dispatch<React.SetStateAction<string>>
) => {
  const handleAddModule = useCallback(() => {
    if (!newModule) return;
    setNewCourse({
      ...newCourse,
      modules: [...(newCourse.modules || []), newModule]
    });
    setNewModule('');
  }, [newModule, newCourse, setNewCourse, setNewModule]);

  const handleRemoveModule = useCallback((index: number) => {
    const updatedModules = [...(newCourse.modules || [])];
    updatedModules.splice(index, 1);
    setNewCourse({
      ...newCourse,
      modules: updatedModules
    });
  }, [newCourse, setNewCourse]);

  const handleAddModuleToEdit = useCallback(() => {
    if (!newModule || !selectedCourse) return;
    setSelectedCourse({
      ...selectedCourse,
      modules: [...selectedCourse.modules, newModule]
    });
    setNewModule('');
  }, [newModule, selectedCourse, setSelectedCourse, setNewModule]);

  const handleRemoveModuleFromEdit = useCallback((index: number) => {
    if (!selectedCourse) return;
    const updatedModules = [...selectedCourse.modules];
    updatedModules.splice(index, 1);
    setSelectedCourse({
      ...selectedCourse,
      modules: updatedModules
    });
  }, [selectedCourse, setSelectedCourse]);

  return {
    handleAddModule,
    handleRemoveModule,
    handleAddModuleToEdit,
    handleRemoveModuleFromEdit
  };
};
