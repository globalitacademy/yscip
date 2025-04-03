
import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import ImageUploader from '@/components/common/ImageUploader';
import { cn } from '@/lib/utils';

interface ProjectBannerBackgroundProps {
  image?: string;
  isEditing: boolean;
  canEdit: boolean;
  onImageChange: (imageUrl: string) => void;
  onEditClick?: () => void;
}

const ProjectBannerBackground: React.FC<ProjectBannerBackgroundProps> = ({
  image,
  isEditing,
  canEdit,
  onImageChange,
  onEditClick
}) => {
  // Default image if none is provided
  const backgroundImage = image 
    ? `url(${image})` 
    : 'url(https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070)';

  if (isEditing) {
    return (
      <ImageUploader
        currentImage={image || backgroundImage.replace(/^url\(["']?|["']?\)$/g, '')}
        onImageChange={onImageChange}
        previewHeight="h-64"
        overlayMode={true}
        className="w-full"
      />
    );
  }

  return (
    <div className="relative">
      <div 
        className="absolute inset-0 h-64 bg-cover bg-center"
        style={{ backgroundImage }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
      </div>
      
      {/* Add image edit button when not in editing mode but user can edit */}
      {canEdit && !isEditing && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (onEditClick) onEditClick();
          }}
          className="absolute top-4 right-20 z-10 bg-white/80 hover:bg-white/100 p-2 rounded-full shadow-md transition-colors"
          title="Փոխել նկարը"
        >
          <Edit size={16} />
        </button>
      )}
    </div>
  );
};

export default ProjectBannerBackground;
