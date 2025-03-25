
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CourseCard from './CourseCard';
import { Course } from './types';
import { useAuth } from '@/contexts/AuthContext';

interface CourseListProps {
  courses: Course[];
  userCourses: Course[];
  isAdmin: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ courses, userCourses, isAdmin, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isLecturer = ['lecturer', 'instructor', 'supervisor', 'project_manager'].includes(user?.role || '');

  // Filter courses to show only public ones or those created by current user
  const visibleCourses = courses.filter(course => 
    course.is_public || course.createdBy === user?.id
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Բոլոր կուրսերը</TabsTrigger>
        {(isAdmin || isLecturer) && (
          <TabsTrigger value="my">Իմ կուրսերը</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="all" className="space-y-4 mt-4">
        {visibleCourses.length === 0 ? (
          <p className="text-center text-gray-500">Կուրսեր չկան</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleCourses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isAdmin={isAdmin}
                canEdit={isAdmin || course.createdBy === user?.id}
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      {(isAdmin || isLecturer) && (
        <TabsContent value="my" className="space-y-4 mt-4">
          {userCourses.length === 0 ? (
            <p className="text-center text-gray-500">Դուք դեռ չունեք ավելացված կուրսեր</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  isAdmin={isAdmin}
                  canEdit={true}
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      )}
    </Tabs>
  );
};

export default CourseList;
