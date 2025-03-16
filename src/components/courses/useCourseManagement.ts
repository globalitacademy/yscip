
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCourseOperations } from './hooks/useCourseOperations';
import { useProfessionalCourseOperations } from './hooks/useProfessionalCourseOperations';
import { mockSpecializations } from './utils/mockData';

export { mockSpecializations };

export const useCourseManagement = () => {
  const { user } = useAuth();
  const courseOps = useCourseOperations();
  const professionalCourseOps = useProfessionalCourseOperations();
  const [newModule, setNewModule] = useState('');

  return {
    // Basic courses operations
    ...courseOps,
    
    // Professional courses operations
    ...professionalCourseOps,
    
    // Shared module state (used by both course types)
    newModule,
    setNewModule
  };
};
