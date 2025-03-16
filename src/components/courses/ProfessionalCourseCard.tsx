
import React from 'react';
import { Card, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/LocalTransitions';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { courseIcons } from './utils/courseIcons';

interface ProfessionalCourseCardProps {
  course: ProfessionalCourse;
}

const ProfessionalCourseCard: React.FC<ProfessionalCourseCardProps> = ({ course }) => {
  // If the icon is a string, get the corresponding icon component
  const icon = typeof course.icon === 'string' ? courseIcons[course.icon] : course.icon;

  return (
    <FadeIn key={course.id} delay="delay-200" className="flex">
      <Card className="flex flex-col w-full overflow-hidden transition-all duration-300 border border-gray-200 hover:border-gray-300 rounded-md">
        <div className="flex flex-col items-center text-center p-8 pt-10">
          <div className="mb-5">
            {icon}
          </div>
          
          <h3 className={`font-bold text-xl mb-1 ${course.color}`}>{course.title}</h3>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">ԴԱՍԸՆԹԱՑ</p>
          
          <Button 
            variant="outline"
            className="px-10 rounded-full border-gray-300 hover:border-gray-400 hover:bg-transparent transition-all duration-300"
            asChild
          >
            <Link to={`/course/${course.id}`}>
              Դիտել
            </Link>
          </Button>
        </div>
        
        <CardFooter className="flex items-center justify-between py-3 px-6 border-t mt-auto">
          <div className="text-sm text-muted-foreground">
            {course.duration}
          </div>
          <div className="text-sm font-medium">
            {course.price}
          </div>
        </CardFooter>
      </Card>
    </FadeIn>
  );
};

export default ProfessionalCourseCard;
