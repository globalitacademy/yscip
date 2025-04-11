
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface ProjectRequirementsProps {
  prerequisites: string[];
  setPrerequisites: (prerequisites: string[]) => void;
  learningOutcomes: string[];
  setLearningOutcomes: (learningOutcomes: string[]) => void;
}

const ProjectRequirements: React.FC<ProjectRequirementsProps> = ({
  prerequisites,
  setPrerequisites,
  learningOutcomes,
  setLearningOutcomes
}) => {
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  const handleAddPrerequisite = () => {
    if (!newPrerequisite.trim()) return;
    setPrerequisites([...prerequisites, newPrerequisite.trim()]);
    setNewPrerequisite('');
  };

  const handleRemovePrerequisite = (index: number) => {
    const newPrerequisites = [...prerequisites];
    newPrerequisites.splice(index, 1);
    setPrerequisites(newPrerequisites);
  };

  const handleAddOutcome = () => {
    if (!newOutcome.trim()) return;
    setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
    setNewOutcome('');
  };

  const handleRemoveOutcome = (index: number) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes.splice(index, 1);
    setLearningOutcomes(newOutcomes);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Նախապայմաններ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={newPrerequisite}
              onChange={(e) => setNewPrerequisite(e.target.value)}
              placeholder="Մուտքագրեք նախապայման"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPrerequisite();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={handleAddPrerequisite} 
              className="flex items-center"
              disabled={!newPrerequisite.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Ավելացնել նախապայման
            </Button>
          </div>

          {prerequisites.length > 0 ? (
            <ul className="space-y-2 pl-6 list-disc">
              {prerequisites.map((prerequisite, index) => (
                <li key={index} className="flex items-center justify-between group">
                  <span className="text-sm">{prerequisite}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemovePrerequisite(index)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Նախապայմաններ դեռ ավելացված չեն</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Նախագծի արդյունքում ձեռք բերվող հմտություններ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              placeholder="Մուտքագրեք հմտություն"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddOutcome();
                }
              }}
            />
            <Button 
              type="button" 
              onClick={handleAddOutcome} 
              className="flex items-center"
              disabled={!newOutcome.trim()}
            >
              <Plus className="h-4 w-4 mr-1" /> Ավելացնել հմտություն
            </Button>
          </div>

          {learningOutcomes.length > 0 ? (
            <ul className="space-y-2 pl-6 list-disc">
              {learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex items-center justify-between group">
                  <span className="text-sm">{outcome}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveOutcome(index)} 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Հմտություններ դեռ ավելացված չեն</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectRequirements;
