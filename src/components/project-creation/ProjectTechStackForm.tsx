
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, X } from 'lucide-react';

interface ProjectTechStackFormProps {
  techStack: string[];
  setTechStack: (techStack: string[]) => void;
  goal: string;
  setGoal: (goal: string) => void;
  organizationName: string;
  setOrganizationName: (organizationName: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
}

const ProjectTechStackForm: React.FC<ProjectTechStackFormProps> = ({
  techStack,
  setTechStack,
  goal,
  setGoal,
  organizationName,
  setOrganizationName,
  isPublic,
  setIsPublic
}) => {
  const [tech, setTech] = useState('');

  const handleAddTech = () => {
    if (!tech.trim()) return;
    if (techStack.includes(tech.trim())) return;
    
    setTechStack([...techStack, tech.trim()]);
    setTech('');
  };

  const handleRemoveTech = (index: number) => {
    const newTechStack = [...techStack];
    newTechStack.splice(index, 1);
    setTechStack(newTechStack);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="goal">Նախագծի նպատակ</Label>
        <Textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Նկարագրեք նախագծի հիմնական նպատակը"
          className="resize-none"
          rows={4}
        />
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="techStack">Տեխնոլոգիաներ</Label>
        <div className="flex gap-2">
          <Input
            id="techStack"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            placeholder="Ավելացրեք տեխնոլոգիա (օր. React, Node.js, Bootstrap)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTech();
              }
            }}
          />
          <Button type="button" onClick={handleAddTech}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {techStack.map((tech, index) => (
            <Badge key={index} variant="secondary" className="pl-2">
              {tech}
              <button
                type="button"
                onClick={() => handleRemoveTech(index)}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {techStack.length === 0 && (
            <p className="text-sm text-muted-foreground">Տեխնոլոգիաներ դեռ ավելացված չեն</p>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="organizationName">Կազմակերպություն</Label>
        <Input
          id="organizationName"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Կազմակերպության անվանում"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="isPublic"
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
        <Label htmlFor="isPublic">Հրապարակային նախագիծ</Label>
      </div>
    </div>
  );
};

export default ProjectTechStackForm;
