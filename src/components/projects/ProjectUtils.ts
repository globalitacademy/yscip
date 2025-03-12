
import { ProjectTheme } from '@/data/projectThemes';
import { toast } from 'sonner';

// Handle delete project
export const deleteProject = (
  projects: ProjectTheme[], 
  selectedProject: ProjectTheme,
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>
) => {
  const updatedProjects = projects.filter(project => project.id !== selectedProject.id);
  setProjects(updatedProjects);
  toast.success(`"${selectedProject.title}" նախագիծը հաջողությամբ ջնջվել է`);
  return updatedProjects;
};

// Handle change project image
export const changeProjectImage = (
  projects: ProjectTheme[], 
  selectedProject: ProjectTheme,
  newImageUrl: string,
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>
) => {
  if (!newImageUrl.trim()) return projects;
  
  const updatedProjects = projects.map(project => {
    if (project.id === selectedProject.id) {
      return { ...project, image: newImageUrl.trim() };
    }
    return project;
  });
  
  setProjects(updatedProjects);
  toast.success(`"${selectedProject.title}" նախագծի նկարը հաջողությամբ թարմացվել է`);
  return updatedProjects;
};

// Handle save edited project
export const saveEditedProject = (
  projects: ProjectTheme[], 
  selectedProject: ProjectTheme,
  editedProject: Partial<ProjectTheme>,
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>
) => {
  if (!editedProject.title?.trim()) return projects;
  
  const updatedProjects = projects.map(project => {
    if (project.id === selectedProject.id) {
      return { 
        ...project, 
        title: editedProject.title?.trim() || project.title,
        description: editedProject.description?.trim() || project.description,
        category: editedProject.category?.trim() || project.category
      };
    }
    return project;
  });
  
  setProjects(updatedProjects);
  toast.success(`"${selectedProject.title}" նախագիծը հաջողությամբ թարմացվել է`);
  return updatedProjects;
};

// Filter projects based on search query
export const filterProjects = (projects: ProjectTheme[], searchQuery: string) => {
  return projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
