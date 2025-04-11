
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, X } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import { getFormattedImageUrl, handleImageError } from '@/utils/imageUtils';

interface ProjectHeaderBannerProps {
  project: ProjectTheme;
  isEditing: boolean;
  onSave?: (updatedBanner: string) => void;
  onCancel?: () => void;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({
  project,
  isEditing,
  onSave,
  onCancel
}) => {
  const [bannerUrl, setBannerUrl] = useState(
    project.bannerImage || project.image || '/placeholder-banner.jpg'
  );
  const [editMode, setEditMode] = useState(false);
  const [tempBannerUrl, setTempBannerUrl] = useState('');

  // Get formatted URL for banner image
  const formattedBannerUrl = getFormattedImageUrl(bannerUrl, project.category);

  // Handle start editing
  const handleStartEdit = () => {
    setTempBannerUrl(bannerUrl);
    setEditMode(true);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setEditMode(false);
    setBannerUrl(tempBannerUrl);
    if (onCancel) {
      onCancel();
    }
  };

  // Handle save changes
  const handleSaveChanges = () => {
    setEditMode(false);
    if (onSave) {
      onSave(bannerUrl);
    }
  };

  // Handle banner image error
  const handleBannerError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    handleImageError(event, project.category);
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerUrl(e.target.value);
  };

  return (
    <div className="relative w-full">
      <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden relative">
        <img
          src={formattedBannerUrl}
          alt={`${project.title} banner`}
          className="w-full h-full object-cover"
          onError={handleBannerError}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 drop-shadow-md">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies && project.technologies.length > 0 ? (
              project.technologies.slice(0, 3).map((tech, index) => (
                <span 
                  key={index} 
                  className="bg-primary/70 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full"
                >
                  {tech}
                </span>
              ))
            ) : null}
            
            {project.technologies && project.technologies.length > 3 && (
              <span className="bg-gray-700/70 backdrop-blur-sm text-white px-2 py-1 text-xs rounded-full">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="absolute top-4 right-4 flex space-x-2">
          {editMode ? (
            <>
              <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <input
                  type="text"
                  value={bannerUrl}
                  onChange={handleUrlChange}
                  className="w-64 px-3 py-1 border border-gray-300 rounded text-sm text-gray-800"
                  placeholder="Enter image URL"
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                    className="bg-white/80"
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSaveChanges}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <Button
              onClick={handleStartEdit}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm"
            >
              <Edit size={16} className="mr-1" /> Change Banner
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectHeaderBanner;
