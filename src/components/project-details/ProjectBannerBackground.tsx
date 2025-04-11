
import React from 'react';
import { cn } from '@/lib/utils';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/common/image-uploader/ImageUploader';

interface ProjectBannerBackgroundProps {
  image?: string;
  isEditing: boolean;
  canEdit: boolean;
  onImageChange: (url: string) => void;
  onEditClick: () => void;
}

const ProjectBannerBackground: React.FC<ProjectBannerBackgroundProps> = ({
  image,
  isEditing,
  canEdit,
  onImageChange,
  onEditClick
}) => {
  // Default image if none provided
  const imageUrl = image || 'https://source.unsplash.com/random/1600x900/?code';

  return (
    <div className="absolute inset-0 h-64 md:h-80">
      {isEditing ? (
        <ImageUploader
          currentImage={imageUrl}
          onImageChange={onImageChange}
          previewHeight="h-64 md:h-80"
          overlayMode={true}
        />
      ) : (
        <>
          <div className="h-full w-full bg-gradient-to-r from-primary/20 to-secondary/20">
            <img 
              src={imageUrl}
              alt="Project banner" 
              className="h-full w-full object-cover object-center opacity-60"
            />
          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/80"
            aria-hidden="true"
          ></div>
          
          {canEdit && (
            <Button 
              variant="outline" 
              size="sm"
              className="absolute right-4 top-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={onEditClick}
            >
              <Edit className="h-4 w-4 mr-1.5" /> Խմբագրել նկարը
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectBannerBackground;
