
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';
import React, { ReactElement } from 'react';

// Helper function to get icon name from component
export const getIconNameFromComponent = (icon: React.ReactElement): string => {
  if (!icon || !icon.type) return 'book';
  
  // Use a safer approach to get the icon type name
  let iconTypeName = 'book';
  
  if (typeof icon.type === 'function') {
    // For function components, try to get the name property
    iconTypeName = icon.type.name || 'book';
  } else if (typeof icon.type === 'object') {
    // For object components, try a different approach
    iconTypeName = String(icon.type) || 'book';
  } else if (typeof icon.type === 'string') {
    // For string components like 'div', 'span', etc.
    iconTypeName = icon.type;
  }
  
  switch (iconTypeName.toLowerCase()) {
    case 'code':
      return 'code';
    case 'braincircuit':
      return 'braincircuit';
    case 'database':
      return 'database';
    case 'filecode':
      return 'filecode';
    case 'globe':
      return 'globe';
    default:
      return 'book';
  }
};

// Function to convert icon name to corresponding component
export const convertIconNameToComponent = (iconName: string): ReactElement => {
  switch (iconName.toLowerCase()) {
    case 'book':
      return React.createElement(Book, { className: "w-16 h-16" });
    case 'code':
      return React.createElement(Code, { className: "w-16 h-16" });
    case 'braincircuit':
    case 'brain':
      return React.createElement(BrainCircuit, { className: "w-16 h-16" });
    case 'database':
      return React.createElement(Database, { className: "w-16 h-16" });
    case 'filecode':
    case 'file':
      return React.createElement(FileCode, { className: "w-16 h-16" });
    case 'globe':
      return React.createElement(Globe, { className: "w-16 h-16" });
    default:
      return React.createElement(Book, { className: "w-16 h-16" });
  }
};
