
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from './types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Award, ArrowLeft, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { saveCourseChanges, getAllCoursesFromSupabase } from './utils/courseUtils';

const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      console.log("Looking for course with slug:", slug);
      
      try {
        // First try to get courses from Supabase
        const supabaseCourses = await getAllCoursesFromSupabase();
        if (supabaseCourses && supabaseCourses.length > 0) {
          console.log("Got courses from Supabase:", supabaseCourses.length);
          const foundCourse = supabaseCourses.find(c => c.slug === slug || c.id === slug);
          if (foundCourse) {
            console.log("Found course in Supabase:", foundCourse.title);
            setCourse(foundCourse);
            setLoading(false);
            return;
          }
        }
        
        // If not found in Supabase, try localStorage
        const storedCourses = localStorage.getItem('professionalCourses');
        if (storedCourses && slug) {
          try {
            const parsedCourses: ProfessionalCourse[] = JSON.parse(storedCourses);
            console.log("Looking for course with slug/id:", slug);
            console.log("Available courses in localStorage:", parsedCourses.length);
            
            // Find course by slug or id
            const foundCourse = parsedCourses.find(
              (c) => c.slug === slug || c.id === slug
            );
            
            if (foundCourse) {
              console.log("Found course in localStorage:", foundCourse.title);
              setCourse(foundCourse);
              
              // Sync back to Supabase
              await saveCourseChanges(foundCourse);
            } else {
              console.log("Course not found with slug/id:", slug);
            }
          } catch (e) {
            console.error('Error parsing stored professional courses:', e);
          }
        } else {
          console.log("No stored courses or no slug provided");
        }
      } catch (error) {
        console.error("Error fetching course:", error);
      }
      
      setLoading(false);
    };
    
    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h1>
          <p className="text-muted-foreground mb-6">
            Փորձեք ուրիշ դասընթաց կամ վերադարձեք բոլոր դասընթացների էջ
          </p>
          <Button onClick={() => navigate('/courses')}>Վերադառնալ դասընթացներ</Button>
        </div>
      </div>
    );
  }

  // Handle registration
  const handleRegister = () => {
    toast({
      title: "Շնորհակալություն գրանցման համար",
      description: "Ձեր դիմումը հաջողությամբ ուղարկվել է։ Մենք շուտով կկապվենք ձեզ հետ:",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate('/courses')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Վերադառնալ դասընթացներ
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.subtitle}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Մեկնարկ՝ ցանկացած ժամանակ</span>
              </div>
              <div className="flex items-center text-sm">
                <Award className="h-4 w-4 mr-2" />
                <span>{course.institution}</span>
              </div>
            </div>
            
            {course.imageUrl && (
              <img 
                src={course.imageUrl} 
                alt={course.title} 
                className="w-full h-64 object-cover rounded-lg mb-6" 
              />
            )}
            
            <div className="prose max-w-none">
              <p>{course.description}</p>
            </div>
          </div>
          
          {/* Course Curriculum */}
          {course.lessons && course.lessons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Դասընթացի ծրագիր</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {course.lessons.map((lesson, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                          <span>{lesson.title}</span>
                          <span className="text-muted-foreground text-sm">{lesson.duration}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">Դասի մանրամասն նկարագրություն</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
          
          {/* What You'll Learn */}
          {course.outcomes && course.outcomes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ինչ կսովորեք</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Պահանջներ</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold mb-2">{course.price}</p>
                <p className="text-muted-foreground">Ամբողջական դասընթաց</p>
              </div>
              
              <Button className="w-full mb-4" onClick={handleRegister}>Գրանցվել դասընթացին</Button>
              
              <div className="space-y-4 mt-6">
                <div className="flex justify-between">
                  <span>Դասընթացի տևողություն</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Դասեր</span>
                  <span className="font-medium">{course.lessons?.length || 0}</span>
                </div>
                {course.organizationLogo && (
                  <div className="flex justify-center mt-6">
                    <img 
                      src={course.organizationLogo} 
                      alt={course.institution} 
                      className="h-16 object-contain" 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
