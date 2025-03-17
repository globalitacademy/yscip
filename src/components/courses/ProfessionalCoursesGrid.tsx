
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building, Lock, Pencil, User } from 'lucide-react';
import { ProfessionalCourse } from './types/ProfessionalCourse';

interface ProfessionalCoursesGridProps {
  courses: ProfessionalCourse[];
  isAdminView?: boolean;
  canEditCourse: (course: ProfessionalCourse) => boolean;
  openEditDialog: (course: ProfessionalCourse) => void;
  handleDeleteCourse: (id: string) => void;
  user: any;
}

const ProfessionalCoursesGrid: React.FC<ProfessionalCoursesGridProps> = ({
  courses,
  isAdminView = false,
  canEditCourse,
  openEditDialog,
  handleDeleteCourse,
  user
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <FadeIn key={course.id} delay="delay-200" className="flex">
          <Card className="flex flex-col w-full hover:shadow-md transition-shadow relative">
            <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
              <Building size={12} className="mr-1" />
              <span>{course.institution}</span>
            </div>

            {course.isPersistent && (
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                  <Lock size={12} className="text-gray-500" />
                </div>
              </div>
            )}

            {canEditCourse(course) && (
              <div className="absolute top-4 right-4 z-10">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6 rounded-full" 
                  onClick={(e) => {
                    e.preventDefault();
                    openEditDialog(course);
                  }}
                >
                  <Pencil size={12} />
                </Button>
              </div>
            )}

            <CardHeader className="pb-2 text-center pt-12 relative">
              {course.imageUrl ? (
                <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const iconElement = document.getElementById(`course-icon-${course.id}`);
                      if (iconElement) iconElement.style.display = 'block';
                    }}
                  />
                </div>
              ) : (
                <div id={`course-icon-${course.id}`} className={`mb-4 ${course.color} mx-auto`}>
                  {course.icon}
                </div>
              )}
              <h3 className="font-bold text-xl">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.subtitle}</p>
            </CardHeader>
            
            <CardContent className="flex-grow pb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <User size={16} />
                <span>Դասախոս՝ {course.createdBy}</span>
              </div>
              
              <div className="flex justify-between w-full text-sm mt-auto">
                <span>{course.duration}</span>
                <span className="font-semibold">{course.price}</span>
              </div>
            </CardContent>
            
            <CardFooter className="pt-4">
              {isAdminView && user && (user.role === 'admin' || user.role === 'instructor') && (
                <div className="w-full flex justify-between gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/course/${course.id}`}>
                      Դիտել
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </Button>
                </div>
              )}
              
              {(!isAdminView || !(user && (user.role === 'admin' || user.role === 'instructor'))) && (
                <Button 
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link to={`/course/${course.id}`}>
                    Մանրամասն
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        </FadeIn>
      ))}
    </div>
  );
};

export default ProfessionalCoursesGrid;
