
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Bookmark, Award, FileText } from 'lucide-react';
import { Course } from '@/components/courses/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
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
        }
      } catch (e) {
        console.error('Error fetching course:', e);
        toast.error('Չհաջողվեց բեռնել դասընթացի տվյալները');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);

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
          <Button onClick={() => navigate('/courses')}>Վերադառնալ դասընթացներին</Button>
        </div>
        <Footer />
      </>
    );
  }

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

            <Tabs defaultValue="modules" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="modules">Մոդուլներ</TabsTrigger>
                <TabsTrigger value="program">Ծրագիր</TabsTrigger>
                <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
              </TabsList>

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
                                {index < 2 ? 'Ավարտված' : index < 4 ? 'Ընթացքի մեջ' : 'Չսկսված'}
                              </Badge>
                            </div>
                            <Progress value={index < 2 ? 100 : index < 4 ? 50 : 0} className="h-1 mt-2" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Մոդուլների ցանկը դեռ հասանելի չէ</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="program">
                <Card>
                  <CardHeader>
                    <CardTitle>Ուսումնական ծրագիր</CardTitle>
                    <CardDescription>
                      Դասընթացի մանրամասն ուսումնական պլանը
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border p-4 rounded-lg">
                        <h4 className="font-medium mb-2">1. Ներածություն</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Ծանոթություն դասընթացի հետ</li>
                          <li>Հիմնական գործիքների տեղադրում և կարգավորում</li>
                          <li>Առաջին ծրագրի ստեղծում</li>
                        </ul>
                      </div>
                      
                      <div className="border p-4 rounded-lg">
                        <h4 className="font-medium mb-2">2. Հիմնական հասկացություններ</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Տվյալների տիպեր և փոփոխականներ</li>
                          <li>Օպերատորներ և արտահայտություններ</li>
                          <li>Պայմանական կառուցվածքներ</li>
                          <li>Ցիկլեր և կրկնվող գործողություններ</li>
                        </ul>
                      </div>
                      
                      <div className="border p-4 rounded-lg">
                        <h4 className="font-medium mb-2">3. Ֆունկցիաներ և մեթոդներ</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Ֆունկցիաների սահմանում և կանչ</li>
                          <li>Պարամետրեր և վերադարձվող արժեքներ</li>
                          <li>Ռեկուրսիա</li>
                          <li>Լամբդա ֆունկցիաներ</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements">
                <Card>
                  <CardHeader>
                    <CardTitle>Դասընթացի պահանջներ</CardTitle>
                    <CardDescription>
                      Ինչ է անհրաժեշտ դասընթացը սկսելու համար
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Տեխնիկական պահանջներ</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Համակարգիչ (Windows, macOS կամ Linux)</li>
                          <li>Ինտերնետ կապ</li>
                          <li>Նվազագույնը 8GB RAM</li>
                          <li>50GB ազատ տարածք</li>
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">Նախնական գիտելիքներ</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                          <li>Համակարգչային հիմնական հմտություններ</li>
                          <li>Տրամաբանական մտածելակերպ</li>
                          <li>Մաթեմատիկական հիմնական գիտելիքներ</li>
                        </ul>
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
                
                <Button className="w-full mb-3">Գրանցվել դասընթացին</Button>
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
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetailPage;
