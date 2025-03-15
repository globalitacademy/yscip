
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Course } from './types';
import { Edit, Trash2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface CourseCardProps {
  course: Course;
  isAdmin: boolean;
  canEdit: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isAdmin, canEdit, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  // Check if the course was created by the current user
  const isCreatedByCurrentUser = course.createdBy === user?.id;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{course.name}</CardTitle>
            {course.specialization && (
              <Badge variant="outline" className="mt-1">
                {course.specialization}
              </Badge>
            )}
          </div>
          <Badge>{course.duration}</Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mt-2">
          <h4 className="text-sm font-medium mb-2">Մոդուլներ ({course.modules.length})</h4>
          <ul className="text-sm space-y-1">
            {course.modules.slice(0, 3).map((module, index) => (
              <li key={index} className="text-muted-foreground">
                • {module}
              </li>
            ))}
            {course.modules.length > 3 && (
              <li className="text-muted-foreground">
                • ... և {course.modules.length - 3} այլ
              </li>
            )}
          </ul>
        </div>
        
        {/* Display course creator information */}
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <User size={14} className="mr-1" />
          {isCreatedByCurrentUser ? (
            <span>Ձեր կողմից ստեղծված</span>
          ) : (
            <span>{course.createdBy === 'admin' ? 'Ադմինիստրատորի' : 'Դասախոսի'} կողմից ստեղծված</span>
          )}
        </div>
      </CardContent>
      {canEdit && (
        <CardFooter className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
            <Edit className="h-4 w-4 mr-1" />
            Խմբագրել
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(course.id)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Ջնջել
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default CourseCard;
