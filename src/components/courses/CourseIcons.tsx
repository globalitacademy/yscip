
import React from 'react';
import { 
  Code as CodeIcon, 
  FileCode,
  Coffee
} from 'lucide-react';

// Custom Python icon component (since it's not in Lucide)
export const PythonLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 9H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3" />
      <path d="M12 15h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" />
      <path d="M8 9V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2Z" />
      <path d="M16 15v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" />
    </svg>
  );
};

export { CodeIcon as Code, FileCode as FileJs, Coffee };
