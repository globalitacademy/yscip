
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface EditableTechStackProps {
  techStack: string[];
  onChange: (techStack: string[]) => void;
  isEditing: boolean;
}

const EditableTechStack: React.FC<EditableTechStackProps> = ({ 
  techStack, 
  onChange, 
  isEditing 
}) => {
  const [newTech, setNewTech] = useState('');
  
  const handleAddTech = () => {
    if (newTech.trim() && !techStack.includes(newTech.trim())) {
      onChange([...techStack, newTech.trim()]);
      setNewTech('');
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    onChange(techStack.filter(t => t !== tech));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };
  
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">Տեխնոլոգիաներ</Label>
      
      <div className="flex flex-wrap gap-2">
        {techStack.map(tech => (
          <Badge 
            key={tech} 
            variant={isEditing ? "outline" : "secondary"}
            className={isEditing ? "pr-1 bg-background" : ""}
          >
            {tech}
            {isEditing && (
              <button 
                onClick={() => handleRemoveTech(tech)} 
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      
      {isEditing && (
        <div className="flex mt-2 gap-2">
          <Input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Նոր տեխնոլոգիա"
            className="flex-1"
          />
          <Button 
            type="button" 
            size="sm"
            onClick={handleAddTech}
            disabled={!newTech.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Ավելացնել
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditableTechStack;
