
import React from 'react';
import { Course } from './types';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit2, Trash2, AlertTriangle, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useCourseContext } from '@/contexts/CourseContext';

interface CourseListProps {
  courses: Course[];
  professionalCourses: ProfessionalCourse[];
  userPermissions?: any;
  currentUserId?: string;
  // Optional functions for when used outside of CourseProvider
  onEditCourse?: (course: Course) => void;
  onDeleteCourse?: (course: Course) => void;
  onEditProfessionalCourse?: (course: ProfessionalCourse) => void;
  onDeleteProfessionalCourse?: (id: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  professionalCourses,
  userPermissions,
  currentUserId,
  onEditCourse,
  onDeleteCourse,
  onEditProfessionalCourse,
  onDeleteProfessionalCourse
}) => {
  // Try to use the context, but don't throw an error if it's not available
  const courseContext = React.useContext(React.createContext<any>(null));
  
  // Functions to handle course actions, using context if available, props otherwise
  const handleEditCourse = (course: Course) => {
    if (courseContext?.handleEditInit) {
      courseContext.handleEditInit(course);
    } else if (onEditCourse) {
      onEditCourse(course);
    }
  };
  
  const handleDeleteCourse = (course: Course) => {
    if (courseContext?.handleOpenDeleteDialog) {
      courseContext.handleOpenDeleteDialog(course);
    } else if (onDeleteCourse) {
      onDeleteCourse(course);
    }
  };
  
  const handleEditProfessionalCourse = (course: ProfessionalCourse) => {
    if (courseContext?.handleEditProfessionalCourseInit) {
      courseContext.handleEditProfessionalCourseInit(course);
    } else if (onEditProfessionalCourse) {
      onEditProfessionalCourse(course);
    }
  };
  
  const handleDeleteProfessionalCourse = (id: string) => {
    if (courseContext?.handleDeleteProfessionalCourse) {
      courseContext.handleDeleteProfessionalCourse(id);
    } else if (onDeleteProfessionalCourse) {
      onDeleteProfessionalCourse(id);
    }
  };

  if (courses.length === 0 && professionalCourses.length === 0) {
    return (
      <Card className="bg-muted">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Դասընթացներ չեն գտնվել</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Professional Courses Section */}
      {professionalCourses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Մասնագիտական դասընթացներ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {professionalCourses.map((course) => {
              const canEdit = userPermissions?.canEditCourse(course.createdBy);
              const canDelete = userPermissions?.canDeleteCourse(course.createdBy);
              const isOwnCourse = course.createdBy === currentUserId;
              const pendingApproval = isOwnCourse && !course.is_public && userPermissions?.requiresApproval;
              
              return (
                <Card key={course.id} className="flex flex-col h-full overflow-hidden">
                  <CardHeader className="pb-4 relative">
                    {pendingApproval && (
                      <Badge variant="outline" className="absolute right-4 top-3 bg-amber-50 text-amber-800 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" /> Սպասում է հաստատման
                      </Badge>
                    )}
                    {course.is_public && (
                      <Badge variant="outline" className="absolute right-4 top-3 bg-green-50 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Հաստատված
                      </Badge>
                    )}
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${course.color}`}>
                        {course.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-0 flex-grow">
                    <p className="line-clamp-2 text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-muted-foreground">{course.duration}</div>
                      {course.price && (
                        <Badge variant="secondary">{course.price} ֏</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 flex justify-between">
                    <Button variant="default" size="sm" asChild>
                      <Link to={`/course/${course.id}`}>{course.buttonText || 'Դիտել'}</Link>
                    </Button>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditProfessionalCourse(course)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteProfessionalCourse(course.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Standard Courses Section */}
      {courses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Ստանդարտ դասընթացներ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const canEdit = userPermissions?.canEditCourse(course.createdBy);
              const canDelete = userPermissions?.canDeleteCourse(course.createdBy);
              const isOwnCourse = course.createdBy === currentUserId;
              const pendingApproval = isOwnCourse && !course.is_public && userPermissions?.requiresApproval;
              
              return (
                <Card key={course.id} className="flex flex-col h-full overflow-hidden">
                  <CardHeader>
                    {pendingApproval && (
                      <Badge variant="outline" className="absolute right-4 top-3 bg-amber-50 text-amber-800 border-amber-200">
                        <Clock className="h-3 w-3 mr-1" /> Սպասում է հաստատման
                      </Badge>
                    )}
                    {course.is_public && (
                      <Badge variant="outline" className="absolute right-4 top-3 bg-green-50 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Հաստատված
                      </Badge>
                    )}
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.specialization}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-0 flex-grow">
                    <p className="line-clamp-3 text-sm text-muted-foreground mb-4">{course.description}</p>
                    <div className="mt-2 flex justify-between">
                      <span className="text-sm text-muted-foreground">Տևողություն: {course.duration}</span>
                      <span className="text-sm text-muted-foreground">Հեղինակ: {course.instructor}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 flex justify-between">
                    <Button variant="default" size="sm" asChild>
                      <Link to={`/course/${course.id}`}>Դիտել</Link>
                    </Button>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditCourse(course)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteCourse(course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;
