
import React from 'react';
import { Code } from 'lucide-react';

// Icons mapping for different course types - using more simple icons to match the design
export const courseIcons: Record<string, React.ReactNode> = {
  'WEB Front-End': (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="6.5" cy="7.5" r=".5" />
        <circle cx="9.5" cy="7.5" r=".5" />
        <circle cx="12.5" cy="7.5" r=".5" />
        <path d="m8 16 4-8 4 8" />
      </svg>
    </div>
  ),
  'Python (ML / AI)': (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M12 9H7.5a2.5 2.5 0 0 0 0 5H12m0-5v5m0-5V4m0 10h4.5a2.5 2.5 0 0 0 0-5H12" />
        <path d="M20 7v.5a2.5 2.5 0 0 1-2.5 2.5h-9a2.5 2.5 0 0 1-2.5-2.5V7m14 10v-.5a2.5 2.5 0 0 0-2.5-2.5h-9a2.5 2.5 0 0 0-2.5 2.5v.5" />
      </svg>
    </div>
  ),
  'Java': (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <path d="M10 2v7.31" />
        <path d="M14 9.3V4" />
        <path d="M14 4H9.5" />
        <path d="M10 16v5a2 2 0 0 1-2 2H7" />
        <path d="M4.17 15h6.66a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H9" />
        <path d="M11 16a4 4 0 0 0 4-4c0-.5-.931-1.856-2-3.5s-2-2.5-2-2.5" />
      </svg>
    </div>
  ),
  'JavaScript': (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M16 11.37V8" />
        <path d="M9 11.37V8" />
        <path d="M10.5 13.5V18" />
        <path d="M14.5 13.5V18" />
        <path d="M16 16h-3" />
        <path d="M12 16H9" />
      </svg>
    </div>
  ),
  'PHP': (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
        <path d="M7 3h10v11H7V3Z" />
        <path d="M9 7h1" />
        <path d="M14 7h1" />
        <path d="M9 11h6" />
        <path d="M17 21v-8" />
        <path d="M7 21v-8" />
        <path d="M7 13a8 8 0 0 0 10 0" />
      </svg>
    </div>
  ),
  'C#/.NET': (
    <div className="w-24 h-24 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <path d="M16.5 9h-2.5a1.5 1.5 0 0 0 0 3h.5a1.5 1.5 0 0 1 0 3h-2.5" />
        <path d="M10 9v6" />
        <path d="M20 4v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
      </svg>
    </div>
  )
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
