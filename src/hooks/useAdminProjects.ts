
import { useState, useCallback } from 'react';
import { projectThemes, ProjectTheme } from '@/data/projectThemes';
import { toast } from "@/components/ui/use-toast";

export const useAdminProjects = () => {
  const [displayLimit, setDisplayLimit] = useState(12);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Get categories from project themes
  const allProjects = [...projectThemes];
  const categories = ["all", ...new Set(allProjects.map(project => project.category))];
  
  // Filter projects by category and status
  const getFilteredProjects = useCallback(() => {
    let filtered = [...projectThemes];
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(project => project.category === activeCategory);
    }
    
    // No status filtering for now as status field doesn't exist in ProjectTheme yet
    
    return filtered;
  }, [activeCategory]);
  
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
    setActiveCategory,
    setFilterStatus,
    setDisplayLimit,
    loadMore,
    handleSelectProject,
    handleAssignProject,
    handleApproveProject,
    setIsAssignDialogOpen,
    setIsApproveDialogOpen
  };
};
