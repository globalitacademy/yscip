
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2, Building, User } from 'lucide-react';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  onDelete,
}) => {
  return (
    <Card className="flex flex-col w-full hover:shadow-md transition-shadow relative">
      {canEdit && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(course)}>
              <Pencil className="mr-2 h-4 w-4" />
              Խմբագրել
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(course.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Ջնջել
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
        <Building size={12} className="mr-1" />
        <span>{course.institution}</span>
      </div>

      <CardHeader className="pb-2 text-center pt-12">
        <div className={`mb-4 ${course.color} mx-auto`}>
          {course.icon}
        </div>
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
        <Button 
          variant="outline"
          className="w-full"
          asChild
        >
          <Link to={`/course/${course.id}`}>
            Մանրամասն
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCourseCard;
