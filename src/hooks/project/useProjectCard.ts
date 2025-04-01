
import { useCallback } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { useAuth } from '@/contexts/AuthContext';
import { getProjectImage } from '@/lib/getProjectImage';

export const useProjectCard = (
  project: ProjectTheme,
  handleEditInit?: (project: ProjectTheme) => void,
  handleImageChangeInit?: (project: ProjectTheme) => void,
  handleDeleteInit?: (project: ProjectTheme) => void,
  adminView = false
) => {
  const { user } = useAuth();
  
  // Check if the project was created by the current user
  const isCreatedByCurrentUser = project.createdBy === user?.id;
  const creatorName = isCreatedByCurrentUser ? 'Ձեր կողմից' : 'Ուսումնական Կենտրոն';
  
  // Get the project image URL
  const imageUrl = getProjectImage(project);
  
  // Memoize event handlers to prevent unnecessary re-renders
  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project detail
    e.stopPropagation(); // Prevent event bubbling
    if (handleEditInit) handleEditInit(project);
  }, [handleEditInit, project]);

  const handleImageChange = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project detail
    e.stopPropagation(); // Prevent event bubbling
    if (handleImageChangeInit) handleImageChangeInit(project);
  }, [handleImageChangeInit, project]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project detail
    e.stopPropagation(); // Prevent event bubbling
    if (handleDeleteInit) handleDeleteInit(project);
  }, [handleDeleteInit, project]);
  
  // Function to handle image error and provide fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category || 'project')}`;
  };

  return {
    isCreatedByCurrentUser,
    creatorName,
    imageUrl,
    handleEdit,
    handleImageChange,
    handleDelete,
    handleImageError
  };
};
