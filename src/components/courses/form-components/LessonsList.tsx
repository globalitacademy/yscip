
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from 'lucide-react';
import { LessonItem } from '../types/ProfessionalCourse';

export interface LessonsListProps {
  lessons: LessonItem[] | undefined;
  onAddLesson: (lesson: LessonItem) => void;
  onRemoveLesson: (index: number) => void;
}

export const LessonsList: React.FC<LessonsListProps> = ({ lessons = [], onAddLesson, onRemoveLesson }) => {
  const [newLesson, setNewLesson] = useState<LessonItem>({ title: '', duration: '' });

  const handleAdd = () => {
    if (newLesson.title && newLesson.duration) {
      onAddLesson(newLesson);
      setNewLesson({ title: '', duration: '' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {lessons.map((lesson, index) => (
          <div key={index} className="flex items-center justify-between border p-2 rounded-md">
            <div className="flex-1">
              <div className="font-medium">{lesson.title}</div>
              <div className="text-sm text-muted-foreground">{lesson.duration}</div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onRemoveLesson(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="lessonTitle">Թեմայի անվանում</Label>
          <Input
            id="lessonTitle"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            placeholder="Օր․՝ HTML5 հիմունքներ"
          />
        </div>
        <div>
          <Label htmlFor="lessonDuration">Տևողություն</Label>
          <Input
            id="lessonDuration"
            value={newLesson.duration}
            onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
            placeholder="Օր․՝ 3 ժամ"
          />
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleAdd}
        className="w-full"
        disabled={!newLesson.title || !newLesson.duration}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Ավելացնել թեմա
      </Button>
    </div>
  );
};
