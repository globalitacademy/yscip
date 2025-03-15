
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from './CourseCard';
import { Course } from './types';

interface CourseListProps {
  courses: Course[];
  isAdmin: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, isAdmin, onEdit, onDelete }) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Բոլոր կուրսերը</TabsTrigger>
        <TabsTrigger value="my">Իմ կուրսերը</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="space-y-4 mt-4">
        {courses.length === 0 ? (
          <p className="text-center text-gray-500">Կուրսեր չկան</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isAdmin={isAdmin} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="my" className="space-y-4 mt-4">
        <p className="text-center text-gray-500">Կուրսեր չկան: Դասախոսները կտեսնեն իրենց նշանակված կուրսերը այստեղ:</p>
      </TabsContent>
    </Tabs>
  );
};

export default CourseList;
