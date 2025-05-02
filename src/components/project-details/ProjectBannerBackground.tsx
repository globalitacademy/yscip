
import React from 'react';
import { cn } from '@/lib/utils';
import ImageUploader from '../common/image-uploader/ImageUploader';

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
  return (
    <div className="absolute inset-0 z-0">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent z-10" />
      
      {/* Image */}
      <div className="absolute inset-0 z-0">
        {canEdit ? (
          <ImageUploader
            currentImage={image || '/placeholder-banner.jpg'}
            onImageChange={onImageChange}
            previewHeight="h-full"
            placeholder="Սեղմեք նկար ներբեռնելու համար"
            rounded={false}
            disabled={!isEditing}
            showEditButton={canEdit}
            overlayMode={true}
          />
        ) : (
          <div className="w-full h-full">
            <img 
              src={image || '/placeholder-banner.jpg'} 
              alt="Project banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x400?text=Նախագծի+եզրագիծ';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBannerBackground;
