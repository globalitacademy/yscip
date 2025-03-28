
import React from 'react';
import { Book, BrainCircuit, Code, Database, FileCode, Globe } from 'lucide-react';

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
