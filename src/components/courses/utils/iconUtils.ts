
import React from 'react';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';

// Function to convert icon name to React element
export const getIconFromName = (iconName: string): React.ReactElement => {
  switch (iconName) {
    case 'code':
      return React.createElement(Code, { className: "w-16 h-16" });
    case 'book':
      return React.createElement(BookText, { className: "w-16 h-16" });
    case 'ai':
      return React.createElement(BrainCircuit, { className: "w-16 h-16" });
    case 'database':
      return React.createElement(Database, { className: "w-16 h-16" });
    case 'files':
      return React.createElement(FileCode, { className: "w-16 h-16" });
    case 'web':
      return React.createElement(Globe, { className: "w-16 h-16" });
    default:
      return React.createElement(Code, { className: "w-16 h-16" });
  }
};

// Function to get icon name from React element
export const getIconNameFromElement = (icon: React.ReactElement): string => {
  const type = icon.type;
  if (type === Code) return 'code';
  if (type === BookText) return 'book';
  if (type === BrainCircuit) return 'ai';
  if (type === Database) return 'database';
  if (type === FileCode) return 'files';
  if (type === Globe) return 'web';
  return 'code';
};
