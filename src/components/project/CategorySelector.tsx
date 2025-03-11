
import React from 'react';
import { Layers } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface CategorySelectorProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) => {
  return (
    <Select
      defaultValue={activeCategory}
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
  );
};

export default CategorySelector;
