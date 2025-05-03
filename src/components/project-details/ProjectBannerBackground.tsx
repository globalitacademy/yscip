
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Edit, ImageIcon, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
  // Default fallback image if none provided
  const fallbackImage = 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop';
  const imageUrl = image || fallbackImage;
  
  // State for image URL input form
  const [showImageForm, setShowImageForm] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState(imageUrl);
  
  console.log("[ProjectBannerBackground] Rendering with image:", imageUrl);

  // Handle image URL change
  const handleImageSubmit = () => {
    if (!newImageUrl.trim()) {
      toast.error('Նկարի URL-ը չի կարող լինել դատարկ');
      return;
    }
    
    onImageChange(newImageUrl);
    setShowImageForm(false);
    toast.success('Նկարը հաջողությամբ փոխվել է');
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/30 to-indigo-900/40 opacity-70" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl transform -translate-x-1/4 -translate-y-1/4" />
      </div>
      
      {/* Enhanced gradient overlay - improved with stronger contrast and depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40 z-10" />
      
      {/* Image with subtle animation */}
      <div className="absolute inset-0 z-0 transform transition-all duration-700 hover:scale-105">
        {/* Display image */}
        <div className="w-full h-full">
          <img 
            src={imageUrl}
            alt="Project banner"
            className="w-full h-full object-cover transition-all duration-1000 hover:scale-105"
            onError={(e) => {
              console.error("Image failed to load, using fallback");
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=1920&auto=format&fit=crop';
            }}
          />
          {/* Noise texture overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] opacity-20" />
        </div>

        {/* Edit button for starting edit mode */}
        {canEdit && !isEditing && (
          <div className="absolute bottom-6 right-6 z-20">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditClick}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Խմբագրել նախագիծը
            </Button>
          </div>
        )}

        {/* Image edit controls when in edit mode */}
        {isEditing && (
          <div className="absolute top-6 right-6 z-20">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImageForm(true)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 flex items-center gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Փոխել ֆոնային նկարը
            </Button>
          </div>
        )}
        
        {/* Image URL input modal */}
        {showImageForm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Փոխել նկարի URL-ը</h3>
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mb-4"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowImageForm(false)}>
                  Չեղարկել
                </Button>
                <Button onClick={handleImageSubmit}>
                  Պահպանել
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBannerBackground;
