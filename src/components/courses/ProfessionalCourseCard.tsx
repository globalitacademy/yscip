
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
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
      <Card className="flex flex-col w-full overflow-hidden hover:shadow-lg transition-all duration-300 relative group">
        <div className="flex flex-col items-center text-center p-8">
          <div className="mb-6">
            {icon}
          </div>
          
          <h3 className={`font-bold text-xl mb-1 ${course.color}`}>{course.title}</h3>
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-6">{course.subtitle}</p>
          
          <Button 
            variant="outline"
            className="px-10 rounded-full border-gray-300 hover:bg-white hover:text-primary hover:border-primary transition-colors duration-300 mb-6"
            asChild
          >
            <Link to={`/course/${course.id}`}>
              Դիտել
            </Link>
          </Button>
        </div>
        
        <CardFooter className="flex items-center justify-between p-4 border-t bg-gray-50 mt-auto">
          <div className="flex items-center">
            <Clock size={14} className="mr-1 text-muted-foreground" />
            <span className="text-sm">{course.duration}</span>
          </div>
          <div className="text-sm font-semibold">
            {course.price}
          </div>
        </CardFooter>
      </Card>
    </FadeIn>
  );
};

export default ProfessionalCourseCard;
