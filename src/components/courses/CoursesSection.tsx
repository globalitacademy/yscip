
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Course {
  id: string;
  name: string;
  description: string;
  specialization?: string;
  duration: string;
  modules: string[];
}

const CoursesSection: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load courses from localStorage
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        setCourses(parsedCourses);
      } catch (e) {
        console.error('Error parsing stored courses:', e);
      }
    }
  }, []);

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Մեր կուրսերը</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ուսումնասիրեք մեր կրթական մոդուլները, որոնք նախագծված են ձեր մասնագիտական հմտությունները զարգացնելու համար
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    {course.specialization && (
                      <Badge variant="outline" className="mt-1">
                        {course.specialization}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={16} className="mr-1" />
                    <span>{course.duration}</span>
                    
                    <div className="mx-2 w-1 h-1 rounded-full bg-muted-foreground/70"></div>
                    
                    <Users size={16} className="mr-1" />
                    <span>Նշանակված: 12</span>
                  </div>
                  
                  {course.modules.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1 flex items-center">
                        <Book size={16} className="mr-1" />
                        Մոդուլներ ({course.modules.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {course.modules.slice(0, 3).map((module, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                        {course.modules.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{course.modules.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/courses')}
                  >
                    Դիտել կուրսը
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/courses')}
          >
            Դիտել բոլոր կուրսերը
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
