
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Check, PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseLearningOutcomesProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  newOutcome: string;
  setNewOutcome: React.Dispatch<React.SetStateAction<string>>;
  handleAddOutcome: () => void;
  handleRemoveOutcome: (index: number) => void;
}

const CourseLearningOutcomes: React.FC<CourseLearningOutcomesProps> = ({
  displayCourse,
  isEditing,
  newOutcome,
  setNewOutcome,
  handleAddOutcome,
  handleRemoveOutcome
}) => {
  return (
    <FadeIn delay="delay-200">
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Ինչ կսովորեք</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(displayCourse?.outcomes || []).map((outcome, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check size={20} className="text-green-500 mt-0.5 shrink-0" />
              <span className="flex-1">{outcome}</span>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveOutcome(index)}
                  className="text-red-500 p-1"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="col-span-full mt-2 border rounded-lg p-4 bg-gray-50">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ինչ կսովորեք" 
                  value={newOutcome}
                  onChange={(e) => setNewOutcome(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddOutcome}
                  disabled={!newOutcome}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ավելացնել
                </Button>
              </div>
            </div>
          )}
          
          {(!displayCourse?.outcomes || displayCourse.outcomes.length === 0) && !isEditing && (
            <div className="col-span-2 text-center p-6 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">Տեղեկատվությունը հասանելի չէ</p>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default CourseLearningOutcomes;
