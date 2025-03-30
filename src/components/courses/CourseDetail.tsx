
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { getCourseById } from './utils/courseUtils';
import { toast } from 'sonner';
import { 
  Book, CheckCircle, Clock, Edit, 
  ExternalLink, Globe, Loader2, User, 
  ChevronDown, ChevronUp, Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllOutcomes, setShowAllOutcomes] = useState(false);
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const courseData = await getCourseById(id);
        if (courseData) {
          setCourse(courseData);
        } else {
          toast.error('Դասընթացը չհաջողվեց գտնել');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEditCourse = () => {
    navigate(`/course/${id}`);
  };

  const handleApply = () => {
    toast.success('Դիմումն ուղարկված է');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Բեռնում...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h1>
          <Button onClick={() => navigate('/courses')}>Վերադառնալ դասընթացների էջ</Button>
        </div>
      </div>
    );
  }

  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Course Header Banner */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-100 to-violet-100 mb-8">
        <div className="absolute inset-0 opacity-10">
          {course.imageUrl && (
            <img 
              src={course.imageUrl} 
              alt={course.title}
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover rounded-full" />
              ) : (
                course.icon || <Book className="w-12 h-12 text-primary" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2">
                {course.is_public && (
                  <Badge className="mb-2 bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
                    <Globe className="w-3 h-3 mr-1" /> Հրապարակված
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                <p className="text-lg text-gray-600 mt-2">{course.subtitle}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center my-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-indigo-600 mr-2" />
                  <span>{course.createdBy || 'Անանուն'}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-indigo-600 mr-2" />
                  <span>{course.duration}</span>
                </div>
                {course.institution && (
                  <div className="flex items-center">
                    <Book className="w-5 h-5 text-indigo-600 mr-2" />
                    <span>{course.institution}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button 
                  onClick={handleApply}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Դիմել դասընթացին
                </Button>
                
                {canEdit && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleEditCourse}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Խմբագրել
                  </Button>
                )}
                
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="mb-6">
              <TabsTrigger value="description">Նկարագրություն</TabsTrigger>
              <TabsTrigger value="curriculum">Դասընթացի պլան</TabsTrigger>
              <TabsTrigger value="outcomes">Ակնկալվող արդյունքներ</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="space-y-6">
              <div className="prose max-w-none">
                {course.description ? (
                  <div>
                    {course.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Դասընթացի մանրամասն նկարագրությունը բացակայում է։</p>
                )}
              </div>
              
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Պահանջներ</h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5 mr-2 bg-red-100 rounded-full p-1">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="curriculum">
              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    {course.lessons.map((lesson, index) => (
                      <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg px-2 py-1 mb-2">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            <div className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <div className="text-left">
                              <h3 className="font-medium">{lesson.title}</h3>
                              <p className="text-sm text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-14">
                          <p>Դասի մանրամասներ հասանելի կլինեն գրանցվելուց հետո:</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                  <Book className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-gray-500">Դասընթացի պլանը դեռ հասանելի չէ</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="outcomes">
              {course.outcomes && course.outcomes.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {(showAllOutcomes ? course.outcomes : course.outcomes.slice(0, 6)).map((outcome, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                  
                  {course.outcomes.length > 6 && (
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowAllOutcomes(!showAllOutcomes)}
                      className="flex items-center mx-auto"
                    >
                      {showAllOutcomes ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Ցույց տալ ավելի քիչ
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          Ցույց տալ բոլորը ({course.outcomes.length})
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                  <p className="text-gray-500">Ակնկալվող արդյունքների ցանկը հասանելի չէ</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden sticky top-8">
            {course.imageUrl && (
              <div className="h-40 w-full">
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="p-6">
              {course.price && (
                <div className="mb-4">
                  <p className="text-2xl font-bold">{course.price}</p>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Տևողություն</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Դասերի քանակ</span>
                  <span className="font-medium">{course.lessons ? course.lessons.length : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Դասախոս</span>
                  <span className="font-medium">{course.createdBy || 'Անանուն'}</span>
                </div>
                {course.institution && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Հաստատություն</span>
                    <span className="font-medium">{course.institution}</span>
                  </div>
                )}
              </div>
              
              <Button onClick={handleApply} className="w-full mb-3">
                Դիմել դասընթացին
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <a href="#" className="flex items-center justify-center">
                  Ներբեռնել ծրագիրը <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              <div className="mt-6 border-t pt-6">
                <h3 className="font-medium mb-3">Առավելություններ</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                    <span>Անհատական ուշադրություն</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                    <span>Պրակտիկ հմտություններ</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                    <span>Ավարտական փաստաթուղթ</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2" />
                    <span>Աջակցություն</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
