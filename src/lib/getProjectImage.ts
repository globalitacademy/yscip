import { ProjectTheme } from '@/data/projectThemes';

export const getProjectImage = (project: ProjectTheme): string => {
  if (!project.image) {
    return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category || 'project')}`;
  }
  
  // If it's a full URL (starts with http or https), use it directly
  if (project.image.startsWith('http://') || project.image.startsWith('https://')) {
    return project.image;
  }
  
  // Otherwise, assume it's a relative path and prepend the base URL
  return project.image;
};
