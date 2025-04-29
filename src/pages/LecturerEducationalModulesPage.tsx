
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, BookOpen, Calendar, Clock, FileText, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from "sonner";

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  credits: number;
  status: 'published' | 'draft' | 'archived';
  duration: string;
  lessons: number;
  assessments: number;
  course?: string;
}

const mockModules: Module[] = [
  {
    id: '1',
    title: 'Ծրագրավորման լեզուներ',
    description: 'Ուսումնական մոդուլ, որը ներկայացնում է ժամանակակից ծրագրավորման լեզուները և նրանց կիրառությունները',
    category: 'Ծրագրավորում',
    type: 'Տեսական',
    credits: 4,
    status: 'published',
    duration: '4 շաբաթ',
    lessons: 12,
    assessments: 3,
    course: 'Ծրագրավորման հիմունքներ'
  },
  {
    id: '2',
    title: 'Տվյալների բազաներ',
    description: 'Ռելյացիոն տվյալների բազաների հիմունքներ և SQL լեզու',
    category: 'Տվյալների կառավարում',
    type: 'Գործնական',
    credits: 3,
    status: 'published',
    duration: '3 շաբաթ',
    lessons: 9,
    assessments: 2,
    course: 'Տվյալների բազաների կառավարում'
  },
  {
    id: '3',
    title: 'Ալգորիթմների տեսություն',
    description: 'Հիմնական ալգորիթմական մեթոդներ և նրանց վերլուծություն',
    category: 'Ալգորիթմներ',
    type: 'Տեսական',
    credits: 5,
    status: 'published',
    duration: '5 շաբաթ',
    lessons: 15,
    assessments: 4,
    course: 'Տվյալների կառուցվածքներ'
  },
  {
    id: '4',
    title: 'Վեբ ծրագրավորում',
    description: 'HTML, CSS և JavaScript հիմունքներ, դինամիկ վեբ էջերի ստեղծում',
    category: 'Վեբ տեխնոլոգիաներ',
    type: 'Գործնական',
    credits: 4,
    status: 'draft',
    duration: '4 շաբաթ',
    lessons: 12,
    assessments: 3
  },
  {
    id: '5',
    title: 'Մոբայլ հավելվածների մշակում',
    description: 'Հիմունքային սկզբունքներ մոբայլ հավելվածների ստեղծման համար',
    category: 'Մոբայլ տեխնոլոգիաներ',
    type: 'Գործնական',
    credits: 4,
    status: 'draft',
    duration: '4 շաբաթ',
    lessons: 12,
    assessments: 3
  },
  {
    id: '6',
    title: 'Արհեստական բանականություն',
    description: 'Ներածություն արհեստական բանականության և մեքենայական ուսուցման մեջ',
    category: 'Արհեստական բանականություն',
    type: 'Տեսական',
    credits: 5,
    status: 'archived',
    duration: '5 շաբաթ',
    lessons: 15,
    assessments: 4
  }
];

const CATEGORIES = [
  'Ծրագրավորում',
  'Տվյալների կառավարում',
  'Ալգորիթմներ',
  'Վեբ տեխնոլոգիաներ',
  'Մոբայլ տեխնոլոգիաներ',
  'Արհեստական բանականություն',
  'Համակարգչային գրաֆիկա',
  'Ցանցային տեխնոլոգիաներ'
];

const MODULE_TYPES = ['Տեսական', 'Գործնական', 'Լաբորատոր', 'Խառը'];

const LecturerEducationalModulesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newModuleDetails, setNewModuleDetails] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    credits: 3,
    duration: '',
    lessons: 10,
    assessments: 2
  });

  // Filter modules based on search term, status, and category
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Հրապարակված</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Սևագիր</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">Արխիվացված</Badge>;
      default:
        return null;
    }
  };

  const getModuleColorClass = (category: string) => {
    switch (category) {
      case 'Ծրագրավորում':
        return 'bg-blue-100/60 border-blue-200 text-blue-800';
      case 'Տվյալների կառավարում':
        return 'bg-green-100/60 border-green-200 text-green-800';
      case 'Ալգորիթմներ':
        return 'bg-purple-100/60 border-purple-200 text-purple-800';
      case 'Վեբ տեխնոլոգիաներ':
        return 'bg-amber-100/60 border-amber-200 text-amber-800';
      case 'Մոբայլ տեխնոլոգիաներ':
        return 'bg-orange-100/60 border-orange-200 text-orange-800';
      case 'Արհեստական բանականություն':
        return 'bg-red-100/60 border-red-200 text-red-800';
      case 'Համակարգչային գրաֆիկա':
        return 'bg-indigo-100/60 border-indigo-200 text-indigo-800';
      case 'Ցանցային տեխնոլոգիաներ':
        return 'bg-sky-100/60 border-sky-200 text-sky-800';
      default:
        return 'bg-slate-100/60 border-slate-200 text-slate-800';
    }
  };

  const handleCreateModule = () => {
    if (!newModuleDetails.title || !newModuleDetails.description || !newModuleDetails.category || !newModuleDetails.type || !newModuleDetails.duration) {
      toast.error("Լրացրեք բոլոր պարտադիր դաշտերը");
      return;
    }

    const newModule: Module = {
      id: (modules.length + 1).toString(),
      title: newModuleDetails.title,
      description: newModuleDetails.description,
      category: newModuleDetails.category,
      type: newModuleDetails.type,
      credits: newModuleDetails.credits,
      status: 'draft',
      duration: newModuleDetails.duration,
      lessons: newModuleDetails.lessons,
      assessments: newModuleDetails.assessments
    };

    setModules([...modules, newModule]);
    setIsDialogOpen(false);
    setNewModuleDetails({
      title: '',
      description: '',
      category: '',
      type: '',
      credits: 3,
      duration: '',
      lessons: 10,
      assessments: 2
    });

    toast.success("Մոդուլը ստեղծված է", {
      description: "Մոդուլը հաջողությամբ ստեղծվել է սևագրի կարգավիճակով",
    });
  };

  const handlePublishModule = (module: Module) => {
    const updatedModules = modules.map(m => {
      if (m.id === module.id) {
        return { ...m, status: 'published' as const };
      }
      return m;
    });
    
    setModules(updatedModules);
    toast.success("Մոդուլը հրապարակված է", {
      description: `"${module.title}" մոդուլը հաջողությամբ հրապարակվել է։`,
    });
  };

  const handleArchiveModule = (module: Module) => {
    const updatedModules = modules.map(m => {
      if (m.id === module.id) {
        return { ...m, status: 'archived' as const };
      }
      return m;
    });
    
    setModules(updatedModules);
    toast.success("Մոդուլը արխիվացված է", {
      description: `"${module.title}" մոդուլը արխիվացվել է։`,
    });
  };

  const handleEditModule = (module: Module) => {
    // This is just a stub, in real implementation would show edit form
    toast.info("Մոդուլի խմբագրում", {
      description: `"${module.title}" մոդուլի խմբագրման էջը բացված է։`,
    });
  };

  const publishedModules = filteredModules.filter(m => m.status === 'published');
  const draftModules = filteredModules.filter(m => m.status === 'draft');
  const archivedModules = filteredModules.filter(m => m.status === 'archived');

  return (
    <AdminLayout pageTitle="Ուսումնական մոդուլներ">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Փնտրել մոդուլներ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Բոլոր կարգավիճակները" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Բոլորը</SelectItem>
              <SelectItem value="published">Հրապարակված</SelectItem>
              <SelectItem value="draft">Սևագիր</SelectItem>
              <SelectItem value="archived">Արխիվացված</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Բոլոր կատեգորիաները" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Բոլորը</SelectItem>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-2">
                <Plus className="mr-2 h-4 w-4" />
                Նոր մոդուլ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Ստեղծել նոր ուսումնական մոդուլ</DialogTitle>
                <DialogDescription>
                  Լրացրեք ձևը նոր ուսումնական մոդուլ ստեղծելու համար։ Այն կստեղծվի սևագրի կարգավիճակով։
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right font-medium">
                    Անվանում
                  </label>
                  <Input
                    id="title"
                    value={newModuleDetails.title}
                    onChange={(e) => setNewModuleDetails({...newModuleDetails, title: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="category" className="text-right font-medium">
                    Կատեգորիա
                  </label>
                  <Select 
                    value={newModuleDetails.category}
                    onValueChange={(value) => setNewModuleDetails({...newModuleDetails, category: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք կատեգորիան" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="type" className="text-right font-medium">
                    Տեսակ
                  </label>
                  <Select 
                    value={newModuleDetails.type}
                    onValueChange={(value) => setNewModuleDetails({...newModuleDetails, type: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք տեսակը" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODULE_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="duration" className="text-right font-medium">
                    Տևողություն
                  </label>
                  <Input
                    id="duration"
                    value={newModuleDetails.duration}
                    onChange={(e) => setNewModuleDetails({...newModuleDetails, duration: e.target.value})}
                    className="col-span-3"
                    placeholder="Օրինակ՝ 4 շաբաթ"
                    required
                  />
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
                    value={newModuleDetails.credits}
                    onChange={(e) => setNewModuleDetails({...newModuleDetails, credits: parseInt(e.target.value) || 3})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="lessons" className="text-right font-medium">
                    Դասեր
                  </label>
                  <Input
                    id="lessons"
                    type="number"
                    min="1"
                    max="30"
                    value={newModuleDetails.lessons}
                    onChange={(e) => setNewModuleDetails({...newModuleDetails, lessons: parseInt(e.target.value) || 10})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="assessments" className="text-right font-medium">
                    Գնահատումներ
                  </label>
                  <Input
                    id="assessments"
                    type="number"
                    min="0"
                    max="10"
                    value={newModuleDetails.assessments}
                    onChange={(e) => setNewModuleDetails({...newModuleDetails, assessments: parseInt(e.target.value) || 2})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="description" className="text-right font-medium mt-2">
                    Նկարագրություն
                  </label>
                  <Textarea
                    id="description"
                    value={newModuleDetails.description}
                    onChange={(e) => setNewModuleDetails({...newModuleDetails, description: e.target.value})}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateModule}>Ստեղծել մոդուլ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Բոլորը ({filteredModules.length})</TabsTrigger>
          <TabsTrigger value="published">Հրապարակված ({publishedModules.length})</TabsTrigger>
          <TabsTrigger value="draft">Սևագիր ({draftModules.length})</TabsTrigger>
          <TabsTrigger value="archived">Արխիվացված ({archivedModules.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ModulesGrid 
            modules={filteredModules} 
            getStatusBadge={getStatusBadge}
            getModuleColorClass={getModuleColorClass}
            onPublish={handlePublishModule}
            onArchive={handleArchiveModule}
            onEdit={handleEditModule}
          />
        </TabsContent>
        
        <TabsContent value="published">
          <ModulesGrid 
            modules={publishedModules} 
            getStatusBadge={getStatusBadge}
            getModuleColorClass={getModuleColorClass}
            onPublish={handlePublishModule}
            onArchive={handleArchiveModule}
            onEdit={handleEditModule}
          />
        </TabsContent>
        
        <TabsContent value="draft">
          <ModulesGrid 
            modules={draftModules} 
            getStatusBadge={getStatusBadge}
            getModuleColorClass={getModuleColorClass}
            onPublish={handlePublishModule}
            onArchive={handleArchiveModule}
            onEdit={handleEditModule}
          />
        </TabsContent>
        
        <TabsContent value="archived">
          <ModulesGrid 
            modules={archivedModules} 
            getStatusBadge={getStatusBadge}
            getModuleColorClass={getModuleColorClass}
            onPublish={handlePublishModule}
            onArchive={handleArchiveModule}
            onEdit={handleEditModule}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

interface ModulesGridProps {
  modules: Module[];
  getStatusBadge: (status: string) => React.ReactNode;
  getModuleColorClass: (category: string) => string;
  onPublish: (module: Module) => void;
  onArchive: (module: Module) => void;
  onEdit: (module: Module) => void;
}

const ModulesGrid: React.FC<ModulesGridProps> = ({
  modules,
  getStatusBadge,
  getModuleColorClass,
  onPublish,
  onArchive,
  onEdit
}) => {
  if (modules.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-muted-foreground">Մոդուլներ չեն գտնվել</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {modules.map(module => (
        <Card key={module.id} className={`border-l-4 ${getModuleColorClass(module.category)} flex flex-col h-full`}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{module.title}</CardTitle>
              {getStatusBadge(module.status)}
            </div>
            <CardDescription className="line-clamp-2 mt-1">
              {module.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${getModuleColorClass(module.category)} border`}>
                {module.category}
              </Badge>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                {module.type}
              </Badge>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Կրեդիտներ:</span>
                </div>
                <span>{module.credits}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Տևողություն:</span>
                </div>
                <span>{module.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  <span>Դասեր:</span>
                </div>
                <span>{module.lessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Գնահատումներ:</span>
                </div>
                <span>{module.assessments}</span>
              </div>
              {module.course && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Դասընթաց:</span>
                  </div>
                  <span className="truncate max-w-[150px]">{module.course}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex gap-2">
            <Button onClick={() => onEdit(module)} variant="outline" className="flex-1">
              Խմբագրել
            </Button>

            {module.status === 'draft' ? (
              <Button onClick={() => onPublish(module)} variant="default" className="flex-1">
                Հրապարակել
              </Button>
            ) : module.status === 'published' ? (
              <Button onClick={() => onArchive(module)} variant="secondary" className="flex-1">
                Արխիվացնել
              </Button>
            ) : (
              <Button onClick={() => onPublish(module)} variant="secondary" className="flex-1">
                Վերականգնել
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LecturerEducationalModulesPage;
