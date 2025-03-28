
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from './types';
import { Button } from '@/components/ui/button';
import { Clock, User, ExternalLink, Ban, Check } from 'lucide-react';
import { toast } from 'sonner';
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
    toast.success("Շնորհակալություն գրանցման համար", {
      description: "Ձեր դիմումը հաջողությամբ ուղարկվել է։ Մենք շուտով կկապվենք ձեզ հետ:",
    });
  };

  const handleContact = () => {
    toast.success("Հարցումը ուղարկված է", {
      description: "Մենք շուտով կկապվենք ձեզ հետ:",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-blue-50 rounded-xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
          <img 
            src="/lovable-uploads/c0b6b239-61c4-4c00-b3a2-f6801185d46b.png" 
            alt="Code background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              <span>Դասախոս՝ {course.createdBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              <span>Տևողություն՝ {course.duration}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleRegister} className="bg-blue-500 hover:bg-blue-600">
              Դիմել դասընթացին
            </Button>
            <Button variant="outline" onClick={handleContact}>
              Կապ հաստատել
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Curriculum Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Դասընթացի ծրագիր</h2>
            <div className="space-y-3">
              {course.lessons?.map((lesson, index) => (
                <div key={index} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium">{lesson.title}</span>
                  </div>
                  <span className="text-sm text-gray-500">{lesson.duration}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Learning Outcomes Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Ինչ կսովորեք</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.outcomes?.map((outcome, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check size={20} className="text-green-500 mt-1 shrink-0" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </section>
          
          {/* Requirements Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Պահանջներ</h2>
            <div className="space-y-3">
              {course.requirements?.map((req, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Ban size={20} className="text-red-500 mt-1 shrink-0" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
        
        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="border rounded-lg overflow-hidden sticky top-4">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">Դասընթացի մանրամասներ</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Արժեք</span>
                  <span className="font-bold">{course.price || "55,000 ֏"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Տևողություն</span>
                  <span>{course.duration || "48 ԺԱՄ"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Դասերի քանակ</span>
                  <span>{course.lessons?.length || 3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Հաստատություն</span>
                  <span>{course.institution || "Web Academy"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Դասախոս</span>
                  <span>{course.createdBy || "John Smith"}</span>
                </div>
              </div>
              
              <Button onClick={handleRegister} className="w-full bg-blue-500 hover:bg-blue-600 mb-3">
                Դիմել դասընթացին
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <a href="#" className="flex items-center justify-center">
                  Ներբեռնել ծրագիրը <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
