import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import ImageUploader from '../common/image-uploader/ImageUploader';
import { ScaleIn } from '@/components/LocalTransitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Image as ImageIcon, Link } from 'lucide-react';
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
  const [showImageUrl, setShowImageUrl] = useState(false);
  const [imageUrl, setImageUrl] = useState(image || '');

  // Log state for debugging
  useEffect(() => {
    if (isEditing) {
      console.log("EDIT MODE ACTIVE in ProjectBannerBackground");
      console.log("Can edit:", canEdit);
    }
  }, [isEditing, canEdit]);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleImageUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast.error('Նկարի URL-ն չի կարող լինել դատարկ');
      return;
    }
    onImageChange(imageUrl);
    toast.success('Նկարի URL-ն հաջողությամբ փոխվել է');
    setShowImageUrl(false);
  };

  // Update local state when prop changes
  useEffect(() => {
    setImageUrl(image || '');
  }, [image]);

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
        {/* URL editing interface - shown only when in edit mode and URL editing is active */}
        {isEditing && canEdit && showImageUrl ? (
          <div className="absolute inset-0 z-[100] flex items-center justify-center">
            <div className="w-full max-w-2xl mx-4 bg-black/90 p-6 rounded-lg backdrop-blur-md border border-white/30 shadow-xl">
              <h3 className="text-white text-xl font-medium mb-4">Փոխել նկարի URL-ն</h3>
              <div className="flex flex-col gap-3">
                <label className="text-white text-sm">Նկարի URL</label>
                <Input 
                  value={imageUrl} 
                  onChange={handleImageUrlChange} 
                  className="bg-black/60 border-white/50 text-white" 
                  placeholder="https://example.com/image.jpg"
                  autoFocus
                />
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={handleImageUrlSubmit} 
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Պահպանել
                  </Button>
                  <Button 
                    onClick={() => setShowImageUrl(false)} 
                    variant="outline" 
                    className="bg-red-500/10 hover:bg-red-500/20 text-white border-red-500/30"
                  >
                    Չեղարկել
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Display image for everyone - now more consistent */}
        <div className="w-full h-full">
          <img 
            src={image || 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop'}
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

        {/* Keep the ImageUploader for edit mode but hide it for now */}
        {canEdit && isEditing && (
          <div className="hidden">
            <ScaleIn delay="delay-200">
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
            </ScaleIn>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBannerBackground;
