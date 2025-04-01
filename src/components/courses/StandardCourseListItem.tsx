
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Edit2, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Course } from './types';

interface StandardCourseListItemProps {
  course: Course;
  canEdit: boolean;
  canDelete: boolean;
  isOwnCourse: boolean;
  pendingApproval: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const StandardCourseListItem: React.FC<StandardCourseListItemProps> = ({
  course,
  canEdit,
  canDelete,
  isOwnCourse,
  pendingApproval,
  onEdit,
  onDelete
}) => {
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
              onClick={() => onEdit(course)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {canDelete && (
            <Button 
              variant="outline" 
              size="icon"
              className="text-destructive"
              onClick={() => onDelete(course)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default StandardCourseListItem;
