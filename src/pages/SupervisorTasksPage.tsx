
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
  CardDescription
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  CheckSquare,
  Calendar,
  Plus,
  Filter,
  Trash2,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

const SupervisorTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isTaskDetailsDialogOpen, setIsTaskDetailsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  // Task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    project: '',
    student: '',
    dueDate: '',
    priority: 'medium'
  });

  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  // Mock tasks data
  const tasks = [
    {
      id: 1,
      title: 'Տվյալների հենքի սխեմայի մշակում',
      description: 'Մշակել տվյալների հենքի սխեման՝ հաշվի առնելով նախագծի պահանջները և օպտիմիզացնելով հարցումների արդյունավետությունը։',
      project: 'Առցանց ուսուցման համակարգ',
      student: 'Արամ Պողոսյան',
      assignedDate: '2024-05-01',
      dueDate: '2024-05-10',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      title: 'UI դիզայնի մշակում',
      description: 'Մշակել հավելվածի օգտատիրական ինտերֆեյսի դիզայնը՝ հաշվի առնելով օգտատիրական փորձը և մատչելիությունը։',
      project: 'Առցանց ուսուցման համակարգ',
      student: 'Մարիամ Սարգսյան',
      assignedDate: '2024-05-01',
      dueDate: '2024-05-15',
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Օգտագործողի ավտորիզացիայի համակարգ',
      description: 'Իրականացնել JWT-ի վրա հիմնված օգտատիրական ավտորիզացիայի համակարգ։',
      project: 'Առցանց ուսուցման համակարգ',
      student: 'Դավիթ Մարտիրոսյան',
      assignedDate: '2024-04-25',
      dueDate: '2024-05-05',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: 4,
      title: 'API ինտերֆեյսի մշակում',
      description: 'Մշակել RESTful API ինտերֆեյս՝ արտաքին ծառայությունների հետ ինտեգրման համար։',
      project: 'Առցանց ուսուցման համակարգ',
      student: 'Արամ Պողոսյան',
      assignedDate: '2024-05-05',
      dueDate: '2024-05-20',
      status: 'pending',
      priority: 'low'
    }
  ];

  // Mock projects for dropdown
  const projects = [
    { id: 1, name: 'Առցանց ուսուցման համակարգ' },
    { id: 2, name: 'Բջջային հավելվածի մշակում' },
    { id: 3, name: 'Տվյալների վերլուծության համակարգ' }
  ];

  // Mock students for dropdown
  const students = [
    { id: 's1', name: 'Արամ Պողոսյան' },
    { id: 's2', name: 'Մարիամ Սարգսյան' },
    { id: 's3', name: 'Դավիթ Մարտիրոսյան' }
  ];

  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';
    
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className={isDark ? "bg-amber-900/60 text-amber-300 border-amber-700" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>Սպասվող</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200"}>Ընթացքի մեջ</Badge>;
      case 'completed':
        return <Badge variant="outline" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200"}>Ավարտված</Badge>;
      case 'overdue':
        return <Badge variant="outline" className={isDark ? "bg-red-900/60 text-red-300 border-red-700" : "bg-red-50 text-red-700 border-red-200"}>Ժամկետանց</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const isDark = theme === 'dark';
    
    switch(priority) {
      case 'high':
        return <Badge variant="secondary" className={isDark ? "bg-red-900/60 text-red-300" : "bg-red-100 text-red-800"}>Բարձր</Badge>;
      case 'medium':
        return <Badge variant="secondary" className={isDark ? "bg-amber-900/60 text-amber-300" : "bg-amber-100 text-amber-800"}>Միջին</Badge>;
      case 'low':
        return <Badge variant="secondary" className={isDark ? "bg-green-900/60 text-green-300" : "bg-green-100 text-green-800"}>Ցածր</Badge>;
      default:
        return <Badge variant="secondary">Անորոշ</Badge>;
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by tab (status)
    if (activeTab !== 'all' && task.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.student.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddTask = () => {
    // Validate form
    if (!newTask.title || !newTask.project || !newTask.student || !newTask.dueDate) {
      toast.error('Խնդրում ենք լրացրեք բոլոր պարտադիր դաշտերը։');
      return;
    }
    
    // Add task logic would go here
    toast.success('Հանձնարարությունը հաջողությամբ ստեղծվել է։');
    setIsAddTaskDialogOpen(false);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      project: '',
      student: '',
      dueDate: '',
      priority: 'medium'
    });
  };

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskDetailsDialogOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    // Delete task logic would go here
    toast.success('Հանձնարարությունը հաջողությամբ ջնջվել է։');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hy-AM');
  };

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tabsListClass = theme === 'dark' ? 'bg-gray-700' : '';
  const tabsTriggerClass = theme === 'dark' ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100' : '';
  const tableHeaderClass = theme === 'dark' ? 'bg-gray-900 text-gray-300' : '';
  const tableRowClass = theme === 'dark' ? 'hover:bg-gray-900/30 border-gray-700' : 'hover:bg-gray-100';
  const dialogClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const inputClass = theme === 'dark' ? 'bg-gray-900 border-gray-700' : '';

  return (
    <AdminLayout pageTitle="Հանձնարարություններ">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Հանձնարարություններ</CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              Ուսանողներին տրված հանձնարարությունների կառավարում
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2" onClick={() => setIsAddTaskDialogOpen(true)}>
            <Plus size={16} /> Նոր հանձնարարություն
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Փնտրել հանձնարարություններ..."
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
                <TabsTrigger value="pending" className={tabsTriggerClass}>Սպասվող</TabsTrigger>
                <TabsTrigger value="in_progress" className={tabsTriggerClass}>Ընթացքի մեջ</TabsTrigger>
                <TabsTrigger value="completed" className={tabsTriggerClass}>Ավարտված</TabsTrigger>
                <TabsTrigger value="overdue" className={tabsTriggerClass}>Ժամկետանց</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                {filteredTasks.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className={tableHeaderClass}>
                        <TableRow className={theme === 'dark' ? 'border-gray-700' : ''}>
                          <TableHead>Վերնագիր</TableHead>
                          <TableHead>Նախագիծ</TableHead>
                          <TableHead>Ուսանող</TableHead>
                          <TableHead>Կարգավիճակ</TableHead>
                          <TableHead>Առաջնահերթություն</TableHead>
                          <TableHead>Վերջնաժամկետ</TableHead>
                          <TableHead className="text-right">Գործողություններ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTasks.map(task => (
                          <TableRow key={task.id} className={tableRowClass}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.project}</TableCell>
                            <TableCell>{task.student}</TableCell>
                            <TableCell>{getStatusBadge(task.status)}</TableCell>
                            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                            <TableCell>{formatDate(task.dueDate)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleViewTask(task)}
                                  className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className={theme === 'dark' ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-500'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className={`flex flex-col items-center justify-center py-12 text-center rounded-md border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                    <CheckSquare className="h-12 w-12 mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">Հանձնարարություններ չեն գտնվել</h3>
                    <p className="text-sm mt-1 max-w-sm">
                      Այս կատեգորիայում հանձնարարություններ չկան կամ ոչ մեկը չի համապատասխանում որոնման արդյունքներին։
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className={`sm:max-w-[500px] ${dialogClass}`}>
          <DialogHeader>
            <DialogTitle>Նոր հանձնարարություն</DialogTitle>
            <DialogDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              Ավելացրեք նոր հանձնարարություն ուսանողի համար։
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Վերնագիր *
                </label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className={inputClass}
                  placeholder="Մուտքագրեք հանձնարարության վերնագիրը"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Նկարագրություն
                </label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className={inputClass}
                  placeholder="Մանրամասն նկարագրեք հանձնարարությունը"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="project" className="text-sm font-medium">
                    Նախագիծ *
                  </label>
                  <Select 
                    value={newTask.project} 
                    onValueChange={(value) => setNewTask({...newTask, project: value})}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Ընտրեք նախագիծը" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.name}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="student" className="text-sm font-medium">
                    Ուսանող *
                  </label>
                  <Select 
                    value={newTask.student} 
                    onValueChange={(value) => setNewTask({...newTask, student: value})}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Ընտրեք ուսանողին" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.name}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dueDate" className="text-sm font-medium">
                    Վերջնաժամկետ *
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="priority" className="text-sm font-medium">
                    Առաջնահերթություն
                  </label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => setNewTask({...newTask, priority: value})}
                  >
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Ընտրեք առաջնահերթությունը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Բարձր</SelectItem>
                      <SelectItem value="medium">Միջին</SelectItem>
                      <SelectItem value="low">Ցածր</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)} className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
              Չեղարկել
            </Button>
            <Button onClick={handleAddTask}>
              Ավելացնել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Dialog */}
      <Dialog open={isTaskDetailsDialogOpen} onOpenChange={setIsTaskDetailsDialogOpen}>
        <DialogContent className={`sm:max-w-[500px] ${dialogClass}`}>
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTask.title}</DialogTitle>
                <DialogDescription className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-400' : ''}>
                    {selectedTask.project}
                  </span>
                  {getStatusBadge(selectedTask.status)}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Նկարագրություն</h4>
                    <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Ուսանող</h4>
                      <p className="text-sm text-muted-foreground">{selectedTask.student}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Առաջնահերթություն</h4>
                      <div>{getPriorityBadge(selectedTask.priority)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Նշանակման ամսաթիվ</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{formatDate(selectedTask.assignedDate)}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Վերջնաժամկետ</h4>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{formatDate(selectedTask.dueDate)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTaskDetailsDialogOpen(false)} className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                  Փակել
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SupervisorTasksPage;
