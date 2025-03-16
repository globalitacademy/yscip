
import { useState } from 'react';
import { projectThemes, ProjectTheme } from '@/data/projectThemes';
import { toast } from "@/components/ui/use-toast";
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

export const useAdminProjects = () => {
  const [displayLimit, setDisplayLimit] = useState(12);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Get the project management context
  const projectManagement = useProjectManagement();
  
  // Get categories from project themes
  const categories = ["all", ...new Set(projectThemes.map(project => project.category))];
  
  // Filter projects by category and status
  const getFilteredProjects = () => {
    let filtered = [...projectThemes];
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(project => project.category === activeCategory);
    }
    
    // Additional status filtering
    if (filterStatus === "assigned") {
      filtered = filtered.filter(project => project.status === "assigned");
    } else if (filterStatus === "pending") {
      filtered = filtered.filter(project => project.status === "pending");
    } else if (filterStatus === "approved") {
      filtered = filtered.filter(project => project.status === "approved");
    }
    
    return filtered;
  };
  
  const filteredProjects = getFilteredProjects();
  const visibleProjects = filteredProjects.slice(0, displayLimit);
  
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, filteredProjects.length));
  };
  
  const hasMore = displayLimit < filteredProjects.length;
  
  const handleAssignProject = () => {
    if (selectedProject) {
      // Placeholder for actual assignment functionality
      toast({
        title: "Նախագիծը նշանակված է",
        description: `"${selectedProject.title}" նախագիծը հաջողությամբ նշանակվել է։`
      });
      setIsAssignDialogOpen(false);
      setSelectedProject(null);
    }
  };
  
  const handleApproveProject = () => {
    if (selectedProject) {
      // Placeholder for actual approval functionality
      toast({
        title: "Նախագիծը հաստատված է",
        description: `"${selectedProject.title}" նախագիծը հաջողությամբ հաստատվել է։`
      });
      setIsApproveDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const handleSelectProject = (project: ProjectTheme, action: 'assign' | 'approve') => {
    setSelectedProject(project);
    if (action === 'assign') {
      setIsAssignDialogOpen(true);
    } else if (action === 'approve') {
      setIsApproveDialogOpen(true);
    }
  };

  const handleEditProject = (project: ProjectTheme) => {
    setSelectedProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
    });
    setIsEditDialogOpen(true);
    
    // If we have the project management context, use it too
    if (projectManagement && projectManagement.handleEditInit) {
      projectManagement.handleEditInit(project);
    }
    
    console.log("Edit project:", project);
  };

  const handleSaveEdit = () => {
    if (selectedProject && editedProject) {
      // Update the project in the local state
      const updatedProjects = projectThemes.map(p => 
        p.id === selectedProject.id ? { ...p, ...editedProject } : p
      );
      
      // If using the context, update there too
      if (projectManagement && projectManagement.updateProject) {
        projectManagement.updateProject(selectedProject, editedProject);
      }
      
      // Close the dialog and reset state
      setIsEditDialogOpen(false);
      setSelectedProject(null);
      setEditedProject({});
      
      toast({
        title: "Նախագիծը թարմացված է",
        description: `"${selectedProject.title}" նախագիծը հաջողությամբ թարմացվել է։`
      });
    }
  };

  const handleImageChange = (project: ProjectTheme) => {
    setSelectedProject(project);
    
    // If using the project management context
    if (projectManagement && projectManagement.handleImageChangeInit) {
      projectManagement.handleImageChangeInit(project);
    }
    
    console.log("Change image for project:", project);
  };

  const handleDeleteProject = (project: ProjectTheme) => {
    setSelectedProject(project);
    
    // If using the project management context
    if (projectManagement && projectManagement.handleDeleteInit) {
      projectManagement.handleDeleteInit(project);
    }
    
    console.log("Delete project:", project);
  };

  return {
    visibleProjects,
    filteredProjects,
    activeCategory,
    filterStatus,
    categories,
    displayLimit,
    hasMore,
    selectedProject,
    isAssignDialogOpen,
    isApproveDialogOpen,
    isEditDialogOpen,
    editedProject,
    setActiveCategory,
    setFilterStatus,
    setDisplayLimit,
    loadMore,
    handleSelectProject,
    handleAssignProject,
    handleApproveProject,
    handleEditProject,
    handleSaveEdit,
    handleImageChange,
    handleDeleteProject,
    setIsAssignDialogOpen,
    setIsApproveDialogOpen,
    setIsEditDialogOpen,
    setEditedProject
  };
};
