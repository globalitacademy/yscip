
import React from 'react';
import { Layers } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProjectFiltersProps {
  activeCategory: string;
  filterStatus: string;
  categories: string[];
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  activeCategory,
  filterStatus,
  categories,
  onCategoryChange,
  onStatusChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <Select
        value={activeCategory}
        onValueChange={(value) => onCategoryChange(value)}
      >
        <SelectTrigger className="w-full sm:w-[220px] bg-background">
          <SelectValue placeholder="Ընտրեք կատեգորիան" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all" className="flex items-center gap-2">
            <Layers size={14} className="opacity-80" />
            <span>Բոլորը</span>
          </SelectItem>
          {categories.filter(cat => cat !== "all").map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={filterStatus}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full sm:w-[220px] bg-background">
          <SelectValue placeholder="Կարգավիճակ" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          <SelectItem value="all">Բոլոր կարգավիճակները</SelectItem>
          <SelectItem value="pending">Սպասող</SelectItem>
          <SelectItem value="assigned">Նշանակված</SelectItem>
          <SelectItem value="approved">Հաստատված</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectFilters;
