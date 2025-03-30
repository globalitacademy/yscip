import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { convertIconNameToComponent } from '@/utils/iconUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Edit, Trash, Eye, Clock, Globe, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconSelector } from '@/components/courses/form-components/IconSelector';
import { LessonsList } from '@/components/courses/form-components/LessonsList';
import { RequirementsList } from '@/components/courses/form-components/RequirementsList';
import { OutcomesList } from '@/components/courses/form-components/OutcomesList';
import { updateCourseDirectly } from '@/components/courses/utils/courseSubmission';

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Partial<ProfessionalCourse>>({});
  const [newLesson, setNewLesson] = useState({ title: '', duration: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [isIconsOpen, setIsIconsOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching course:', error);
          toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
          return;
        }
        
        if (!data) {
          toast.error('Դասընթացը չի գտնվել');
          navigate('/courses');
          return;
        }
        
        const { data: lessonsData } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', id);
          
        const { data: requirementsData } = await supabase
          .from('course_requirements')
          .select('*')
          .eq('course_id', id);
          
        const { data: outcomesData } = await supabase
          .from('course_outcomes')
          .select('*')
          .eq('course_id', id);
        
        const iconElement = convertIconNameToComponent(data.icon_name);
        
        const professionalCourse: ProfessionalCourse = {
          id: data.id,
          title: data.title,
          subtitle: data.subtitle,
          icon: iconElement,
          iconName: data.icon_name,
          duration: data.duration,
          price: data.price,
          buttonText: data.button_text,
          color: data.color,
          createdBy: data.created_by,
          institution: data.institution,
          imageUrl: data.image_url,
          organizationLogo: data.organization_logo,
          description: data.description,
          is_public: data.is_public,
          lessons: lessonsData?.map(lesson => ({
            title: lesson.title,
            duration: lesson.duration
          })) || [],
          requirements: requirementsData?.map(req => req.requirement) || [],
          outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
          slug: data.slug
        };
        
        setCourse(professionalCourse);
        setEditedCourse(professionalCourse);
      } catch (e) {
        console.error('Error fetching course details:', e);
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
    
    if (id) {
      const channel = supabase
        .channel('course-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'courses',
            filter: `id=eq.${id}`
          },
          () => {
            fetchCourse();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id, navigate]);

  const handleSaveChanges = async () => {
    if (!course || !editedCourse) return;
    
    setLoading(true);
    try {
      const success = await updateCourseDirectly(course.id, editedCourse);
      
      if (success) {
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
        setIsEditDialogOpen(false);
        
        setCourse({
          ...course,
          ...editedCourse,
          icon: convertIconNameToComponent(editedCourse.iconName || course.iconName || 'book')
        });
      } else {
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
      }
    } catch (e) {
      console.error('Error updating course:', e);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) return;
    
    setLoading(true);
    try {
      await Promise.all([
        supabase.from('course_lessons').delete().eq('course_id', course.id),
        supabase.from('course_requirements').delete().eq('course_id', course.id),
        supabase.from('course_outcomes').delete().eq('course_id', course.id)
      ]);
      
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', course.id);
        
      if (error) {
        console.error('Error deleting course:', error);
        toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      toast.success('Դասընթացը հաջողությամբ ջնջվել է');
      navigate('/courses');
    } catch (e) {
      console.error('Error deleting course:', e);
      toast.error('Դասընթացի ջնջման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!course) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: !course.is_public })
        .eq('id', course.id);
        
      if (error) {
        console.error('Error toggling publish status:', error);
        toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
      
      setCourse({
        ...course,
        is_public: !course.is_public
      });
      
      toast.success(course.is_public ? 
        'Դասընթացը հանվել է հրապարակումից' : 
        'Դասընթացը հաջողությամբ հրապարակվել է'
      );
    } catch (e) {
      console.error('Error toggling publish status:', e);
      toast.error('Դասընթացի կարգավիճակի փոփոխման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = (newLesson) => {
    const lessons = [...(editedCourse.lessons || []), newLesson];
    setEditedCourse({ ...editedCourse, lessons });
  };

  const handleRemoveLesson = (index) => {
    const lessons = [...(editedCourse.lessons || [])];
    lessons.splice(index, 1);
    setEditedCourse({ ...editedCourse, lessons });
  };

  const handleAddRequirement = (requirement) => {
    const requirements = [...(editedCourse.requirements || []), requirement];
    setEditedCourse({ ...editedCourse, requirements });
  };

  const handleRemoveRequirement = (index) => {
    const requirements = [...(editedCourse.requirements || [])];
    requirements.splice(index, 1);
    setEditedCourse({ ...editedCourse, requirements });
  };

  const handleAddOutcome = (outcome) => {
    const outcomes = [...(editedCourse.outcomes || []), outcome];
    setEditedCourse({ ...editedCourse, outcomes });
  };

  const handleRemoveOutcome = (index) => {
    const outcomes = [...(editedCourse.outcomes || [])];
    outcomes.splice(index, 1);
    setEditedCourse({ ...editedCourse, outcomes });
  };

  const handleIconSelect = (iconName) => {
    setEditedCourse({...editedCourse, iconName});
    setIsIconsOpen(false);
  };

  const canEdit = user && (user.role === 'admin' || course?.createdBy === user.name);

  if (loading && !course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p>Դասընթացի բեռնում...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Դասընթացը չի գտնվել</h1>
            <p className="mb-6 text-muted-foreground">Հնարավոր է այն ջնջվել է կամ հասանելի չէ</p>
            <Button onClick={() => navigate('/courses')}>Վերադառնալ դասընթացների էջ</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{course.subtitle}</p>
          </div>
          
          {canEdit && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" /> Խմբագրել
              </Button>
              
              <Button 
                variant={course.is_public ? "secondary" : "default"}
                size="sm"
                onClick={handlePublishToggle}
                disabled={loading}
              >
                {course.is_public ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" /> Հրապարակված է
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-2" /> Հրապարակել
                  </>
                )}
              </Button>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" /> Ջնջել
              </Button>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          {course.is_public ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Globe className="h-3 w-3 mr-1" /> Հրապարակված
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Clock className="h-3 w-3 mr-1" /> Սպասում է հրապարակման
            </Badge>
          )}
        </div>
        
        <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                {course.imageUrl ? (
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className={`w-40 h-40 rounded-full flex items-center justify-center ${course.color} bg-white border-4 border-white shadow-lg`}>
                    {course.icon}
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                <p className="text-lg mb-4">{course.subtitle}</p>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                    <span className="font-semibold">Տևողություն:</span> {course.duration}
                  </div>
                  <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                    <span className="font-semibold">Հեղինակ:</span> {course.createdBy}
                  </div>
                  {course.institution && (
                    <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                      <span className="font-semibold">Հաստատություն:</span> {course.institution}
                    </div>
                  )}
                  {course.price && (
                    <div className="bg-white/80 px-4 py-2 rounded-full shadow-sm">
                      <span className="font-semibold">Գին:</span> {course.price}
                    </div>
                  )}
                </div>
                
                <Button size="lg">
                  Գրանցվել դասընթացին
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="description">
              <TabsList className="mb-4">
                <TabsTrigger value="description">Նկարագրություն</TabsTrigger>
                <TabsTrigger value="curriculum">Դասընթացի պլան</TabsTrigger>
                <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
                <TabsTrigger value="outcomes">Արդյունքներ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    {course.description ? (
                      <div className="prose max-w-none">
                        {course.description.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Դասընթացի մանրամասն նկարագրությունը բացակայում է։</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="curriculum" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    {course.lessons && course.lessons.length > 0 ? (
                      <div className="space-y-4">
                        {course.lessons.map((lesson, index) => (
                          <div key={index} className="flex justify-between items-center border-b pb-2">
                            <div>
                              <h3 className="font-medium">{lesson.title}</h3>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {lesson.duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Դասընթացի պլանը դեռ հասանելի չէ։</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="requirements" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    {course.requirements && course.requirements.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {course.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Դասընթացին մասնակցելու համար նախնական պահանջներ չկան։</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="outcomes" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    {course.outcomes && course.outcomes.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {course.outcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Դասընթացի ուսումնառության արդյունքները դեռ նշված չեն։</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Ինչու՞ ընտրել այս դասընթացը</h3>
                </div>
                
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Փորձառու դասավանդողներ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Գործնական հմտություններ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Խմբային աշխատանք</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="shrink-0 mt-1 bg-green-100 rounded-full p-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    </div>
                    <span>Ավարտական հավաստագիր</span>
                  </li>
                </ul>
                
                <Button className="w-full" size="lg">
                  Գրանցվել դասընթացին
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Խմբագրել դասընթացը</DialogTitle>
            <DialogDescription>
              Թարմացրեք դասընթացի տվյալները: Պահպանելուց հետո փոփոխությունները կհայտնվեն հանրային էջում:
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Հիմնական տվյալներ</TabsTrigger>
              <TabsTrigger value="lessons">Դասերի ցանկ</TabsTrigger>
              <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
              <TabsTrigger value="outcomes">Արդյունքներ</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Վերնագիր</Label>
                  <Input 
                    id="title" 
                    value={editedCourse.title || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Ենթավերնագիր</Label>
                  <Input 
                    id="subtitle" 
                    value={editedCourse.subtitle || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, subtitle: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Տևողություն</Label>
                  <Input 
                    id="duration" 
                    value={editedCourse.duration || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, duration: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Գին</Label>
                  <Input 
                    id="price" 
                    value={editedCourse.price || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, price: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Նկարի URL</Label>
                  <Input 
                    id="imageUrl" 
                    value={editedCourse.imageUrl || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">Հաստատություն</Label>
                  <Input 
                    id="institution" 
                    value={editedCourse.institution || ''} 
                    onChange={(e) => setEditedCourse({...editedCourse, institution: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Պատկերակ</Label>
                <IconSelector 
                  isIconsOpen={isIconsOpen}
                  setIsIconsOpen={setIsIconsOpen}
                  onIconSelect={handleIconSelect}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Նկարագրություն</Label>
                <Textarea 
                  id="description" 
                  value={editedCourse.description || ''} 
                  onChange={(e) => setEditedCourse({...editedCourse, description: e.target.value})}
                  rows={5}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="lessons">
              <LessonsList 
                lessons={editedCourse.lessons || []}
                onAddLesson={handleAddLesson}
                onRemoveLesson={handleRemoveLesson}
              />
            </TabsContent>
            
            <TabsContent value="requirements">
              <RequirementsList 
                requirements={editedCourse.requirements || []}
                onAddRequirement={handleAddRequirement}
                onRemoveRequirement={handleRemoveRequirement}
              />
            </TabsContent>
            
            <TabsContent value="outcomes">
              <OutcomesList 
                outcomes={editedCourse.outcomes || []}
                onAddOutcome={handleAddOutcome}
                onRemoveOutcome={handleRemoveOutcome}
              />
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Չեղարկել</Button>
            <Button onClick={handleSaveChanges} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Պահպանել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ջնջել դասընթացը</DialogTitle>
            <DialogDescription>
              Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս դասընթացը։ Այս գործողությունը հնարավոր չէ հետ շրջել։
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
            <h3 className="text-amber-800 font-medium mb-1 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Զգուշացում
            </h3>
            <p className="text-amber-700 text-sm">
              Ջնջելով այս դասընթացը, դուք կջնջեք նաև բոլոր կապակցված տվյալները՝ դասերը, պահանջները և արդյունքները։
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Չեղարկել</Button>
            <Button variant="destructive" onClick={handleDeleteCourse} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ջնջել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetails;
