
import React from 'react';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';

/**
 * Converts an icon name to a React component
 * @param iconName The name of the icon to convert
 * @returns A React element representing the icon
 */
export const convertIconNameToComponent = (iconName: string): React.ReactElement => {
  let IconComponent;
  
  switch (iconName?.toLowerCase()) {
    case 'book':
      IconComponent = Book;
      break;
    case 'code':
      IconComponent = Code;
      break;
    case 'braincircuit':
    case 'brain':
      IconComponent = BrainCircuit;
      break;
    case 'database':
      IconComponent = Database;
      break;
    case 'filecode':
    case 'file':
      IconComponent = FileCode;
      break;
    case 'globe':
      IconComponent = Globe;
      break;
    default:
      IconComponent = Book;
  }
  
  return React.createElement(IconComponent, { className: "w-16 h-16" });
};
