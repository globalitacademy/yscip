
import React from 'react';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';

// Icons mapping for different course types
export const courseIcons: Record<string, React.ReactNode> = {
  'WEB Front-End': <Code className="w-16 h-16" />,
  'Python (ML / AI)': <BrainCircuit className="w-16 h-16" />,
  'Java': <BookText className="w-16 h-16" />,
  'JavaScript': <FileCode className="w-16 h-16" />,
  'PHP': <Database className="w-16 h-16" />,
  'C#/.NET': <Globe className="w-16 h-16" />
};

// Colors mapping for different course types
export const courseColors: Record<string, string> = {
  'WEB Front-End': 'text-amber-500',
  'Python (ML / AI)': 'text-blue-500',
  'Java': 'text-red-500',
  'JavaScript': 'text-yellow-500',
  'PHP': 'text-purple-500',
  'C#/.NET': 'text-green-500'
};
