
import React from 'react';
import { Course } from '@/components/courses/types';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, School, User, Edit } from 'lucide-react';

interface CourseViewModeProps {
  course: Course;
  canEdit: boolean;
  handleEditToggle: () => void;
  handleEnroll: () => void;
}

const CourseViewMode: React.FC<CourseViewModeProps> = ({
  course,
  canEdit,
  handleEditToggle,
  handleEnroll
}) => {
  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
            <CardDescription className="mt-2 text-lg">{course.subtitle}</CardDescription>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {course.specialization && (
                <Badge variant="outline" className="px-3 py-1 font-normal">
                  {course.specialization}
                </Badge>
              )}
              <Badge variant="secondary" className="px-3 py-1 font-normal">
                <Clock className="h-4 w-4 mr-1" />
                {course.duration}
              </Badge>
            </div>
          </div>
          
          <div className="text-right flex items-start gap-2">
            {canEdit && (
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                <Edit className="h-4 w-4 mr-1" />
                Խմբագրել
              </Button>
            )}
            <div className="text-2xl font-bold text-primary">{course.price}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6 space-y-6">
        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-3">Դասընթացի նկարագրությունը</h3>
          <p className="whitespace-pre-line">{course.description}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium flex items-center mb-3">
                  <BookOpen className="h-5 w-5 mr-2 text-amber-500" />
                  Դասընթացի մանրամասներ
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Հաստատություն: {course.institution || 'Qolej'}</span>
                  </li>
                  <li className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Դասավանդող: {course.createdBy === 'admin' ? 'Qolej թիմ' : 'Դասախոս'}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Card className="h-full">
              <CardContent className="p-4 flex flex-col h-full justify-between">
                <div>
                  <h3 className="font-medium mb-3">Գրանցվելու համար</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Գրանցվեք հիմա և սկսեք ձեր ուսումնական ճանապարհորդությունը։
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleEnroll}
                >
                  Գրանցվել դասընթացին
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default CourseViewMode;
