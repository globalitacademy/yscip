import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useProjectOperations } from '@/hooks/useProjectOperations';
import { useProjectEvents } from '@/components/projects/hooks/useProjectEvents';
import { useQueryClient } from '@tanstack/react-query';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({});
  
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
  
  useProjectEvents(setProjects);
  
  const queryClient = useQueryClient();
  
  const handleDelete = useCallback(async () => {
    if (!selectedProject) return;
    await deleteProject(selectedProject);
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [selectedProject, deleteProject, queryClient]);

  const handleChangeImage = useCallback(async () => {
    if (!selectedProject) return;
    await updateProjectImage(selectedProject, newImageUrl);
    setIsImageDialogOpen(false);
    setNewImageUrl('');
    setSelectedProject(null);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [selectedProject, newImageUrl, updateProjectImage, queryClient]);

  const handleEditInit = useCallback((project: ProjectTheme) => {
    setSelectedProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      detailedDescription: project.detailedDescription || '',
      category: project.category,
      complexity: project.complexity || 'Միջին',
      duration: project.duration || '',
      techStack: project.techStack || [],
      steps: project.steps || [],
      prerequisites: project.prerequisites || [],
      learningOutcomes: project.learningOutcomes || [],
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!selectedProject) return;
    await updateProject(selectedProject, editedProject);
    setIsEditDialogOpen(false);
    setEditedProject({});
    setSelectedProject(null);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [selectedProject, editedProject, updateProject, queryClient]);

  const handleImageChangeInit = useCallback((project: ProjectTheme) => {
    setSelectedProject(project);
    setNewImageUrl(project.image || '');
    setIsImageDialogOpen(true);
  }, []);

  const handleDeleteInit = useCallback((project: ProjectTheme) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleProjectCreated = useCallback(async (project: ProjectTheme) => {
    await createProject(project);
    setIsCreateDialogOpen(false);
    
    queryClient.invalidateQueries({ queryKey: ['projects'] });
  }, [createProject, queryClient]);

  const handleOpenCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

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
    updateProject, updateProjectImage, deleteProject, createProject
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
