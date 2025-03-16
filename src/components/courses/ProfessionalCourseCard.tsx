
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, DollarSign, Trash2, Edit, User, Building } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ProfessionalCourse } from './types/ProfessionalCourse';

interface ProfessionalCourseCardProps {
  course: ProfessionalCourse;
  isAdmin: boolean;
  canEdit: boolean;
  onEdit: (course: ProfessionalCourse) => void;
  onDelete: (id: string) => void;
}

const ProfessionalCourseCard: React.FC<ProfessionalCourseCardProps> = ({ 
  course, 
  isAdmin, 
  canEdit, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 relative">
        {(isAdmin || canEdit) && (
          <div className="absolute right-4 top-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem onClick={() => onEdit(course)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Խմբագրել
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem 
                    className="text-destructive" 
                    onClick={() => onDelete(course.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Ջնջել
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        <div className="flex justify-center">
          <div className={`${course.color} rounded-full p-3 mb-2`}>
            {course.icon}
          </div>
        </div>
        <CardTitle className="text-center">{course.title}</CardTitle>
        <CardDescription className="text-center">{course.subtitle}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <DollarSign size={16} />
            <span>{course.price}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={16} />
          <span>Դասախոս՝ {course.createdBy}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building size={16} />
          <span>Ուս․ հաստատություն՝ {course.institution}</span>
        </div>
        
        {course.description && (
          <p className="text-sm mt-2">{course.description}</p>
        )}
      </CardContent>
      
      <CardFooter>
        <Button className="w-full" variant="outline">
          Մանրամասն
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCourseCard;
