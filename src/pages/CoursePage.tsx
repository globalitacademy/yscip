
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Bookmark, Award, FileText, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Course } from '@/components/courses/types';
import { useAuth } from '@/contexts/AuthContext';

const CoursePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState<'not_enrolled' | 'pending' | 'enrolled'>('not_enrolled');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        if (!id) return;

        // First try to fetch from Supabase by ID
        let { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        // If not found by ID, try to match by slug-like ID (lowercase title)
        if (error || !data) {
          const { data: allCourses, error: coursesError } = await supabase
            .from('courses')
            .select('*');
            
          if (coursesError) throw coursesError;
          
          // Find a course with matching ID or where the lowercase title matches the ID
          data = allCourses.find(course => 
            course.id === id || 
            course.title.toLowerCase().replace(/\s+/g, '-') === id ||
            course.title.toLowerCase() === id
          );
        }

        if (data) {
          // Map the database course to our Course type
          const mappedCourse: Course = {
            id: data.id,
            title: data.title,
            description: data.description || '',
            specialization: data.specialization || undefined,
            duration: data.duration,
            modules: data.modules || [],
            createdBy: data.created_by || 'unknown',
            color: data.color,
            button_text: data.button_text,
            icon_name: data.icon_name,
            subtitle: data.subtitle,
            price: data.price,
            image_url: data.image_url,
            institution: data.institution,
            is_persistent: data.is_persistent
          };
          
          setCourse(mappedCourse);

          // Check enrollment status if user is logged in
          if (user) {
            checkEnrollmentStatus(data.id);
          }
        } else {
          // Fallback to demo courses like in CourseDetailPage
          const featuredCourses = [
            {
              id: "web-frontend",
              title: "WEB Front-End",
              subtitle: "ԴԱՍԸՆԹԱՑ",
              description: "Web ծրագրավորման հիմունքներ և ժամանակակից front-end տեխնոլոգիաներ",
              duration: "9 ամիս",
              price: "58,000 ֏",
              icon_name: "Code",
              modules: ["HTML և CSS", "JavaScript հիմունքներ", "React Framework", "Responsive Design"]
            },
            {
              id: "python-ml-ai",
              title: "Python (ML / AI)",
              subtitle: "ԴԱՍԸՆԹԱՑ",
              description: "Python ծրագրավորման լեզու, տվյալների վերլուծություն և արհեստական բանականություն",
              duration: "7 ամիս",
              price: "68,000 ֏",
              icon_name: "FileCode",
              modules: ["Python հիմունքներ", "Տվյալների վերլուծություն", "Մեքենայական ուսուցում", "Խորը ուսուցում"]
            },
            {
              id: "java",
              title: "Java",
              subtitle: "ԴԱՍԸՆԹԱՑ",
              description: "Java ծրագրավորման լեզու և կիրառական համակարգերի մշակում",
              duration: "6 ամիս",
              price: "68,000 ֏",
              icon_name: "Coffee",
              modules: ["Java հիմունքներ", "ՕԿԾ Java-ում", "Spring Framework", "Ձեռնարկության հավելվածներ"]
            },
            {
              id: "javascript",
              title: "JavaScript",
              subtitle: "ԴԱՍԸՆԹԱՑ",
              description: "JavaScript ծրագրավորման լեզու և ժամանակակից web հավելվածների մշակում",
              duration: "3.5 ամիս",
              price: "58,000 ֏", 
              icon_name: "FileCode",
              modules: ["JavaScript հիմունքներ", "DOM մանիպուլյացիա", "ES6+ հատկություններ", "Ասինխրոն JavaScript"]
            }
          ];
          
          const featuredCourse = featuredCourses.find(course => 
            course.id === id || 
            course.title.toLowerCase().includes(id || '')
          );
          
          if (featuredCourse) {
            setCourse({
              ...featuredCourse,
              createdBy: 'system',
              modules: featuredCourse.modules || [],
            });
          }
        }
      } catch (e) {
        console.error('Error fetching course:', e);
        toast({
          title: "Սխալ",
          description: "Չհաջողվեց բեռնել դասընթացի տվյալները",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id, user]);

  const checkEnrollmentStatus = async (courseId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('status')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setEnrollmentStatus(data.status === 'approved' ? 'enrolled' : 'pending');
      } else {
        setEnrollmentStatus('not_enrolled');
      }
    } catch (e) {
      console.error('Error checking enrollment status:', e);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: "Մուտք չի գործել",
        description: "Գրանցվելու համար, խնդրում ենք մուտք գործել",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!course) return;
    
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          status: 'pending'
        });
      
      if (error) throw error;
      
      setEnrollmentStatus('pending');
      toast({
        title: "Հաջողությամբ գրանցվել եք",
        description: "Ձեր գրանցումը ընթացքի մեջ է",
      });
    } catch (e) {
      console.error('Error enrolling in course:', e);
      toast({
        title: "Սխալ",
        description: "Չհաջողվեց գրանցվել դասընթացին",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-28 bg-gray-200 rounded"></div>
              <div className="h-28 bg-gray-200 rounded"></div>
              <div className="h-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h2>
          <p className="mb-6">Ներողություն, նշված դասընթացը հնարավոր չէ գտնել։</p>
          <Button onClick={() => navigate('/admin/courses')}>Վերադառնալ դասընթացներին</Button>
        </div>
        <Footer />
      </>
    );
  }

  const renderEnrollmentButton = () => {
    switch (enrollmentStatus) {
      case 'enrolled':
        return (
          <Button className="w-full mb-3 bg-green-600 hover:bg-green-700" disabled>
            <Check className="mr-2 h-4 w-4" />
            Գրանցված եք
          </Button>
        );
      case 'pending':
        return (
          <Button className="w-full mb-3 bg-amber-500 hover:bg-amber-600" disabled>
            Սպասվում է հաստատման
          </Button>
        );
      default:
        return (
          <Button className="w-full mb-3" onClick={handleEnroll}>
            Գրանցվել դասընթացին
          </Button>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 pl-0 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Վերադառնալ
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.subtitle}</p>

            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {course.specialization && (
                    <Badge variant="outline">{course.specialization}</Badge>
                  )}
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    <span>40 ուսանող</span>
                  </div>
                  {course.institution && (
                    <div className="flex items-center text-muted-foreground">
                      <Award className="mr-1 h-4 w-4" />
                      <span>{course.institution}</span>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-medium mb-3">Դասընթացի նկարագրություն</h3>
                  <p className="whitespace-pre-line">{course.description}</p>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="overview" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Ընդհանուր</TabsTrigger>
                <TabsTrigger value="modules">Մոդուլներ</TabsTrigger>
                <TabsTrigger value="syllabus">Ուսումնական պլան</TabsTrigger>
                <TabsTrigger value="materials">Նյութեր</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Դասընթացի մասին</CardTitle>
                    <CardDescription>
                      Ինչ կսովորեք այս դասընթացում
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-3">Ինչ կսովորեք</h4>
                        <ul className="space-y-2">
                          {(course.modules || []).slice(0, 4).map((module, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                              <span>{module}</span>
                            </li>
                          ))}
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>Իրական նախագծեր և պորտֆոլիո</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Նախապայմաններ</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>Համակարգչային բազային գիտելիքներ</span>
                          </li>
                          <li className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                            <span>Տրամաբանական մտածելակերպ</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="modules">
                <Card>
                  <CardHeader>
                    <CardTitle>Դասընթացի մոդուլներ</CardTitle>
                    <CardDescription>
                      Դասընթացը բաղկացած է հետևյալ մոդուլներից՝
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {course.modules && course.modules.length > 0 ? (
                      <div className="space-y-4">
                        {course.modules.map((module, index) => (
                          <div key={index} className="border p-4 rounded-lg bg-muted/30">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3">
                                  {index + 1}
                                </div>
                                <h4 className="font-medium">{module}</h4>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                {index < 2 ? 'Հասանելի' : index < 4 ? 'Շուտով' : 'Սպասվում է'}
                              </Badge>
                            </div>
                            <Progress value={index < 2 ? 100 : index < 4 ? 0 : 0} className="h-1 mt-2" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Մոդուլների ցանկը դեռ հասանելի չէ</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="syllabus">
                <Card>
                  <CardHeader>
                    <CardTitle>Ուսումնական պլան</CardTitle>
                    <CardDescription>
                      Դասընթացի մանրամասն ուսումնական պլանը
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="font-medium text-lg mb-2">Շաբաթ 1-2: Հիմունքներ</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Ներածություն դասընթացին</li>
                          <li>Ծրագրավորման հիմնական գործիքներ</li>
                          <li>Առաջին ծրագրի ստեղծում</li>
                          <li>Հիմնական հասկացություններ</li>
                        </ul>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="font-medium text-lg mb-2">Շաբաթ 3-4: Հիմնական կոնցեպտներ</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Տվյալների տիպեր և փոփոխականներ</li>
                          <li>Օպերատորներ և արտահայտություններ</li>
                          <li>Պայմանական կառուցվածքներ</li>
                          <li>Ցիկլեր և կրկնվող գործողություններ</li>
                        </ul>
                      </div>
                      
                      <div className="border-l-4 border-primary pl-4 py-2">
                        <h4 className="font-medium text-lg mb-2">Շաբաթ 5-6: Ֆունկցիաներ և ՕԿԾ</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Ֆունկցիաների սահմանում և կանչ</li>
                          <li>Պարամետրեր և վերադարձվող արժեքներ</li>
                          <li>Օբյեկտային կողմնորոշված ծրագրավորում</li>
                          <li>Դասեր և օբյեկտներ</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials">
                <Card>
                  <CardHeader>
                    <CardTitle>Ուսումնական նյութեր</CardTitle>
                    <CardDescription>
                      Դասընթացի ուսումնական նյութերը և ռեսուրսները
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Դասընթացի տեսական նյութեր</h4>
                            <p className="text-sm text-muted-foreground">PDF, 2.5MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Ներբեռնել
                        </Button>
                      </div>
                      
                      <div className="border p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Գործնական առաջադրանքներ</h4>
                            <p className="text-sm text-muted-foreground">PDF, 1.8MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Ներբեռնել
                        </Button>
                      </div>
                      
                      <div className="border p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-primary" />
                          <div>
                            <h4 className="font-medium">Օգտակար հղումներ և ռեսուրսներ</h4>
                            <p className="text-sm text-muted-foreground">PDF, 0.5MB</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Ներբեռնել
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="mb-6 sticky top-4">
              <CardHeader>
                <CardTitle>Գրանցվել դասընթացին</CardTitle>
                <CardDescription>
                  Դասընթացն սկսելու համար գրանցվեք և վճարեք
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{course.price}</div>
                
                {renderEnrollmentButton()}
                
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Ավելացնել հավաքածուում
                </Button>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FileText className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Դասընթացը ներառում է</h4>
                      <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                        <li>24 տեսադաս</li>
                        <li>12 գործնական առաջադրանք</li>
                        <li>6 թեստ</li>
                        <li>Ավարտական հավաստագիր</li>
                        <li>Անսահմանափակ հասանելիություն</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 pt-0">
                <h4 className="font-medium">Կիսվել</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Facebook</Button>
                  <Button variant="outline" size="sm">LinkedIn</Button>
                  <Button variant="outline" size="sm">Twitter</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursePage;
