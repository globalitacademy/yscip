import React from 'react';
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ProjectBadgesProps {
  category: string;
  complexity?: string;
  isPublic?: boolean;
  adminView?: boolean;
  showComplexity?: boolean;
}
const ProjectBadges: React.FC<ProjectBadgesProps> = ({
  category,
  complexity,
  isPublic = true,
  adminView = false,
  showComplexity = true
}) => {
  // Define complexity color classes
  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'Սկսնակ':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Միջին':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Առաջադեմ':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };
  return <>
      <div className="absolute top-4 left-4 flex items-center text-xs px-2 py-1 rounded-full z-10 bg-slate-200">
        <Building size={12} className="mr-1" />
        <span>{category}</span>
      </div>

      {showComplexity && complexity && <div className={`absolute top-4 right-4 z-10 ${adminView ? 'block' : ''}`}>
          <span className={cn("text-xs border px-2 py-1 rounded-full inline-block", getComplexityColor(complexity))}>
            {complexity}
          </span>
        </div>}

      {!isPublic && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full z-10">
          <span>Չհրապարակված</span>
        </div>}
    </>;
};
export default ProjectBadges;