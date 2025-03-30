
import React from 'react';
import { LessonsList } from '@/components/courses/form-components/LessonsList';
import { ProfessionalCourse, LessonItem } from '@/components/courses/types/ProfessionalCourse';

interface LessonsTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: React.Dispatch<React.SetStateAction<Partial<ProfessionalCourse>>>;
}

export const LessonsTab: React.FC<LessonsTabProps> = ({ editedCourse, setEditedCourse }) => {
  const handleAddLesson = (newLesson: LessonItem) => {
    const lessons = [...(editedCourse.lessons || []), newLesson];
    setEditedCourse({ ...editedCourse, lessons });
  };

  const handleRemoveLesson = (index: number) => {
    const lessons = [...(editedCourse.lessons || [])];
    lessons.splice(index, 1);
    setEditedCourse({ ...editedCourse, lessons });
  };

  return (
    <LessonsList 
      lessons={editedCourse.lessons || []}
      onAddLesson={handleAddLesson}
      onRemoveLesson={handleRemoveLesson}
    />
  );
};
