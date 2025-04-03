
import React, { useState } from 'react';
import { ProfessionalCourse, LessonItem } from '@/components/courses/types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface LessonsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: (changes: Partial<ProfessionalCourse>) => void;
}

export const LessonsTab: React.FC<LessonsTabProps> = ({ editedCourse, setEditedCourse }) => {
  const [newLesson, setNewLesson] = useState<LessonItem>({ title: '', duration: '' });
  
  const handleAddLesson = () => {
    if (!newLesson.title || !newLesson.duration) {
      return;
    }
    
    const updatedLessons = [...(editedCourse.lessons || []), { ...newLesson }];
    console.log('Adding lesson, updated lessons:', updatedLessons);
    
    // Create a complete updated course object with the new lessons
    const updatedCourse = { ...editedCourse, lessons: updatedLessons };
    setEditedCourse(updatedCourse);
    
    setNewLesson({ title: '', duration: '' });
  };
  
  const handleRemoveLesson = (index: number) => {
    const updatedLessons = [...(editedCourse.lessons || [])];
    updatedLessons.splice(index, 1);
    console.log('Removing lesson, updated lessons:', updatedLessons);
    
    // Create a complete updated course object with the updated lessons
    const updatedCourse = { ...editedCourse, lessons: updatedLessons };
    setEditedCourse(updatedCourse);
  };
  
  const handleLessonChange = (index: number, field: keyof LessonItem, value: string) => {
    const updatedLessons = [...(editedCourse.lessons || [])];
    updatedLessons[index] = {
      ...updatedLessons[index],
      [field]: value
    };
    console.log(`Updating lesson ${index} ${field} to ${value}, lessons:`, updatedLessons);
    
    // Create a complete updated course object with the updated lessons
    const updatedCourse = { ...editedCourse, lessons: updatedLessons };
    setEditedCourse(updatedCourse);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {(editedCourse.lessons || []).map((lesson, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,120px,40px] gap-2 items-center">
            <Input
              value={lesson.title}
              onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
              placeholder="Դասի վերնագիր"
            />
            <Input
              value={lesson.duration}
              onChange={(e) => handleLessonChange(index, 'duration', e.target.value)}
              placeholder="Տևողություն"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveLesson(index)}
              title="Հեռացնել"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr,120px,auto] gap-2 items-center">
        <Input
          value={newLesson.title}
          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
          placeholder="Նոր դասի վերնագիր"
        />
        <Input
          value={newLesson.duration}
          onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
          placeholder="Տևողություն"
        />
        <Button 
          onClick={handleAddLesson} 
          disabled={!newLesson.title || !newLesson.duration}
        >
          Ավելացնել
        </Button>
      </div>
    </div>
  );
};
