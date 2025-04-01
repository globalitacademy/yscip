
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useProjectOperations } from '@/hooks/useProjectOperations';
import { useProjectEvents } from '@/components/projects/hooks/useProjectEvents';
import { useProjectFilters } from '@/hooks/project/useProjectFilters';
import { useProjectOperations as useProjectInitOperations } from '@/hooks/project/useProjectOperations';
import { useProjectDialogs } from '@/hooks/project/useProjectDialogs';

interface ProjectManagementContextType {
  searchQuery: string;
  selectedCategory: string | null;
  selectedProject: ProjectTheme | null;
  isDeleteDialogOpen: boolean;
  isImageDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isCreateDialogOpen: boolean;
  newImageUrl: string;
  editedProject: Partial<ProjectTheme>;
  projects: ProjectTheme[];
  isLoading: boolean;
  
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedProject: (project: ProjectTheme | null) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setIsImageDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsCreateDialogOpen: (isOpen: boolean) => void;
  setNewImageUrl: (url: string) => void;
  setEditedProject: (project: Partial<ProjectTheme>) => void;
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>;
  
  loadProjects: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleChangeImage: () => Promise<void>;
  handleSaveEdit: () => Promise<void>;
  handleEditInit: (project: ProjectTheme) => void;
  handleImageChangeInit: (project: ProjectTheme) => void;
  handleDeleteInit: (project: ProjectTheme) => void;
  handleProjectCreated: (project: ProjectTheme) => Promise<void>;
  handleOpenCreateDialog: () => void;
  updateProject: (project: ProjectTheme, updates: Partial<ProjectTheme>) => Promise<boolean>;
  updateProjectImage: (project: ProjectTheme, imageUrl: string) => Promise<boolean>;
  deleteProject: (project: ProjectTheme) => Promise<boolean>;
  createProject: (project: ProjectTheme) => Promise<boolean>;
}

const ProjectManagementContext = createContext<ProjectManagementContextType | undefined>(undefined);

interface ProjectManagementProviderProps {
  children: ReactNode;
}

export const ProjectManagementProvider: React.FC<ProjectManagementProviderProps> = ({ children }) => {
  // State management
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({});
  
  // Hooks
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory
  } = useProjectFilters();
  
  const {
    projects,
    setProjects,
    isLoading,
    loadProjects,
    updateProject,
    updateProjectImage,
    deleteProject,
    createProject
  } = useProjectOperations();
  
  // Listen for project events
  useProjectEvents(setProjects);
  
  // Project operations
  const {
    handleEditInit,
    handleImageChangeInit,
    handleDeleteInit,
    handleOpenCreateDialog
  } = useProjectInitOperations(
    setSelectedProject,
    setEditedProject,
    setIsEditDialogOpen,
    setNewImageUrl,
    setIsImageDialogOpen,
    setIsDeleteDialogOpen,
    setIsCreateDialogOpen
  );
  
  // Dialog handlers
  const {
    handleDelete,
    handleChangeImage,
    handleSaveEdit,
    handleProjectCreated
  } = useProjectDialogs(
    selectedProject,
    newImageUrl,
    editedProject,
    deleteProject,
    updateProject,
    updateProjectImage,
    createProject,
    setIsDeleteDialogOpen,
    setIsImageDialogOpen,
    setIsEditDialogOpen,
    setIsCreateDialogOpen,
    setSelectedProject,
    setNewImageUrl,
    setEditedProject
  );

  const contextValue = useMemo(() => ({
    searchQuery,
    selectedCategory,
    selectedProject,
    isDeleteDialogOpen,
    isImageDialogOpen,
    isEditDialogOpen,
    isCreateDialogOpen,
    newImageUrl,
    editedProject,
    projects,
    isLoading,
    
    setSearchQuery,
    setSelectedCategory,
    setSelectedProject,
    setIsDeleteDialogOpen,
    setIsImageDialogOpen,
    setIsEditDialogOpen,
    setIsCreateDialogOpen,
    setNewImageUrl,
    setEditedProject,
    setProjects,
    
    loadProjects,
    handleDelete,
    handleChangeImage,
    handleSaveEdit,
    handleEditInit,
    handleImageChangeInit,
    handleDeleteInit,
    handleProjectCreated,
    handleOpenCreateDialog,
    updateProject,
    updateProjectImage,
    deleteProject,
    createProject
  }), [
    searchQuery, selectedCategory, selectedProject, isDeleteDialogOpen, 
    isImageDialogOpen, isEditDialogOpen, isCreateDialogOpen, newImageUrl, 
    editedProject, projects, isLoading, loadProjects, handleDelete, 
    handleChangeImage, handleSaveEdit, handleEditInit, handleImageChangeInit, 
    handleDeleteInit, handleProjectCreated, handleOpenCreateDialog, 
    updateProject, updateProjectImage, deleteProject, createProject,
    setSearchQuery, setSelectedCategory, setSelectedProject, setIsDeleteDialogOpen,
    setIsImageDialogOpen, setIsEditDialogOpen, setIsCreateDialogOpen, 
    setNewImageUrl, setEditedProject, setProjects
  ]);

  return (
    <ProjectManagementContext.Provider value={contextValue}>
      {children}
    </ProjectManagementContext.Provider>
  );
};

export const useProjectManagement = () => {
  const context = useContext(ProjectManagementContext);
  if (context === undefined) {
    throw new Error('useProjectManagement must be used within a ProjectManagementProvider');
  }
  return context;
};
