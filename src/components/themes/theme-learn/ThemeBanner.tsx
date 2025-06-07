
import React from 'react';
import { Theme } from '../hooks/useThemeDetail';

interface ThemeBannerProps {
  theme: Theme;
}

const ThemeBanner: React.FC<ThemeBannerProps> = ({ theme }) => {
  if (!theme.banner_image_url && !theme.image_url) {
    return null;
  }

  const bannerImage = theme.banner_image_url || theme.image_url;

  return (
    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8">
      <img 
        src={bannerImage} 
        alt={theme.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <h2 className="text-xl font-semibold">{theme.title}</h2>
        <p className="text-sm opacity-90">{theme.category}</p>
      </div>
    </div>
  );
};

export default ThemeBanner;
