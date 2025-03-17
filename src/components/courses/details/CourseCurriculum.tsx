
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfessionalCourse } from '../types/ProfessionalCourse';

interface CourseCurriculumProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  newLesson: { title: string; duration: string };
  setNewLesson: React.Dispatch<React.SetStateAction<{ title: string; duration: string }>>;
  handleAddLesson: () => void;
  handleRemoveLesson: (index: number) => void;
}

const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  displayCourse,
  isEditing,
  newLesson,
  setNewLesson,
  handleAddLesson,
  handleRemoveLesson
}) => {
  return (
    <FadeIn delay="delay-100">
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Դասընթացի ծրագիր</h2>
        <div className="space-y-4">
          {(displayCourse?.lessons || []).map((lesson, index) => (
            <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <h3 className="font-medium">{lesson.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveLesson(index)}
                      className="text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isEditing && (
            <div className="mt-4 border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <Input 
                  placeholder="Թեմայի անվանում" 
                  value={newLesson.title}
                  onChange={(e) => setNewLesson(prev => ({...prev, title: e.target.value}))}
                />
                <Input 
                  placeholder="Տևողություն (օր.՝ 3 ժամ)" 
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson(prev => ({...prev, duration: e.target.value}))}
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddLesson}
                disabled={!newLesson.title || !newLesson.duration}
                className="w-full"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ավելացնել նոր թեմա
              </Button>
            </div>
          )}
          
          {(!displayCourse?.lessons || displayCourse.lessons.length === 0) && !isEditing && (
            <div className="text-center p-6 border rounded-lg bg-gray-50">
              <p className="text-muted-foreground">Դասընթացի ծրագիրը հասանելի չէ</p>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
};

export default CourseCurriculum;
