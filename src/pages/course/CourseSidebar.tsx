
import React from 'react';
import { Bookmark, FileText, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCoursePageContext } from '@/contexts/CoursePageContext';

const CourseSidebar: React.FC = () => {
  const { course, enrollmentStatus, handleEnroll } = useCoursePageContext();
  
  if (!course) return null;
  
  const renderEnrollmentButton = () => {
    switch (enrollmentStatus) {
      case 'enrolled':
        return (
          <Button className="w-full mb-3 bg-green-600 hover:bg-green-700" disabled>
            <Check className="mr-2 h-4 w-4" />
            Գրանցված եք
          </Button>
        );
      case 'pending':
        return (
          <Button className="w-full mb-3 bg-amber-500 hover:bg-amber-600" disabled>
            Սպասվում է հաստատման
          </Button>
        );
      default:
        return (
          <Button className="w-full mb-3" onClick={handleEnroll}>
            Գրանցվել դասընթացին
          </Button>
        );
    }
  };
  
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
        
        {renderEnrollmentButton()}
        
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
      <CardFooter className="flex flex-col items-start gap-2 pt-0">
        <h4 className="font-medium">Կիսվել</h4>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Facebook</Button>
          <Button variant="outline" size="sm">LinkedIn</Button>
          <Button variant="outline" size="sm">Twitter</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseSidebar;
