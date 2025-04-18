
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfessionalCourseCard from './ProfessionalCourseCard';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { useAuth } from '@/contexts/AuthContext';
import { useCoursePermissions } from '@/hooks/useCoursePermissions';

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
  const permissions = useCoursePermissions();

  // Filter courses to show only those from database (real courses)
  // Real courses have is_public field from the database
  const realCourses = courses.filter(course => 
    course.is_public !== undefined
  );
  
  // Filter courses to show only public ones created by admin/authorized users
  // or those created by the current user
  const visibleCourses = realCourses.filter(course => 
    (course.is_public) || 
    (user && course.createdBy === user.name)
  );

  // Filter user courses to only show real courses
  const realUserCourses = userCourses.filter(course => 
    course.is_public !== undefined
  );

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">Բոլոր դասընթացները</TabsTrigger>
        {user && (
          <TabsTrigger value="my">Իմ դասընթացները</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="all" className="space-y-4 mt-4">
        {visibleCourses.length === 0 ? (
          <p className="text-center text-gray-500">Իրական դասընթացներ չկան</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCourses.map((course) => (
              <ProfessionalCourseCard 
                key={course.id} 
                course={course} 
                isAdmin={isAdmin}
                canEdit={isAdmin || (user && course.createdBy === user.name)}
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      {user && (
        <TabsContent value="my" className="space-y-4 mt-4">
          {realUserCourses.length === 0 ? (
            <p className="text-center text-gray-500">Դուք դեռ չունեք ավելացված իրական դասընթացներ</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {realUserCourses.map((course) => (
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
