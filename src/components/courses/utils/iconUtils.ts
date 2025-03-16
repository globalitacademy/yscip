
import React from 'react';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';

// Helper function to safely extract icon name
export const getIconName = (icon: React.ReactElement | undefined): string => {
  if (!icon || !icon.type) {
    return 'Code';
  }
  
  // Handle different ways to access the name property
  const iconType = icon.type as any;
  if (typeof iconType === 'object' && iconType.name) {
    return iconType.name;
  } else if (typeof iconType === 'function' && iconType.name) {
    return iconType.name;
  }
  
  return 'Code'; // Default fallback
};

// Function to get icon component by name
export const getIconComponent = (iconName: string, className: string = "w-16 h-16"): React.ReactElement => {
  const iconMap: Record<string, React.FC<any>> = {
    Code,
    BookText,
    BrainCircuit,
    Database,
    FileCode,
    Globe
  };

  const IconComponent = iconMap[iconName] || Code;
  return React.createElement(IconComponent, { className });
};
