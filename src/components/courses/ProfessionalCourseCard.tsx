
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, User } from 'lucide-react';
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
      <Card className="flex flex-col w-full hover:shadow-md transition-shadow relative">
        <div className="absolute top-4 left-4 flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full z-10">
          <Building size={12} className="mr-1" />
          <span>{course.institution}</span>
        </div>
        <CardHeader className="pb-2 text-center pt-12">
          <div className={`mb-4 ${course.color} mx-auto`}>
            {icon}
          </div>
          <h3 className="font-bold text-xl">{course.title}</h3>
          <p className="text-sm text-muted-foreground">{course.subtitle}</p>
        </CardHeader>
        
        <CardContent className="flex-grow pb-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <User size={16} />
            <span>Դասախոս՝ {course.createdBy}</span>
          </div>
          
          <div className="flex justify-between w-full text-sm mt-auto">
            <span>{course.duration}</span>
            <span className="font-semibold">{course.price}</span>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            variant="outline"
            className="w-full"
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
