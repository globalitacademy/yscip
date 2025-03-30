
import React from 'react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';

export interface IconSelectorProps {
  isIconsOpen: boolean;
  setIsIconsOpen: (isOpen: boolean) => void;
  onIconSelect: (iconName: string) => void;
  selectedIcon?: string;
}

const iconOptions = [
  { label: 'Կոդ', value: 'code', icon: <Code className="h-5 w-5" /> },
  { label: 'Գիրք', value: 'book', icon: <BookText className="h-5 w-5" /> },
  { label: 'ԻԻ', value: 'ai', icon: <BrainCircuit className="h-5 w-5" /> },
  { label: 'Տվյալներ', value: 'database', icon: <Database className="h-5 w-5" /> },
  { label: 'Ֆայլեր', value: 'files', icon: <FileCode className="h-5 w-5" /> },
  { label: 'Վեբ', value: 'web', icon: <Globe className="h-5 w-5" /> },
];

export const IconSelector: React.FC<IconSelectorProps> = ({ isIconsOpen, setIsIconsOpen, onIconSelect, selectedIcon }) => {
  return (
    <Collapsible
      open={isIconsOpen}
      onOpenChange={setIsIconsOpen}
      className="w-full border rounded-md p-2"
    >
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between cursor-pointer p-2">
          <span>Ընտրել պատկերակ {selectedIcon && `(Ընտրված՝ ${selectedIcon})`}</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isIconsOpen ? 'transform rotate-180' : ''}`} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        <div className="grid grid-cols-3 gap-2">
          {iconOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedIcon === option.value ? "default" : "outline"}
              className="flex flex-col items-center p-2 h-auto"
              onClick={() => onIconSelect(option.value)}
            >
              {option.icon}
              <span className="mt-1 text-xs">{option.label}</span>
            </Button>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
