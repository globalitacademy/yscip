
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/data/projectThemes';
import { useTheme } from '@/hooks/use-theme';

interface ProjectBadgesProps {
  category?: string;
  complexity?: string;
  isPublic?: boolean;
  isEditing: boolean;
  onCategoryChange: (value: string) => void;
  onIsPublicChange: (value: boolean) => void;
}

const ProjectBadges: React.FC<ProjectBadgesProps> = ({
  category,
  complexity,
  isPublic = false,
  isEditing,
  onCategoryChange,
  onIsPublicChange
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="flex flex-wrap gap-2">
      {isEditing ? (
        <div className="flex gap-3 items-center">
          <div className="w-40">
            <Select 
              value={category} 
              onValueChange={onCategoryChange}
            >
              <SelectTrigger className={isDarkMode ? 
                "text-white bg-black/40 border-white/20" : 
                "text-foreground bg-background/90 border-input"}>
                <SelectValue placeholder="Ընտրել կատեգորիա" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="is-public" 
              checked={isPublic} 
              onCheckedChange={onIsPublicChange} 
              className="data-[state=checked]:bg-green-500"
            />
            <Label htmlFor="is-public" className={isDarkMode ? "text-white" : "text-foreground"}>
              Հրապարակային
            </Label>
          </div>
        </div>
      ) : (
        <>
          {category && (
            <Badge 
              variant="outline" 
              className={isDarkMode ? 
                "text-white border-white/30 bg-white/10" : 
                "text-foreground border-border bg-background/80"}
            >
              {category}
            </Badge>
          )}
          
          {complexity && (
            <Badge 
              variant="outline" 
              className={isDarkMode ? 
                "text-white border-white/30 bg-white/10" : 
                "text-foreground border-border bg-background/80"}
            >
              Բարդություն: {complexity}
            </Badge>
          )}
          
          <Badge 
            variant={isPublic ? "success" : "secondary"} 
            className={isDarkMode ? "bg-opacity-80" : ""}
          >
            {isPublic ? 'Հրապարակային' : 'Պրիվատ'}
          </Badge>
        </>
      )}
    </div>
  );
};

export default ProjectBadges;
