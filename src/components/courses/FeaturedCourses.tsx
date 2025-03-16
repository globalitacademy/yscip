
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/LocalTransitions';
import { Code, BrainCircuit, BookText, FileCode } from 'lucide-react';

interface FeaturedCourse {
  id: string;
  title: string;
  icon: React.ReactNode;
  duration: string;
  price: string;
  color: string;
}

const featuredCourses: FeaturedCourse[] = [
  {
    id: '1',
    title: 'WEB Front-End',
    icon: <Code className="h-16 w-16" />,
    duration: '9 ամիս',
    price: '58,000 ֏',
    color: 'text-amber-500',
  },
  {
    id: '2',
    title: 'Python (ML / AI)',
    icon: <BrainCircuit className="h-16 w-16" />,
    duration: '7 ամիս',
    price: '68,000 ֏',
    color: 'text-blue-500',
  },
  {
    id: '3',
    title: 'Java',
    icon: <BookText className="h-16 w-16" />,
    duration: '6 ամիս',
    price: '68,000 ֏',
    color: 'text-red-500',
  },
  {
    id: '4',
    title: 'JavaScript',
    icon: <FileCode className="h-16 w-16" />,
    duration: '3.5 ամիս',
    price: '58,000 ֏',
    color: 'text-yellow-500',
  }
];

const FeaturedCourses: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <FadeIn>
          <h2 className="text-3xl font-bold">
            Ծրագրավորման դասընթացներ
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-100">
          <p className="text-muted-foreground">
            Ծրագրավորման դասընթացներ նախատեսված սկսնակների համար
          </p>
        </FadeIn>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredCourses.map((course) => (
          <FadeIn key={course.id} delay="delay-200" className="flex">
            <Card className="flex flex-col w-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 text-center">
                <div className={`mb-4 ${course.color} mx-auto`}>
                  {course.icon}
                </div>
                <h3 className="font-bold text-xl">{course.title}</h3>
                <p className="text-sm text-muted-foreground">ԴԱՍԸՆԹԱՑ</p>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="flex justify-between w-full text-sm mt-auto">
                  <span>{course.duration}</span>
                  <span className="font-semibold">{course.price}</span>
                </div>
              </CardContent>
              
              <CardFooter className="pt-2">
                <Button 
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link to={`/course/${course.id}`}>
                    Դիտել
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCourses;
