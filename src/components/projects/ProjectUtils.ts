
import { ProjectTheme } from "@/data/projectThemes";

// Delete a project
export const deleteProject = (
  projects: ProjectTheme[], 
  selectedProject: ProjectTheme, 
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>
) => {
  const updatedProjects = projects.filter(
    (project) => project.id !== selectedProject.id
  );
  setProjects(updatedProjects);
};

// Change a project image
export const changeProjectImage = (
  projects: ProjectTheme[],
  selectedProject: ProjectTheme,
  newImageUrl: string,
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>
) => {
  const updatedProjects = projects.map((project) => {
    if (project.id === selectedProject.id) {
      return { ...project, image: newImageUrl };
    }
    return project;
  });
  setProjects(updatedProjects);
};

// Save edited project
export const saveEditedProject = (
  projects: ProjectTheme[],
  selectedProject: ProjectTheme,
  editedProject: Partial<ProjectTheme>,
  setProjects: React.Dispatch<React.SetStateAction<ProjectTheme[]>>
) => {
  const updatedProjects = projects.map((project) => {
    if (project.id === selectedProject.id) {
      return { ...project, ...editedProject };
    }
    return project;
  });
  setProjects(updatedProjects);
};

// Filter projects by search query
export const filterProjects = (
  projects: ProjectTheme[], 
  searchQuery: string,
  selectedCategory: string | null = null
) => {
  let filtered = projects;
  
  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(project => 
      project.title?.toLowerCase().includes(query) || 
      project.description?.toLowerCase().includes(query) ||
      (project.category && project.category.toLowerCase().includes(query))
    );
  }
  
  // Filter by selected category
  if (selectedCategory) {
    filtered = filtered.filter(project => project.category === selectedCategory);
  }
  
  return filtered;
};

// Get unique categories from projects
export const getUniqueCategories = (projects: ProjectTheme[]) => {
  const categories = projects.map(project => project.category).filter(Boolean);
  return Array.from(new Set(categories)).sort();
};
