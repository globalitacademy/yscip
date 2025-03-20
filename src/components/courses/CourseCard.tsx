
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Course } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PenSquare, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CourseIconComponent } from './CourseIcons';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
  isAdmin?: boolean;
  canEdit?: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
  url: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isAdmin = false,
  canEdit = false,
  onEdit,
  onDelete,
  url,
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(course);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(course.id);
  };

  const IconComponent = CourseIconComponent(course.icon_name);

  return (
    <Card className="overflow-hidden">
      <Link to={url} className="block h-full">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start">
            <div
              className={`p-2 rounded-md ${
                course.color || 'text-amber-500'
              } bg-amber-50`}
            >
              <IconComponent className="h-6 w-6" />
            </div>

            {isAdmin && canEdit && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="sr-only">Բացել մենյուն</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <PenSquare className="mr-2 h-4 w-4" />
                    Խմբագրել
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Հեռացնել
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              {course.subtitle || 'ԴԱՍԸՆԹԱՑ'}
            </p>
            <h3 className="font-bold">{course.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {course.duration}
          </div>
          <Button variant="outline" size="sm">
            {course.button_text || 'Դիտել'}
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default CourseCard;
