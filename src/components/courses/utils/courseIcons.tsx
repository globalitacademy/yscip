
import React from 'react';

// Icons mapping for different course types - using simple line icons to match the design
export const courseIcons: Record<string, React.ReactNode> = {
  'WEB Front-End': (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10L5 12L8 14" />
        <path d="M16 10L19 12L16 14" />
        <path d="M10 8L14 16" />
      </svg>
    </div>
  ),
  'Python (ML / AI)': (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
        <path d="M12 9H7.5a2.5 2.5 0 0 0 0 5H12m0-5v5m0-5V4m0 10h4.5a2.5 2.5 0 0 0 0-5H12" />
        <path d="M20 7v.5a2.5 2.5 0 0 1-2.5 2.5h-9a2.5 2.5 0 0 1-2.5-2.5V7m14 10v-.5a2.5 2.5 0 0 0-2.5-2.5h-9a2.5 2.5 0 0 0-2.5 2.5v.5" />
      </svg>
    </div>
  ),
  'Java': (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <path d="M12 3c-.5 0-.7.1-1.3.6-1 1-2.2 2.5-2.2 3.4 0 1 0 1 .3 1.4.2.4.2.6.1 1a2 2 0 0 1-1 1.3c-.8.5-2.4 1.3-3.7 2.8a3 3 0 0 0-.5 1.3c-.2.5-.2 1 .2 1.3.4.3.9.2 1.6-.2.4-.2 1-.5 1.5-.8 1-.5 2.1-.6 2.8-.4.2 0 .4.2.6.3.5.3 1 .3 1.6.3.6 0 1.1 0 1.6-.3.2-.1.4-.2.6-.3.7-.2 1.9-.1 2.8.4.6.3 1.1.6 1.6.8.6.4 1.2.5 1.5.2.4-.3.4-.8.2-1.3a3 3 0 0 0-.5-1.3c-1.3-1.5-2.9-2.3-3.7-2.8a2 2 0 0 1-1-1.3c0-.4 0-.6.1-1 .4-.4.4-.5.4-1.4 0-1-1.2-2.5-2.2-3.4-.6-.5-.9-.6-1.3-.6Z" />
        <path d="M12 10c-1.5 0-3 1.4-3 2.7 0 1 0 1.3.5 1.8.3.4.5.8.5 1.2V17c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-1.3c0-.4.2-.8.5-1.2.5-.5.5-.8.5-1.8 0-1.3-1.5-2.7-3-2.7Z" />
        <path d="M16 19a4 4 0 0 1-8 0" />
      </svg>
    </div>
  ),
  'JavaScript': (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M9 9v8" />
        <path d="M15 13v4" />
        <path d="M15 13c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2z" />
      </svg>
    </div>
  ),
  'PHP': (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
        <path d="M12 15c-1.3 0-2.4-.4-3.2-1a5 5 0 0 1-1.7-2.2 8 8 0 0 1-.6-3.2C6.5 5.7 8.9 3 12 3s5.5 2.7 5.5 5.6c0 1.2-.2 2.3-.6 3.2-.4 1-.9 1.7-1.7 2.2-.8.6-1.9 1-3.2 1Z" />
        <path d="M7 13v3c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-3" />
        <path d="M7 13h10" />
      </svg>
    </div>
  ),
  'C#/.NET': (
    <div className="w-16 h-16 flex items-center justify-center">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
        <path d="M16.5 9h-3.5a2 2 0 1 0 0 4h.5a2 2 0 1 1 0 4h-3.5" />
        <path d="M12 6v2m0 8v2" />
        <path d="M19 6.4L16.5 7m-9 10L5 18.6" />
        <path d="M16.5 17 19 17.6M5 5.4 7.5 7" />
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
