
import React from 'react';
import { getProjectImage } from '@/lib/getProjectImage';
import { ProjectTheme } from '@/data/projectThemes';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

interface ProjectBannerBackgroundProps {
  image: string;
  isEditing: boolean;
  canEdit: boolean;
  onImageChange: (url: string) => void;
  onEditClick?: () => void;
}

const ProjectBannerBackground: React.FC<ProjectBannerBackgroundProps> = ({ 
  image, 
  isEditing, 
  canEdit,
  onImageChange,
  onEditClick
}) => {
  const { theme } = useTheme();
  const [isChangingImage, setIsChangingImage] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(image || '');
  
  // Handle image input change
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    if (newUrl) {
      onImageChange(newUrl);
    }
  };
  
  // Toggle image input
  const toggleImageInput = () => {
    setIsChangingImage(!isChangingImage);
    if (!isChangingImage) {
      // Reset to current image when opening the input
      setImageUrl(image);
    }
  };
  
  return (
    <div className="relative">
      {/* Banner background image */}
      <div
        className="absolute top-0 left-0 w-full h-64 md:h-80 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.75)), url(${image || '/placeholder-banner.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay for editing the image */}
      {isEditing && canEdit && (
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          {isChangingImage ? (
            <div className={`flex items-center gap-2 p-2 rounded-md ${
              theme === 'dark' 
                ? 'bg-gray-800/80 border-gray-700/60' 
                : 'bg-white/80 border-gray-300/60'
              } backdrop-blur-sm border`}
            >
              <input
                type="text"
                value={imageUrl}
                onChange={handleImageInputChange}
                placeholder="Enter image URL..."
                className={`px-3 py-1 text-sm rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'bg-white border-gray-300 text-gray-800'
                  } w-64`}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={toggleImageInput}
                className={
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-white border-gray-300 hover:bg-gray-100'
                }
              >
                Done
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={toggleImageInput}
              className="bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30"
            >
              <Camera className="h-4 w-4 mr-2" /> Change Banner
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectBannerBackground;
