
import React from 'react';
import { Theme } from '../hooks/useThemeDetail';

interface ThemeBannerProps {
  theme: Theme;
}

const ThemeBanner: React.FC<ThemeBannerProps> = ({ theme }) => {
  if (!theme.banner_image_url) return null;
  
  return (
    <div className="mb-8 rounded-lg overflow-hidden">
      <img 
        src={theme.banner_image_url} 
        alt={theme.title} 
        className="w-full h-auto object-cover max-h-80"
      />
    </div>
  );
};

export default ThemeBanner;
