
import React from 'react';
import { Clock, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCoursePageContext } from '@/contexts/CoursePageContext';

const CourseInfo: React.FC = () => {
  const { course } = useCoursePageContext();
  
  if (!course) return null;
  
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {course.specialization && (
            <Badge variant="outline">{course.specialization}</Badge>
          )}
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="mr-1 h-4 w-4" />
            <span>40 ուսանող</span>
          </div>
          {course.institution && (
            <div className="flex items-center text-muted-foreground">
              <Award className="mr-1 h-4 w-4" />
              <span>{course.institution}</span>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <h3 className="text-xl font-medium mb-3">Դասընթացի նկարագրություն</h3>
          <p className="whitespace-pre-line">{course.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseInfo;
