
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const colorOptions = [
    { label: 'Ամբերային', value: 'text-amber-500' },
    { label: 'Կապույտ', value: 'text-blue-500' },
    { label: 'Կարմիր', value: 'text-red-500' },
    { label: 'Դեղին', value: 'text-yellow-500' },
    { label: 'Մանուշակագույն', value: 'text-purple-500' },
    { label: 'Կանաչ', value: 'text-green-500' },
  ];

  return (
    <FadeIn delay="delay-200">
      <div className="border rounded-lg overflow-hidden">
        {displayCourse.imageUrl && (
          <div className="w-full h-48 relative">
            <img 
              src={displayCourse.imageUrl} 
              alt={displayCourse.title}
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Input 
                  value={editedCourse?.imageUrl || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, imageUrl: e.target.value} : prev)}
                  placeholder="Նկարի URL հղումը"
                  className="w-full max-w-[90%] bg-white"
                />
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
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
              {isEditing ? (
                <Input 
                  value={editedCourse?.duration || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, duration: e.target.value} : prev)}
                  className="w-32 text-right"
                />
              ) : (
                <span>{displayCourse?.duration}</span>
              )}
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Դասախոս</span>
              {isEditing ? (
                <Input 
                  value={editedCourse?.createdBy || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, createdBy: e.target.value} : prev)}
                  className="w-32 text-right"
                />
              ) : (
                <span>{displayCourse?.createdBy}</span>
              )}
            </div>
            
            {isEditing && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Գույն</span>
                <Select 
                  value={editedCourse?.color || ''} 
                  onValueChange={(value) => setEditedCourse(prev => prev ? {...prev, color: value} : prev)}
                >
                  <SelectTrigger className="w-32 text-right">
                    <SelectValue placeholder="Գույն" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full ${option.value.replace('text-', 'bg-')}`} />
                          <span className="ml-2">{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
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
      </div>
    </FadeIn>
  );
};

export default CourseSidebar;
