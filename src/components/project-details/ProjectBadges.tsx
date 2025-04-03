
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { getCategoryBadgeClass, getComplexityBadgeClass } from './utils/badgeUtils';

interface ProjectBadgesProps {
  category?: string;
  complexity?: string;
  isPublic?: boolean;
  isEditing: boolean;
  onCategoryChange?: (value: string) => void;
  onIsPublicChange?: (value: boolean) => void;
}

const ProjectBadges: React.FC<ProjectBadgesProps> = ({
  category,
  complexity = 'Միջին',
  isPublic,
  isEditing,
  onCategoryChange,
  onIsPublicChange
}) => {
  // If in editing mode, show editable badges
  if (isEditing) {
    return (
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={category || ''}
          onChange={(e) => onCategoryChange && onCategoryChange(e.target.value)}
          className={`${getCategoryBadgeClass(category)} px-3 py-1 rounded-full text-sm outline-none`}
          placeholder="Կատեգորիա"
        />
        <Badge variant="outline" className={getComplexityBadgeClass(complexity)}>
          {complexity}
        </Badge>
        <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
          <span>Հրապարակային:</span>
          <input 
            type="checkbox" 
            checked={isPublic} 
            onChange={(e) => onIsPublicChange && onIsPublicChange(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
        </div>
      </div>
    );
  }

  // View mode
  return (
    <>
      {category && (
        <Badge variant="outline" className={`${getCategoryBadgeClass(category)} px-3 py-1 rounded-full`}>
          {category}
        </Badge>
      )}
      <Badge variant="outline" className={`${getComplexityBadgeClass(complexity)} px-3 py-1 rounded-full`}>
        {complexity}
      </Badge>
      {isPublic !== undefined && (
        isPublic ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            Հրապարակային
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center">
            <EyeOff className="h-3 w-3 mr-1" />
            Մասնավոր
          </Badge>
        )
      )}
    </>
  );
};

export default ProjectBadges;
