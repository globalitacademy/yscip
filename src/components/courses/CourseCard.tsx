
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Course } from './types';

interface CourseCardProps {
  course: Course;
  isAdmin: boolean;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isAdmin, onEdit, onDelete }) => {
  return (
    <Card key={course.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-xl">{course.name}</CardTitle>
            <CardDescription>{course.specialization}</CardDescription>
          </div>
          {isAdmin && (
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-primary" 
                onClick={() => onEdit(course)}
              >
                <Pencil size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive" 
                onClick={() => onDelete(course.id)}
              >
                ✕
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{course.description}</p>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Տևողություն:</span>
            <span>{course.duration}</span>
          </div>
          <div className="text-sm">
            <div className="font-semibold mb-1">Մոդուլներ:</div>
            <ul className="list-disc list-inside">
              {course.modules.map((module, index) => (
                <li key={index} className="text-sm">{module}</li>
              ))}
            </ul>
          </div>
          <div className="pt-2">
            <Button size="sm" className="w-full">Դիտել մանրամասները</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
