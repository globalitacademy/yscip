
import { ProjectTheme } from '@/data/projectThemes';

// This function provides consistent placeholder images based on project category
export function getProjectImage(project: ProjectTheme): string {
  // First check if the project has a specific image defined
  if (project.image && project.image.trim() !== '') {
    return project.image;
  }
  
  // Default fallback based on category
  const categoryPlaceholders: Record<string, string> = {
    'Վեբ ծրագրավորում': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'Մոբայլ հավելվածներ': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'Արհեստական բանականություն': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'Կիբեռանվտանգություն': 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'Գեյմինգ': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    'Տվյալների վերլուծություն': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  };
  
  // Return category-specific placeholder or default
  return categoryPlaceholders[project.category] || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
}
