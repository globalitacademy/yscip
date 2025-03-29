
import React from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface CourseColorSelectorProps {
  isColorsOpen: boolean;
  setIsColorsOpen: (isOpen: boolean) => void;
  onColorSelect: (color: string) => void;
}

const colorOptions = [
  { label: 'Ամբերային', value: 'text-amber-500' },
  { label: 'Կապույտ', value: 'text-blue-500' },
  { label: 'Կարմիր', value: 'text-red-500' },
  { label: 'Դեղին', value: 'text-yellow-500' },
  { label: 'Մանուշակագույն', value: 'text-purple-500' },
  { label: 'Կանաչ', value: 'text-green-500' },
];

export const CourseColorSelector: React.FC<CourseColorSelectorProps> = ({ isColorsOpen, setIsColorsOpen, onColorSelect }) => {
  return (
    <Collapsible
      open={isColorsOpen}
      onOpenChange={setIsColorsOpen}
      className="w-full border rounded-md p-2"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between cursor-pointer p-2">
          <span>Գույնի ընտրություն</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isColorsOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <div className="grid grid-cols-3 gap-2">
          {colorOptions.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              className={`p-2 ${option.value.replace('text-', 'bg-').replace('-500', '-100')}`}
              onClick={() => onColorSelect(option.value)}
            >
              <span className={option.value}>{option.label}</span>
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
