
import React from 'react';
import { Theme } from '../../hooks/useThemeDetail';

interface ImageContentProps {
  theme: Theme;
}

const ImageContent: React.FC<ImageContentProps> = ({ theme }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img 
          src={theme.image_url} 
          alt={theme.title} 
          className="w-full h-auto"
        />
        <div className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            {theme.title} - Ուսումնական գրաֆիկական նյութ
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageContent;
