import * as lucideIcons from 'lucide-react';

export const getIconComponent = (iconType: string | null) => {
  if (!iconType) return null;
  
  try {
    // These lines had the TS18047 errors - adding null checks
    if (iconType && lucideIcons[iconType]) {
      const IconComponent = lucideIcons[iconType];
      return IconComponent;
    }
    
    if (iconType) {
      console.warn(`Icon type "${iconType}" not found in lucide-react icons`);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting icon component:', error);
    return null;
  }
};
