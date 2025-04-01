
import React, { createContext, useContext, useState } from 'react';

// Define the type for project context
interface ProjectContextType {
  projectId: number;
  project: any;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  canEdit: boolean;
}

// Create the context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider props interface
interface ProjectProviderProps {
  children: React.ReactNode;
  projectId: number;
  initialProject: any;
  canEdit?: boolean;
}

// Create a provider component
export const ProjectProvider: React.FC<ProjectProviderProps> = ({ 
  children, 
  projectId, 
  initialProject,
  canEdit = false 
}) => {
  const [project, setProject] = useState(initialProject);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ProjectContext.Provider value={{ 
      projectId, 
      project, 
      isEditing, 
      setIsEditing,
      canEdit 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Hook for using the project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
