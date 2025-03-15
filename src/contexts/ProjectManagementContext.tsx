
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useProjectOperations } from '@/hooks/useProjectOperations';
import { useProjectEvents } from '@/components/projects/hooks/useProjectEvents';

// Define the context type
interface ProjectManagementContextType {
  // State
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
  
  // State setters
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
  
  // Actions
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

// Create the context with a default undefined value
const ProjectManagementContext = createContext<ProjectManagementContextType | undefined>(undefined);

// Provider props
interface ProjectManagementProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ProjectManagementProvider: React.FC<ProjectManagementProviderProps> = ({ children }) => {
  // State from ProjectManagement component
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({});
  
  // Use our custom hook for project operations
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
  
  // Set up real-time subscription to project changes
  useProjectEvents(setProjects);
  
  // Action handlers
  const handleDelete = async () => {
    if (!selectedProject) return;
    await deleteProject(selectedProject);
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  const handleChangeImage = async () => {
    if (!selectedProject) return;
    await updateProjectImage(selectedProject, newImageUrl);
    setIsImageDialogOpen(false);
    setNewImageUrl('');
    setSelectedProject(null);
  };

  const handleEditInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProject) return;
    await updateProject(selectedProject, editedProject);
    setIsEditDialogOpen(false);
    setEditedProject({});
    setSelectedProject(null);
  };

  const handleImageChangeInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setNewImageUrl(project.image || '');
    setIsImageDialogOpen(true);
  };

  const handleDeleteInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleProjectCreated = async (project: ProjectTheme) => {
    await createProject(project);
    setIsCreateDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  // Combine all values for the context
  const contextValue: ProjectManagementContextType = {
    // State
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
    
    // State setters
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
    
    // Actions
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
  };

  return (
    <ProjectManagementContext.Provider value={contextValue}>
      {children}
    </ProjectManagementContext.Provider>
  );
};

// Custom hook to use the project management context
export const useProjectManagement = () => {
  const context = useContext(ProjectManagementContext);
  if (context === undefined) {
    throw new Error('useProjectManagement must be used within a ProjectManagementProvider');
  }
  return context;
};
