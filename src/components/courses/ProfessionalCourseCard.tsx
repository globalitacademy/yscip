
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, User, Clock, CalendarDays } from 'lucide-react';
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
      <Card className="flex flex-col w-full overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 relative group" style={{ borderTopColor: course.color.replace('text-', '').includes('-') ? `var(--${course.color.replace('text-', '')})` : '#8B5CF6' }}>
        <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
          <Building size={12} className="mr-1" />
          <span>{course.institution}</span>
        </div>
        
        <CardHeader className="pb-2 text-center pt-14">
          <div className={`mb-4 ${course.color} mx-auto transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="font-bold text-xl mb-1">{course.title}</h3>
          <p className="text-sm text-muted-foreground uppercase tracking-wider">{course.subtitle}</p>
        </CardHeader>
        
        <CardContent className="flex-grow pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <User size={16} />
            <span>Դասախոս՝ {course.createdBy}</span>
          </div>
          
          <div className="flex flex-col space-y-2 w-full text-sm mt-auto">
            <div className="flex items-center">
              <Clock size={15} className="mr-2 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays size={15} className="mr-2 text-muted-foreground" />
              <span className="font-semibold">{course.price}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            variant="default"
            className="w-full rounded-md group-hover:bg-primary transition-colors duration-300"
            asChild
          >
            <Link to={`/course/${course.id}`}>
              Մանրամասն
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </FadeIn>
  );
};

export default ProfessionalCourseCard;
