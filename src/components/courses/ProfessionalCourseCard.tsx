
import React from 'react';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";

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
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        {/* Icon or Image */}
        {course.image_url ? (
          <div className="aspect-[3/2] overflow-hidden">
            <img 
              src={course.image_url} 
              alt={course.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`aspect-[3/2] flex items-center justify-center ${course.color.replace('text-', 'bg-').replace('-500', '-100')}`}>
            <div className={course.color}>
              {course.icon}
            </div>
          </div>
        )}
        
        {/* Admin Actions */}
        {canEdit && (
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(course)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Խմբագրել</span>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onDelete(course.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Հեռացնել</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{course.subtitle}</p>
          <h3 className="font-bold text-xl mt-1">{course.title}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Տևողություն</p>
            <p className="font-medium">{course.duration}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Արժեք</p>
            <p className="font-medium">{course.price}</p>
          </div>
        </div>
        
        <div className="text-sm">
          <p className="text-muted-foreground">Դասախոս՝ {course.created_by}</p>
          <p className="text-muted-foreground">{course.institution}</p>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/course/${course.id}`}>
            {course.button_text}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalCourseCard;
