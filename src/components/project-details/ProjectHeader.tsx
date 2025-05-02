import React, { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderBanner from './ProjectHeaderBanner';

const ProjectHeader: React.FC = () => {
  const { project, isEditing, canEdit, updateProject } = useProject();
  const [localImage, setLocalImage] = useState<string | null>(null);

  // Enhanced logging for debugging
  useEffect(() => {
    console.log("[ProjectHeader] Component mounted or updated");
    console.log("- isEditing:", isEditing);
    console.log("- canEdit:", canEdit);
    console.log("- project:", project);
    
    if (project && project.image) {
      console.log("- Current project image URL:", project.image);
      // Keep local image in sync with project image
      setLocalImage(project.image);
    }
  }, [isEditing, canEdit, project]);

  // Handle image update directly from this component
  const handleImageUpdate = async (newImageUrl: string) => {
    console.log("[ProjectHeader] Updating image to:", newImageUrl);
    setLocalImage(newImageUrl); // Update local state immediately for UI
    
    if (project && project.id) {
      console.log("[ProjectHeader] Calling updateProject with image:", newImageUrl);
      try {
        // Force update the project image in the database
        const success = await updateProject({ image: newImageUrl });
        console.log("[ProjectHeader] Image update result:", success);
      } catch (error) {
        console.error("[ProjectHeader] Error updating image:", error);
      }
    }
  };

  if (!project) {
    console.log("[ProjectHeader] No project data available");
    return null;
  }
  
  // Pass both project image and local image to ensure we're showing the most recent one
  const effectiveImage = localImage || project.image;
  console.log("[ProjectHeader] Rendering with image:", effectiveImage);
  
  return (
    <ProjectHeaderBanner 
      project={{...project, image: effectiveImage}} 
      isEditing={isEditing || false}
      onImageChange={handleImageUpdate}
    />
  );
};

export default ProjectHeader;
