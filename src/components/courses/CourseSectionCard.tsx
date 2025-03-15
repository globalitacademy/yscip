
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, Users, Clock } from 'lucide-react';
import { Course } from './types';

interface CourseSectionCardProps {
  course: Course;
  onClick: () => void;
}

const CourseSectionCard: React.FC<CourseSectionCardProps> = ({ course, onClick }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{course.name}</CardTitle>
            {course.specialization && (
              <Badge variant="outline" className="mt-1">
                {course.specialization}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{course.description}</p>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={16} className="mr-1" />
            <span>{course.duration}</span>
            
            <div className="mx-2 w-1 h-1 rounded-full bg-muted-foreground/70"></div>
            
            <Users size={16} className="mr-1" />
            <span>Նշանակված: 12</span>
          </div>
          
          {course.modules.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-1 flex items-center">
                <Book size={16} className="mr-1" />
                Մոդուլներ ({course.modules.length})
              </div>
              <div className="flex flex-wrap gap-1">
                {course.modules.slice(0, 3).map((module, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {module}
                  </Badge>
                ))}
                {course.modules.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{course.modules.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full"
            onClick={onClick}
          >
            Դիտել կուրսը
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSectionCard;
