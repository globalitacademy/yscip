
import React from 'react';
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';

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
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // Define complexity color classes based on the current theme
  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'Սկսնակ':
        return isDarkMode
          ? 'bg-green-950/50 text-green-400 border-green-800'
          : 'bg-green-500/10 text-green-600 border-green-200';
      case 'Միջին':
        return isDarkMode
          ? 'bg-amber-950/50 text-amber-400 border-amber-800'
          : 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Առաջադեմ':
        return isDarkMode
          ? 'bg-red-950/50 text-red-400 border-red-800'
          : 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return isDarkMode
          ? 'bg-blue-950/50 text-blue-400 border-blue-800'
          : 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };

  const getCategoryBadgeClass = () => {
    return isDarkMode
      ? 'bg-slate-800/80 text-slate-200'
      : 'bg-slate-200 text-slate-800';
  };

  const getPrivateBadgeClass = () => {
    return isDarkMode
      ? 'bg-amber-900/70 text-amber-300'
      : 'bg-amber-100 text-amber-800';
  };

  return <>
      <div className={`absolute top-4 left-4 flex items-center text-xs px-2 py-1 rounded-full z-10 ${getCategoryBadgeClass()}`}>
        <Building size={12} className="mr-1" />
        <span>{category}</span>
      </div>

      {showComplexity && complexity && (
        <div className={`absolute top-4 right-4 z-10 ${adminView ? 'block' : ''}`}>
          <span className={cn("text-xs border px-2 py-1 rounded-full inline-block", getComplexityColor(complexity))}>
            {complexity}
          </span>
        </div>
      )}

      {!isPublic && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center text-xs px-2 py-1 rounded-full z-10 ${getPrivateBadgeClass()}`}>
          <span>Չհրապարակված</span>
        </div>
      )}
    </>;
};

export default ProjectBadges;
