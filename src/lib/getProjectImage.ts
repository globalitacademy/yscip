import { ProjectTheme } from '@/data/projectThemes';

/**
 * Gets a reliable image URL for a project
 * Returns the project's image if available, or generates a fallback
 */
export const getProjectImage = (project: ProjectTheme): string => {
  // If the project has an image, use it
  if (project.image) {
    return project.image;
  }
  
  // Otherwise, generate a fallback image based on the project category
  return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category || 'project')}`;
};
