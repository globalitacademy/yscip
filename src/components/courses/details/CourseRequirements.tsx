
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Ban, PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseRequirementsProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  newRequirement: string;
  setNewRequirement: React.Dispatch<React.SetStateAction<string>>;
  handleAddRequirement: () => void;
  handleRemoveRequirement: (index: number) => void;
}

const CourseRequirements: React.FC<CourseRequirementsProps> = ({
  displayCourse,
  isEditing,
  newRequirement,
  setNewRequirement,
  handleAddRequirement,
  handleRemoveRequirement
}) => {
  return (
    <FadeIn delay="delay-300">
      <div>
        <h2 className="text-2xl font-bold mb-6">Պահանջներ</h2>
        <div className="space-y-2">
          {(displayCourse?.requirements || []).map((req, index) => (
            <div key={index} className="flex items-start gap-2">
              <Ban size={20} className="text-red-500 mt-0.5 shrink-0" />
              <span className="flex-1">{req}</span>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveRequirement(index)}
                  className="text-red-500 p-1"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {isEditing && (
            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex gap-2">
                <Input 
                  placeholder="Պահանջ" 
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={handleAddRequirement}
                  disabled={!newRequirement}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ավելացնել
                </Button>
              </div>
            </div>
          )}
          
          {(!displayCourse?.requirements || displayCourse.requirements.length === 0) && !isEditing && (
            <div className="text-center p-6 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">Պահանջները սահմանված չեն</p>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default CourseRequirements;
