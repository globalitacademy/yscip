
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from 'lucide-react';

interface OutcomesListProps {
  outcomes: string[] | undefined;
  onAddOutcome: (outcome: string) => void;
  onRemoveOutcome: (index: number) => void;
}

export const OutcomesList: React.FC<OutcomesListProps> = ({ outcomes = [], onAddOutcome, onRemoveOutcome }) => {
  const [newOutcome, setNewOutcome] = useState('');

  const handleAdd = () => {
    if (newOutcome) {
      onAddOutcome(newOutcome);
      setNewOutcome('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {outcomes.map((outcome, index) => (
          <div key={index} className="flex items-center justify-between border p-2 rounded-md">
            <div className="flex-1">{outcome}</div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onRemoveOutcome(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div>
        <Label htmlFor="outcome">Սովորելիք</Label>
        <Input
          id="outcome"
          value={newOutcome}
          onChange={(e) => setNewOutcome(e.target.value)}
          placeholder="Օր․՝ Մշակել ամբողջական ինտերակտիվ վեբ կայքեր"
        />
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAdd}
        className="w-full"
        disabled={!newOutcome}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Ավելացնել սովորելիք
      </Button>
    </div>
  );
};
