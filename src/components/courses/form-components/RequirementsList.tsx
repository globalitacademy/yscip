
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from 'lucide-react';

interface RequirementsListProps {
  requirements: string[] | undefined;
  onAddRequirement: (requirement: string) => void;
  onRemoveRequirement: (index: number) => void;
}

export const RequirementsList: React.FC<RequirementsListProps> = ({ requirements = [], onAddRequirement, onRemoveRequirement }) => {
  const [newRequirement, setNewRequirement] = useState('');

  const handleAdd = () => {
    if (newRequirement) {
      onAddRequirement(newRequirement);
      setNewRequirement('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {requirements.map((requirement, index) => (
          <div key={index} className="flex items-center justify-between border p-2 rounded-md">
            <div className="flex-1">{requirement}</div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onRemoveRequirement(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div>
        <Label htmlFor="requirement">Պահանջ</Label>
        <Input
          id="requirement"
          value={newRequirement}
          onChange={(e) => setNewRequirement(e.target.value)}
          placeholder="Օր․՝ Համակարգչային հիմնական գիտելիքներ"
        />
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAdd}
        className="w-full"
        disabled={!newRequirement}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Ավելացնել պահանջ
      </Button>
    </div>
  );
};
