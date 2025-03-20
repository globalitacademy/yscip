
import React from 'react';
import { Course } from '@/components/courses/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CourseSidebarProps {
  course: Course;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ course }) => {
  return (
    <Card className="mb-6 sticky top-4">
      <CardHeader>
        <CardTitle>Գրանցվել դասընթացին</CardTitle>
        <CardDescription>
          Դասընթացն սկսելու համար գրանցվեք և վճարեք
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">{course.price}</div>
        
        <Button className="w-full mb-3">Գրանցվել դասընթացին</Button>
        <Button variant="outline" className="w-full flex items-center justify-center">
          <Bookmark className="mr-2 h-4 w-4" />
          Ավելացնել հավաքածուում
        </Button>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <div className="flex items-start">
            <FileText className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium">Դասընթացը ներառում է</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>24 տեսադաս</li>
                <li>12 գործնական առաջադրանք</li>
                <li>6 թեստ</li>
                <li>Ավարտական հավաստագիր</li>
                <li>Անսահմանափակ հասանելիություն</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseSidebar;
