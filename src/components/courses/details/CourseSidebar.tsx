
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseSidebarProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  editedCourse: ProfessionalCourse | null;
  setEditedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  handleApply: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  displayCourse,
  isEditing,
  editedCourse,
  setEditedCourse,
  handleApply
}) => {
  return (
    <FadeIn delay="delay-200">
      <div className="border rounded-lg p-6 sticky top-8">
        <h3 className="text-xl font-bold mb-4">Դասընթացի մանրամասներ</h3>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Արժեք</span>
            {isEditing ? (
              <Input 
                value={editedCourse?.price || ''}
                onChange={(e) => setEditedCourse(prev => prev ? {...prev, price: e.target.value} : prev)}
                className="w-32 text-right"
              />
            ) : (
              <span className="font-bold">{displayCourse?.price}</span>
            )}
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Տևողություն</span>
            <span>{displayCourse?.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Դասերի քանակ</span>
            <span>{displayCourse?.lessons ? displayCourse.lessons.length : 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Հաստատություն</span>
            {isEditing ? (
              <Input 
                value={editedCourse?.institution || ''}
                onChange={(e) => setEditedCourse(prev => prev ? {...prev, institution: e.target.value} : prev)}
                className="w-32 text-right"
              />
            ) : (
              <span>{displayCourse?.institution}</span>
            )}
          </div>
        </div>
        
        {!isEditing && (
          <>
            <Button onClick={handleApply} className="w-full mb-3">
              Դիմել դասընթացին
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <a href="#" className="flex items-center justify-center">
                Ներբեռնել ծրագիրը <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </>
        )}
      </div>
    </FadeIn>
  );
};

export default CourseSidebar;
