
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
  BookOpen,
  Filter,
  Plus,
  ArrowUpRight,
  Clock,
  BarChart3
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const EducationalModulesPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  // Mock educational modules data
  const modules = [
    {
      id: 1,
      title: 'JavaScript հիմունքներ',
      description: 'JavaScript ծրագրավորման լեզվի հիմնական կոնցեպտների ուսումնասիրություն։',
      category: 'programming',
      categoryName: 'Ծրագրավորում',
      level: 'beginner',
      levelName: 'Սկսնակ',
      duration: '4 շաբաթ',
      lessons: 12,
      popularity: 95,
      status: 'active'
    },
    {
      id: 2,
      title: 'Տվյալների հենքերի նախագծում',
      description: 'Տվյալների հենքերի նախագծման սկզբունքները և պրակտիկան՝ SQL և NoSQL հենքերի համար։',
      category: 'database',
      categoryName: 'Տվյալների հենքեր',
      level: 'intermediate',
      levelName: 'Միջին',
      duration: '6 շաբաթ',
      lessons: 18,
      popularity: 85,
      status: 'active'
    },
    {
      id: 3,
      title: 'Վեբ կայքերի անվտանգություն',
      description: 'Վեբ հավելվածների անվտանգության սպառնալիքները և պաշտպանական մեխանիզմները։',
      category: 'security',
      categoryName: 'Անվտանգություն',
      level: 'advanced',
      levelName: 'Առաջադեմ',
      duration: '8 շաբաթ',
      lessons: 24,
      popularity: 88,
      status: 'development'
    },
    {
      id: 4,
      title: 'React ֆրեյմվորկի հիմունքներ',
      description: 'React ֆրեյմվորկի հիմնական կոնցեպտները և կոմպոնենտային մոտեցումը։',
      category: 'programming',
      categoryName: 'Ծրագրավորում',
      level: 'intermediate',
      levelName: 'Միջին',
      duration: '5 շաբաթ',
      lessons: 15,
      popularity: 92,
      status: 'active'
    },
    {
      id: 5,
      title: 'UI/UX դիզայնի հիմունքներ',
      description: 'Օգտատիրական ինտերֆեյսի և փորձի դիզայնի հիմունքները, գործիքները և մեթոդները։',
      category: 'interface',
      categoryName: 'Ինտերֆեյս',
      level: 'beginner',
      levelName: 'Սկսնակ',
      duration: '4 շաբաթ',
      lessons: 10,
      popularity: 80,
      status: 'archived'
    }
  ];

  const categories = [
    { value: 'all', label: 'Բոլոր կատեգորիաները' },
    { value: 'programming', label: 'Ծրագրավորում' },
    { value: 'database', label: 'Տվյալների հենքեր' },
    { value: 'security', label: 'Անվտանգություն' },
    { value: 'interface', label: 'Ինտերֆեյս' },
    { value: 'networking', label: 'Ցանցեր' },
    { value: 'algorithms', label: 'Ալգորիթմներ' }
  ];

  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';

    switch (status) {
      case 'active':
        return <Badge variant="outline" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200"}>Ակտիվ</Badge>;
      case 'development':
        return <Badge variant="outline" className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200"}>Մշակման փուլում</Badge>;
      case 'archived':
        return <Badge variant="outline" className={isDark ? "bg-gray-900/60 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-700 border-gray-200"}>Արխիվացված</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    const isDark = theme === 'dark';

    switch (level) {
      case 'beginner':
        return <Badge variant="secondary" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-100 text-green-800"}>Սկսնակ</Badge>;
      case 'intermediate':
        return <Badge variant="secondary" className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : "bg-blue-100 text-blue-800"}>Միջին</Badge>;
      case 'advanced':
        return <Badge variant="secondary" className={isDark ? "bg-purple-900/60 text-purple-300 border-purple-700" : "bg-purple-100 text-purple-800"}>Առաջադեմ</Badge>;
      default:
        return <Badge variant="secondary">Անորոշ</Badge>;
    }
  };

  const filteredModules = modules.filter(module => {
    // Filter by tab (status)
    if (activeTab !== 'all' && module.status !== activeTab) {
      return false;
    }
    
    // Filter by category
    if (category !== 'all' && module.category !== category) {
      return false;
    }
    
    // Filter by search term
    return (
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tabsListClass = theme === 'dark' ? 'bg-gray-700' : '';
  const tabsTriggerClass = theme === 'dark' ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100' : '';
  const selectTriggerClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const selectContentClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';

  return (
    <AdminLayout pageTitle="Ուսումնական մոդուլներ">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ուսումնական մոդուլներ</CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              Ուսումնական մոդուլների կառավարում
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Նոր մոդուլ
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Փնտրել մոդուլներ..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className={`w-[220px] ${selectTriggerClass}`}>
                    <SelectValue placeholder="Ընտրել կատեգորիան" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`mb-4 ${tabsListClass}`}>
                <TabsTrigger value="all" className={tabsTriggerClass}>Բոլորը</TabsTrigger>
                <TabsTrigger value="active" className={tabsTriggerClass}>Ակտիվ</TabsTrigger>
                <TabsTrigger value="development" className={tabsTriggerClass}>Մշակման փուլում</TabsTrigger>
                <TabsTrigger value="archived" className={tabsTriggerClass}>Արխիվացված</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredModules.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredModules.map(module => (
                      <Card key={module.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50 hover:bg-gray-900 border-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                        <CardHeader className="pb-2 flex flex-row items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            <CardDescription className={`line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                              {module.description}
                            </CardDescription>
                          </div>
                          {getStatusBadge(module.status)}
                        </CardHeader>
                        <CardContent className="pb-4">
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className={theme === 'dark' ? 'bg-gray-900 border-gray-700' : ''}>
                              {module.categoryName}
                            </Badge>
                            {getLevelBadge(module.level)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{module.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <BookOpen className="h-4 w-4 text-muted-foreground" />
                              <span>{module.lessons} դաս</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm col-span-2">
                              <BarChart3 className="h-4 w-4 text-muted-foreground" />
                              <span>Հանրաճանաչություն՝ {module.popularity}%</span>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700 ml-2">
                                <div 
                                  className={`h-full rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`} 
                                  style={{ width: `${module.popularity}%` }}>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className={`flex justify-end ${theme === 'dark' ? 'border-t border-gray-700' : 'border-t'}`}>
                          <Button variant="ghost" size="sm" className={`flex items-center ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                            Մանրամասներ
                            <ArrowUpRight className="h-4 w-4 ml-1" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center py-12 text-center rounded-md border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                    <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Մոդուլներ չեն գտնվել</h3>
                    <p className="text-sm mt-1 max-w-sm">
                      Ոչ մի մոդուլ չի համապատասխանում ձեր որոնման պարամետրերին։
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

export default EducationalModulesPage;
