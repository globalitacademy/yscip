
import React from 'react';
import { Label } from '@/components/ui/label';
import ImageUploader from '@/components/common/image-uploader';
import { Theme } from '../../hooks/useThemeManagement';

interface ThemeImagesProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeImages: React.FC<ThemeImagesProps> = ({ theme, setTheme }) => {
  const handleMainImageChange = (imageUrl: string) => {
    setTheme({ ...theme, image_url: imageUrl });
  };

  const handleBannerImageChange = (imageUrl: string) => {
    setTheme({ ...theme, banner_image_url: imageUrl });
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Հիմնական նկար</Label>
        <ImageUploader
          currentImage={theme.image_url}
          onImageChange={handleMainImageChange}
          placeholder="Կցել հիմնական նկար"
          aspectRatio={16/9}
        />
        <p className="text-xs text-muted-foreground">
          Թեմայի քարտի վրա ցուցադրվող նկար
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>Բաներ</Label>
        <ImageUploader
          currentImage={theme.banner_image_url}
          onImageChange={handleBannerImageChange}
          placeholder="Կցել բաներ"
          aspectRatio={21/9}
        />
        <p className="text-xs text-muted-foreground">
          Թեմայի էջի վերևի հատվածում ցուցադրվող մեծ նկար
        </p>
      </div>
    </div>
  );
};

export default ThemeImages;
