
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface CourseTabContentProps {
  course: ProfessionalCourse;
  onEditClick?: () => void;
  canEdit?: boolean;
}

const CourseTabContent: React.FC<CourseTabContentProps> = ({ course, onEditClick, canEdit }) => {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="description">Նկարագրություն</TabsTrigger>
        <TabsTrigger value="curriculum">Դասընթացի պլան</TabsTrigger>
        <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
        <TabsTrigger value="outcomes">Արդյունքներ</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="mt-0 w-full">
        <Card className="w-full">
          <CardContent className="pt-6">
            {course.description ? (
              <div className="prose max-w-none">
                {course.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Դասընթացի մանրամասն նկարագրությունը բացակայում է։</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="curriculum" className="mt-0 w-full">
        <Card className="w-full">
          <CardContent className="pt-6">
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {lesson.duration}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Դասընթացի պլանը դեռ հասանելի չէ։</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="requirements" className="mt-0 w-full">
        <Card className="w-full">
          <CardContent className="pt-6">
            {course.requirements && course.requirements.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Դասընթացին մասնակցելու համար նախնական պահանջներ չկան։</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="outcomes" className="mt-0 w-full">
        <Card className="w-full">
          <CardContent className="pt-6">
            {course.outcomes && course.outcomes.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {course.outcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Դասընթացի ուսումնառության արդյունքները դեռ նշված չեն։</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CourseTabContent;
