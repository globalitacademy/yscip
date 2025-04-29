
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Users, CalendarDays, Clock, BookOpen, FileText, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  program: string;
  semester: string;
  status: 'active' | 'upcoming' | 'completed' | 'draft';
  students: number;
  progress: number;
  startDate: string;
  endDate: string;
  creditsCount: number;
  hoursCount: number;
  materialCount: number;
  image?: string;
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Ծրագրավորման հիմունքներ',
    description: 'Ծրագրավորման հիմունքների դասընթաց, որը նախատեսված է սկսնակների համար։',
    program: 'Ինֆորմատիկա և կիրառական մաթեմատիկա',
    semester: '1-ին կիսամյակ',
    status: 'active',
    students: 32,
    progress: 65,
    startDate: '2025-03-01',
    endDate: '2025-06-20',
    creditsCount: 5,
    hoursCount: 48,
    materialCount: 24,
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400'
  },
  {
    id: '2',
    title: 'Տվյալների կառուցվածքներ',
    description: 'Դասընթաց, որը ներկայացնում է հիմնական տվյալների կառուցվածքները և ալգորիթմները։',
    program: 'Ինֆորմատիկա և կիրառական մաթեմատիկա',
    semester: '2-րդ կիսամյակ',
    status: 'upcoming',
    students: 28,
    progress: 0,
    startDate: '2025-09-01',
    endDate: '2025-12-20',
    creditsCount: 4,
    hoursCount: 40,
    materialCount: 18
  },
  {
    id: '3',
    title: 'Օբյեկտ կողմնորոշված ծրագրավորում',
    description: 'Դասընթաց, որը ներկայացնում է OOP հիմունքները և նախշերը։',
    program: 'Ծրագրային ճարտարագիտություն',
    semester: '3-րդ կիսամյակ',
    status: 'active',
    students: 25,
    progress: 42,
    startDate: '2025-03-01',
    endDate: '2025-06-20',
    creditsCount: 5,
    hoursCount: 48,
    materialCount: 22,
    image: 'https://images.unsplash.com/photo-1623276527153-fa38c1616b06?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400'
  },
  {
    id: '4',
    title: 'Տվյալների բազաների կառավարում',
    description: 'Հիմնական սկզբունքները, կառուցվածքները և SQL հարցումները։',
    program: 'Տեղեկատվական համակարգեր',
    semester: '4-րդ կիսամյակ',
    status: 'completed',
    students: 30,
    progress: 100,
    startDate: '2024-09-01',
    endDate: '2024-12-20',
    creditsCount: 4,
    hoursCount: 40,
    materialCount: 20
  },
  {
    id: '5',
    title: 'Վեբ ծրագրավորման հիմունքներ',
    description: 'HTML, CSS և JavaScript տեխնոլոգիաների հիմունքներ։',
    program: 'Ծրագրային ճարտարագիտություն',
    semester: '3-րդ կիսամյակ',
    status: 'draft',
    students: 0,
    progress: 0,
    startDate: '2026-03-01',
    endDate: '2026-06-20',
    creditsCount: 4,
    hoursCount: 40,
    materialCount: 5
  },
];

const LecturerCoursesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourseDetails, setNewCourseDetails] = useState({
    title: '',
    description: '',
    program: '',
    semester: '',
    creditsCount: 4,
    hoursCount: 40,
  });

  // Filter courses based on search term and status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ակտիվ</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Առաջիկա</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Ավարտված</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">Սևագիր</Badge>;
      default:
        return null;
    }
  };

  const handleCreateCourse = () => {
    if (!newCourseDetails.title || !newCourseDetails.description || !newCourseDetails.program || !newCourseDetails.semester) {
      toast.error("Լրացրեք բոլոր պարտադիր դաշտերը");
      return;
    }

    const today = new Date();
    const futureDate = new Date();
    futureDate.setMonth(today.getMonth() + 4); // 4 months from now

    const newCourse: Course = {
      id: (courses.length + 1).toString(),
      title: newCourseDetails.title,
      description: newCourseDetails.description,
      program: newCourseDetails.program,
      semester: newCourseDetails.semester,
      status: 'draft',
      students: 0,
      progress: 0,
      startDate: today.toISOString().split('T')[0],
      endDate: futureDate.toISOString().split('T')[0],
      creditsCount: newCourseDetails.creditsCount,
      hoursCount: newCourseDetails.hoursCount,
      materialCount: 0
    };

    setCourses([...courses, newCourse]);
    setIsDialogOpen(false);
    setNewCourseDetails({
      title: '',
      description: '',
      program: '',
      semester: '',
      creditsCount: 4,
      hoursCount: 40,
    });

    toast.success("Դասընթացը ստեղծված է", {
      description: "Դասընթացը հաջողությամբ ստեղծվել է սևագրի կարգավիճակով",
    });
  };

  const handlePublishCourse = (course: Course) => {
    const updatedCourses = courses.map(c => {
      if (c.id === course.id) {
        return {
          ...c,
          status: 'upcoming' as const
        };
      }
      return c;
    });
    
    setCourses(updatedCourses);
    toast.success("Դասընթացը հրապարակված է", {
      description: `"${course.title}" դասընթացը հաջողությամբ հրապարակվել է։`,
    });
  };

  const handleViewCourseDetails = (course: Course) => {
    // This would normally navigate to a detailed view
    toast.info("Դասընթացի մանրամասներ", {
      description: `"${course.title}" դասընթացի մանրամասն տեսքը բացված է։`,
    });
  };

  const activeCourses = filteredCourses.filter(c => c.status === 'active');
  const upcomingCourses = filteredCourses.filter(c => c.status === 'upcoming');
  const completedCourses = filteredCourses.filter(c => c.status === 'completed');
  const draftCourses = filteredCourses.filter(c => c.status === 'draft');

  return (
    <AdminLayout pageTitle="Դասընթացներ">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Փնտրել դասընթացներ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Բոլոր կարգավիճակները" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Բոլորը</SelectItem>
              <SelectItem value="active">Ակտիվ</SelectItem>
              <SelectItem value="upcoming">Առաջիկա</SelectItem>
              <SelectItem value="completed">Ավարտված</SelectItem>
              <SelectItem value="draft">Սևագիր</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-2">
                <Plus className="mr-2 h-4 w-4" />
                Նոր դասընթաց
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Ստեղծել նոր դասընթաց</DialogTitle>
                <DialogDescription>
                  Լրացրեք ձևը նոր դասընթաց ստեղծելու համար։ Այն կստեղծվի սևագրի կարգավիճակով։
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right font-medium">
                    Անվանում
                  </label>
                  <Input
                    id="title"
                    value={newCourseDetails.title}
                    onChange={(e) => setNewCourseDetails({...newCourseDetails, title: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="program" className="text-right font-medium">
                    Ծրագիր
                  </label>
                  <Select 
                    value={newCourseDetails.program}
                    onValueChange={(value) => setNewCourseDetails({...newCourseDetails, program: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք ծրագիրը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ինֆորմատիկա և կիրառական մաթեմատիկա">Ինֆորմատիկա և կիրառական մաթեմատիկա</SelectItem>
                      <SelectItem value="Տեղեկատվական համակարգեր">Տեղեկատվական համակարգեր</SelectItem>
                      <SelectItem value="Ծրագրային ճարտարագիտություն">Ծրագրային ճարտարագիտություն</SelectItem>
                      <SelectItem value="Տվյալների գիտություն">Տվյալների գիտություն</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="semester" className="text-right font-medium">
                    Կիսամյակ
                  </label>
                  <Select 
                    value={newCourseDetails.semester}
                    onValueChange={(value) => setNewCourseDetails({...newCourseDetails, semester: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք կիսամյակը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-ին կիսամյակ">1-ին կիսամյակ</SelectItem>
                      <SelectItem value="2-րդ կիսամյակ">2-րդ կիսամյակ</SelectItem>
                      <SelectItem value="3-րդ կիսամյակ">3-րդ կիսամյակ</SelectItem>
                      <SelectItem value="4-րդ կիսամյակ">4-րդ կիսամյակ</SelectItem>
                      <SelectItem value="5-րդ կիսամյակ">5-րդ կիսամյակ</SelectItem>
                      <SelectItem value="6-րդ կիսամյակ">6-րդ կիսամյակ</SelectItem>
                      <SelectItem value="7-րդ կիսամյակ">7-րդ կիսամյակ</SelectItem>
                      <SelectItem value="8-րդ կիսամյակ">8-րդ կիսամյակ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="credits" className="text-right font-medium">
                    Կրեդիտներ
                  </label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="10"
                    value={newCourseDetails.creditsCount}
                    onChange={(e) => setNewCourseDetails({...newCourseDetails, creditsCount: parseInt(e.target.value) || 4})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="hours" className="text-right font-medium">
                    Ժամեր
                  </label>
                  <Input
                    id="hours"
                    type="number"
                    min="10"
                    max="120"
                    value={newCourseDetails.hoursCount}
                    onChange={(e) => setNewCourseDetails({...newCourseDetails, hoursCount: parseInt(e.target.value) || 40})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="description" className="text-right font-medium mt-2">
                    Նկարագրություն
                  </label>
                  <Textarea
                    id="description"
                    value={newCourseDetails.description}
                    onChange={(e) => setNewCourseDetails({...newCourseDetails, description: e.target.value})}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateCourse}>Ստեղծել դասընթաց</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Բոլորը ({filteredCourses.length})</TabsTrigger>
          <TabsTrigger value="active">Ակտիվ ({activeCourses.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Առաջիկա ({upcomingCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Ավարտված ({completedCourses.length})</TabsTrigger>
          <TabsTrigger value="draft">Սևագիր ({draftCourses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <CoursesGrid 
            courses={filteredCourses} 
            getStatusBadge={getStatusBadge} 
            onViewDetails={handleViewCourseDetails} 
            onPublish={handlePublishCourse} 
          />
        </TabsContent>
        
        <TabsContent value="active">
          <CoursesGrid 
            courses={activeCourses} 
            getStatusBadge={getStatusBadge} 
            onViewDetails={handleViewCourseDetails}
            onPublish={handlePublishCourse} 
          />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <CoursesGrid 
            courses={upcomingCourses} 
            getStatusBadge={getStatusBadge} 
            onViewDetails={handleViewCourseDetails}
            onPublish={handlePublishCourse} 
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <CoursesGrid 
            courses={completedCourses} 
            getStatusBadge={getStatusBadge} 
            onViewDetails={handleViewCourseDetails}
            onPublish={handlePublishCourse} 
          />
        </TabsContent>
        
        <TabsContent value="draft">
          <CoursesGrid 
            courses={draftCourses} 
            getStatusBadge={getStatusBadge} 
            onViewDetails={handleViewCourseDetails}
            onPublish={handlePublishCourse} 
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

interface CoursesGridProps {
  courses: Course[];
  getStatusBadge: (status: string) => React.ReactNode;
  onViewDetails: (course: Course) => void;
  onPublish: (course: Course) => void;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  getStatusBadge,
  onViewDetails,
  onPublish
}) => {
  if (courses.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-muted-foreground">Դասընթացներ չեն գտնվել</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <Card key={course.id} className="overflow-hidden flex flex-col h-full">
          <div 
            className="h-32 bg-cover bg-center" 
            style={{ 
              backgroundImage: course.image ? `url(${course.image})` : 
              'linear-gradient(45deg, #3b82f6, #8b5cf6)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} 
          />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              {getStatusBadge(course.status)}
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {course.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-3">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> 
                  <span>Ծրագիր:</span>
                </div>
                <span>{course.program}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" /> 
                  <span>Կիսամյակ:</span>
                </div>
                <span>{course.semester}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> 
                  <span>Ուսանողներ:</span>
                </div>
                <span>{course.students}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> 
                  <span>Ժամեր:</span>
                </div>
                <span>{course.hoursCount} ժամ</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" /> 
                  <span>Նյութեր:</span>
                </div>
                <span>{course.materialCount} նյութ</span>
              </div>
              {(course.status === 'active' || course.status === 'upcoming') && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Առաջընթաց</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {course.status === 'draft' ? (
              <Button 
                onClick={() => onPublish(course)}
                variant="default"
                className="w-full"
              >
                Հրապարակել
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onViewDetails(course)}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Դիտել մանրամասները
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LecturerCoursesPage;
