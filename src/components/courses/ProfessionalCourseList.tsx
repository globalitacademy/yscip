
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfessionalCourseCard from './ProfessionalCourseCard';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';

interface ProfessionalCourseListProps {
  courses: ProfessionalCourse[];
  userCourses: ProfessionalCourse[];
  isAdmin: boolean;
  onEdit: (course: ProfessionalCourse) => void;
  onDelete: (id: string) => void;
}

const ProfessionalCourseList: React.FC<ProfessionalCourseListProps> = ({ 
  courses, 
  userCourses, 
  isAdmin, 
  onEdit, 
  onDelete 
}) => {
  const { user } = useAuth();

  // Filter courses to show only public ones or those created by the current user
  const visibleCourses = courses.filter(course => 
    course.is_public || course.createdBy === user?.name
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Բոլոր դասընթացները</TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="my">Իմ դասընթացները</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="all" className="space-y-4 mt-4">
        {visibleCourses.length === 0 ? (
          <p className="text-center text-gray-500">Դասընթացներ չկան</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCourses.map((course) => (
              <ProfessionalCourseCard 
                key={course.id} 
                course={course} 
                isAdmin={isAdmin}
                canEdit={isAdmin || course.createdBy === user?.name}
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="my" className="space-y-4 mt-4">
          {userCourses.length === 0 ? (
            <p className="text-center text-gray-500">Դուք դեռ չունեք ավելացված դասընթացներ</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCourses.map((course) => (
                <ProfessionalCourseCard 
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

export default ProfessionalCourseList;
