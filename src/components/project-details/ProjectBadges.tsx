
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/data/projectThemes';

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
  return (
    <div className="flex flex-wrap gap-2">
      {isEditing ? (
        <div className="flex gap-3 items-center">
          <div className="w-40">
            <Select 
              value={category} 
              onValueChange={onCategoryChange}
            >
              <SelectTrigger className="text-white bg-black/40 border-white/20">
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
            <Label htmlFor="is-public" className="text-white">Հրապարակային</Label>
          </div>
        </div>
      ) : (
        <>
          {category && (
            <Badge variant="outline" className="text-white border-white/30 bg-white/10">
              {category}
            </Badge>
          )}
          
          {complexity && (
            <Badge variant="outline" className="text-white border-white/30 bg-white/10">
              Բարդություն: {complexity}
            </Badge>
          )}
          
          <Badge variant={isPublic ? "success" : "secondary"} className="bg-opacity-80">
            {isPublic ? 'Հրապարակային' : 'Պրիվատ'}
          </Badge>
        </>
      )}
    </div>
  );
};

export default ProjectBadges;
