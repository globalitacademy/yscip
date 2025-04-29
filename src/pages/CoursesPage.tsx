
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  GraduationCap,
  Filter,
  Plus,
  Calendar,
  Users,
  BookOpen,
  Clock
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CoursesPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  // Mock courses data
  const courses = [
    {
      id: 1,
      title: 'Վեբ ծրագրավորում',
      description: 'Ժամանակակից վեբ տեխնոլոգիաների ուսումնասիրություն՝ HTML, CSS, JavaScript, React, Node.js',
      instructor: 'Արմեն Հակոբյան',
      instructorAvatar: '',
      program: 'Տեղեկատվական տեխնոլոգիաներ',
      type: 'մասնագիտական',
      status: 'active',
      startDate: '2024-09-01',
      duration: '16 շաբաթ',
      students: 24
    },
    {
      id: 2,
      title: 'Տվյալների կառուցվածքներ և ալգորիթմներ',
      description: 'Տվյալների կառուցվածքների և ալգորիթմների հիմունքները՝ զանգվածներ, ցուցակներ, ծառեր, գրաֆներ, որոնում և դասակարգում',
      instructor: 'Սոնա Մարտիրոսյան',
      instructorAvatar: '',
      program: 'Տեղեկատվական տեխնոլոգիաներ',
      type: 'հիմնական',
      status: 'active',
      startDate: '2024-09-01',
      duration: '16 շաբաթ',
      students: 32
    },
    {
      id: 3,
      title: 'Արհեստական բանականության հիմունքներ',
      description: 'Ներածություն արհեստական բանականության հիմնական հասկացություններին և ալգորիթմներին',
      instructor: 'Գագիկ Պետրոսյան',
      instructorAvatar: '',
      program: 'Արհեստական բանականություն',
      type: 'մասնագիտական',
      status: 'upcoming',
      startDate: '2024-09-15',
      duration: '12 շաբաթ',
      students: 18
    },
    {
      id: 4,
      title: 'Կիբերանվտանգության հիմունքներ',
      description: 'Կիբերանվտանգության հիմնական հասկացություններ, սպառնալիքներ և պաշտպանության մեխանիզմներ',
      instructor: 'Կարեն Գրիգորյան',
      instructorAvatar: '',
      program: 'Կիբերանվտանգություն',
      type: 'հիմնական',
      status: 'completed',
      startDate: '2024-02-01',
      duration: '14 շաբաթ',
      students: 22
    }
  ];

  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';

    switch (status) {
      case 'active':
        return <Badge variant="outline" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200"}>Ընթացիկ</Badge>;
      case 'upcoming':
        return <Badge variant="outline" className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200"}>Սպասվող</Badge>;
      case 'completed':
        return <Badge variant="outline" className={isDark ? "bg-gray-900/60 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-700 border-gray-200"}>Ավարտված</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const getCourseBadge = (type: string) => {
    const isDark = theme === 'dark';

    switch (type) {
      case 'հիմնական':
        return <Badge variant="secondary" className={isDark ? "bg-purple-900/60 text-purple-300 border-purple-700" : ""}>{type}</Badge>;
      case 'մասնագիտական':
        return <Badge variant="secondary" className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : ""}>{type}</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const filteredCourses = courses.filter(course => {
    if (activeTab !== 'all') {
      if (activeTab === 'active' && course.status !== 'active') return false;
      if (activeTab === 'upcoming' && course.status !== 'upcoming') return false;
      if (activeTab === 'completed' && course.status !== 'completed') return false;
    }

    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.program.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tabsListClass = theme === 'dark' ? 'bg-gray-700' : '';
  const tabsTriggerClass = theme === 'dark' ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100' : '';

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('');
  };

  return (
    <AdminLayout pageTitle="Կուրսեր">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Կուրսեր</CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              Ուսումնական ծրագրերի կուրսերի ցանկ
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Նոր կուրս
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Փնտրել կուրսեր..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button variant="outline" size="icon" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`mb-4 ${tabsListClass}`}>
                <TabsTrigger value="all" className={tabsTriggerClass}>Բոլորը</TabsTrigger>
                <TabsTrigger value="active" className={tabsTriggerClass}>Ընթացիկ</TabsTrigger>
                <TabsTrigger value="upcoming" className={tabsTriggerClass}>Սպասվող</TabsTrigger>
                <TabsTrigger value="completed" className={tabsTriggerClass}>Ավարտված</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredCourses.map(course => (
                      <Card key={course.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50 hover:bg-gray-900 border-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                        <CardHeader className="pb-2 flex flex-row items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{course.title}</CardTitle>
                              {getCourseBadge(course.type)}
                            </div>
                            <CardDescription className={`line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                              {course.description}
                            </CardDescription>
                          </div>
                          {getStatusBadge(course.status)}
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                              <AvatarFallback className={theme === 'dark' ? 'bg-gray-700 text-gray-200' : ''}>
                                {getInitials(course.instructor)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                              <p>{course.instructor}</p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{course.program}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(course.startDate).toLocaleDateString('hy-AM')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{course.students} ուսանող</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>8 դաս</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className={theme === 'dark' ? 'border-t border-gray-700' : 'border-t'}>
                          <div className="flex justify-end w-full pt-2">
                            <Button variant="outline" size="sm" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                              Մանրամասներ
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center py-12 text-center rounded-md border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                    <GraduationCap className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Կուրսեր չեն գտնվել</h3>
                    <p className="text-sm mt-1 max-w-sm">
                      Ոչ մի կուրս չի համապատասխանում ձեր որոնման պարամետրերին։
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CoursesPage;
