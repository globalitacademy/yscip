
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useCoursePageContext } from '@/contexts/CoursePageContext';

const CourseOverviewTab: React.FC = () => {
  const { course } = useCoursePageContext();
  
  if (!course) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Դասընթացի մասին</CardTitle>
        <CardDescription>
          Ինչ կսովորեք այս դասընթացում
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-3">Ինչ կսովորեք</h4>
            <ul className="space-y-2">
              {(course.modules || []).slice(0, 4).map((module, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>{module}</span>
                </li>
              ))}
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Իրական նախագծեր և պորտֆոլիո</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Նախապայմաններ</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Համակարգչային բազային գիտելիքներ</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <span>Տրամաբանական մտածելակերպ</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseOverviewTab;
