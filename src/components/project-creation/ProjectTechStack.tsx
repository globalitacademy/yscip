
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X } from 'lucide-react';

interface ProjectTechStackProps {
  techStack: string[];
  onTechStackChange: (techStack: string[]) => void;
}

const ProjectTechStack: React.FC<ProjectTechStackProps> = ({
  techStack,
  onTechStackChange
}) => {
  const [currentTech, setCurrentTech] = useState('');

  const handleAddTech = () => {
    if (currentTech.trim() && !techStack.includes(currentTech.trim())) {
      onTechStackChange([...techStack, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    onTechStackChange(techStack.filter(t => t !== tech));
  };

  return (
    <div>
      <Label htmlFor="techStack">Տեխնոլոգիաներ</Label>
      <div className="flex mt-1 gap-2">
        <Input
          id="techStack"
          value={currentTech}
          onChange={(e) => setCurrentTech(e.target.value)}
          placeholder="Օրինակ՝ React"
          className="flex-grow"
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
        />
        <Button type="button" onClick={handleAddTech} size="icon">
          <PlusCircle size={16} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {techStack.map((tech, index) => (
          <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
            {tech}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-secondary/80"
              onClick={() => handleRemoveTech(tech)}
            >
              <X size={10} />
            </Button>
          </Badge>
        ))}
        {techStack.length === 0 && (
          <span className="text-sm text-muted-foreground">Դեռևս տեխնոլոգիաներ չկան։ Ավելացրեք առնվազն մեկը։</span>
        )}
      </div>
    </div>
  );
};

export default ProjectTechStack;
