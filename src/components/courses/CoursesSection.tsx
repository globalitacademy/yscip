
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Book, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Course } from './types';
import CourseSectionCard from './CourseSectionCard';

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
            <CourseSectionCard key={course.id} course={course} onClick={() => navigate('/courses')} />
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
