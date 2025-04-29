import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, User, Calendar, Clock, CheckCircle, AlertCircle, CalendarDays, ChevronDown, ChevronUp, EllipsisVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

interface Task {
  id: string;
  title: string;
  description: string;
  course: string;
  type: 'assignment' | 'quiz' | 'project' | 'exam';
  status: 'active' | 'upcoming' | 'completed' | 'draft';
  dueDate: string;
  submissionsReceived: number;
  totalStudents: number;
  maxPoints: number;
  averageScore?: number;
  attachmentsCount: number;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Ֆունկցիաների իմպլեմենտացիա',
    description: 'Ստեղծեք կոդ, որը իրականացնում է տրված ֆունկցիաները:',
    course: 'Ծրագրավորման հիմունքներ',
    type: 'assignment',
    status: 'active',
    dueDate: '2025-05-15',
    submissionsReceived: 18,
    totalStudents: 32,
    maxPoints: 20,
    averageScore: 16.5,
    attachmentsCount: 1
  },
  {
    id: '2',
    title: 'Տվյալների կառուցվածքների միջանկյալ ստուգում',
    description: 'Միջանկյալ ստուգում տվյալների կառուցվածքների թեմայով:',
    course: 'Տվյալների կառուցվածքներ',
    type: 'quiz',
    status: 'completed',
    dueDate: '2025-04-10',
    submissionsReceived: 28,
    totalStudents: 28,
    maxPoints: 30,
    averageScore: 24.8,
    attachmentsCount: 0
  },
  {
    id: '3',
    title: 'Վեբ հավելվածի մշակում',
    description: 'Մշակեք պարզ վեբ հավելված HTML, CSS և JavaScript օգտագործելով:',
    course: 'Վեբ ծրագրավորման հիմունքներ',
    type: 'project',
    status: 'active',
    dueDate: '2025-06-01',
    submissionsReceived: 12,
    totalStudents: 25,
    maxPoints: 50,
    averageScore: 42.3,
    attachmentsCount: 3
  },
  {
    id: '4',
    title: 'SQL հարցումների վարժություններ',
    description: 'Իրականացրեք SQL հարցումներ տրված խնդիրները լուծելու համար:',
    course: 'Տվյալների բազաների կառավարում',
    type: 'assignment',
    status: 'upcoming',
    dueDate: '2025-05-25',
    submissionsReceived: 0,
    totalStudents: 30,
    maxPoints: 25,
    attachmentsCount: 2
  },
  {
    id: '5',
    title: 'Օբյեկտ կողմնորոշված ծրագրավորման վերջնական քննություն',
    description: 'Եզրափակիչ քննություն ՕԿԾ դասընթացի համար:',
    course: 'Օբյեկտ կողմնորոշված ծրագրավորում',
    type: 'exam',
    status: 'draft',
    dueDate: '2025-06-10',
    submissionsReceived: 0,
    totalStudents: 22,
    maxPoints: 100,
    attachmentsCount: 5
  }
];

const TASK_TYPES = [
  { value: 'assignment', label: 'Առաջադրանք' },
  { value: 'quiz', label: 'Թեստ' },
  { value: 'project', label: 'Նախագիծ' },
  { value: 'exam', label: 'Քննություն' }
];

const COURSES = [
  'Ծրագրավորման հիմունքներ',
  'Տվյալների կառուցվածքներ',
  'Օբյեկտ կողմնորոշված ծրագրավորում',
  'Տվյալների բազաների կառավարում',
  'Վեբ ծրագրավորման հիմունքներ',
  'Ալգորիթմների տեսություն'
];

const LecturerTasksPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<{ field: string; direction: 'asc' | 'desc' }>({ field: 'dueDate', direction: 'asc' });
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [newTaskDetails, setNewTaskDetails] = useState({
    title: '',
    description: '',
    course: '',
    type: '',
    dueDate: '',
    maxPoints: 20,
    attachmentsCount: 0
  });

  // Filter tasks based on search term, status, and type
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder.field === 'dueDate') {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder.direction === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortOrder.field === 'title') {
      return sortOrder.direction === 'asc' 
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortOrder.field === 'submissionsReceived') {
      return sortOrder.direction === 'asc'
        ? a.submissionsReceived - b.submissionsReceived
        : b.submissionsReceived - a.submissionsReceived;
    }
    return 0;
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'assignment':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Առաջադրանք</Badge>;
      case 'quiz':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Թեստ</Badge>;
      case 'project':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Նախագիծ</Badge>;
      case 'exam':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Քննություն</Badge>;
      default:
        return null;
    }
  };

  const handleCreateTask = () => {
    if (!newTaskDetails.title || !newTaskDetails.description || !newTaskDetails.course || !newTaskDetails.type || !newTaskDetails.dueDate) {
      toast.error("Լրացրեք բոլոր պարտադիր դաշտերը");
      return;
    }

    const newTask: Task = {
      id: (tasks.length + 1).toString(),
      title: newTaskDetails.title,
      description: newTaskDetails.description,
      course: newTaskDetails.course,
      type: newTaskDetails.type as 'assignment' | 'quiz' | 'project' | 'exam',
      status: 'draft',
      dueDate: newTaskDetails.dueDate,
      submissionsReceived: 0,
      totalStudents: 25, // Default value
      maxPoints: newTaskDetails.maxPoints,
      attachmentsCount: newTaskDetails.attachmentsCount
    };

    setTasks([...tasks, newTask]);
    setIsDialogOpen(false);
    setNewTaskDetails({
      title: '',
      description: '',
      course: '',
      type: '',
      dueDate: '',
      maxPoints: 20,
      attachmentsCount: 0
    });

    toast.success("Առաջադրանքը ստեղծված է", {
      description: "Առաջադրանքը հաջողությամբ ստեղծվել է սևագրի կարգավիճակով",
    });
  };

  const handleSortChange = (field: string) => {
    if (sortOrder.field === field) {
      // Toggle direction if same field
      setSortOrder({
        field,
        direction: sortOrder.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Set new field with default ascending direction
      setSortOrder({
        field,
        direction: 'asc'
      });
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortOrder.field !== field) return null;
    
    return sortOrder.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline-block ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline-block ml-1" />;
  };

  const toggleTaskStatus = (task: Task) => {
    let newStatus: 'active' | 'upcoming' | 'completed' | 'draft';
    
    switch (task.status) {
      case 'draft':
        newStatus = 'upcoming';
        break;
      case 'upcoming':
        newStatus = 'active';
        break;
      case 'active':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'active';
        break;
      default:
        newStatus = 'draft';
    }
    
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        return { ...t, status: newStatus };
      }
      return t;
    });
    
    setTasks(updatedTasks);
    
    const statusText = {
      'draft': 'սևագիր',
      'upcoming': 'առաջիկա',
      'active': 'ակտիվ',
      'completed': 'ավարտված'
    }[newStatus];
    
    toast.success("Կարգավիճակը փոփոխված է", {
      description: `"${task.title}" առաջադրանքը նշված է որպես ${statusText}:`,
    });
  };

  const handleDuplicateTask = (task: Task) => {
    const newTask = {
      ...task,
      id: (tasks.length + 1).toString(),
      title: `${task.title} (պատճեն)`,
      status: 'draft' as const,
      submissionsReceived: 0
    };
    
    setTasks([...tasks, newTask]);
    
    toast.success("Առաջադրանքը պատճենված է", {
      description: `"${task.title}" առաջադրանքի պատճենը ստեղծվել է:`,
    });
  };

  const handleDeleteTask = (task: Task) => {
    const updatedTasks = tasks.filter(t => t.id !== task.id);
    setTasks(updatedTasks);
    
    toast.success("Առաջադրանքը ջնջված է", {
      description: `"${task.title}" առաջադրանքը հաջողությամբ ջնջվել է:`,
    });
  };

  const toggleTaskSelection = (taskId: string) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) return;
    
    const updatedTasks = tasks.filter(task => !selectedTasks.includes(task.id));
    setTasks(updatedTasks);
    
    toast.success("Ընտրված առաջադրանքները ջնջված են", {
      description: `${selectedTasks.length} առաջադրանք հաջողությամբ ջնջվել է:`,
    });
    
    setSelectedTasks([]);
  };

  const toggleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      // If all are selected, unselect all
      setSelectedTasks([]);
    } else {
      // Otherwise, select all
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const handleViewSubmissions = (task: Task) => {
    toast.info("Հանձնումների դիտում", {
      description: `"${task.title}" առաջադրանքի հանձնումները բացված են:`,
    });
  };

  const activeTasks = filteredTasks.filter(t => t.status === 'active');
  const upcomingTasks = filteredTasks.filter(t => t.status === 'upcoming');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');
  const draftTasks = filteredTasks.filter(t => t.status === 'draft');

  return (
    <AdminLayout pageTitle="Հանձնարարություններ">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Փնտրել առաջադրանքներ..."
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
              <SelectItem value="active">Ակտիվ</SelectItem>
              <SelectItem value="upcoming">Առաջիկա</SelectItem>
              <SelectItem value="completed">Ավարտված</SelectItem>
              <SelectItem value="draft">Սևագիր</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Բոլոր տեսակները" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Բոլորը</SelectItem>
              <SelectItem value="assignment">Առաջադրանք</SelectItem>
              <SelectItem value="quiz">Թեստ</SelectItem>
              <SelectItem value="project">Նախագիծ</SelectItem>
              <SelectItem value="exam">Քննություն</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-2">
                <Plus className="mr-2 h-4 w-4" />
                Նոր առաջադրանք
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Ստեղծել նոր առաջադրանք</DialogTitle>
                <DialogDescription>
                  Լրացրեք ձևը նոր առաջադրանք ստեղծելու համար։
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right font-medium">
                    Վերնագիր
                  </label>
                  <Input
                    id="title"
                    value={newTaskDetails.title}
                    onChange={(e) => setNewTaskDetails({...newTaskDetails, title: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="course" className="text-right font-medium">
                    Դասընթաց
                  </label>
                  <Select 
                    value={newTaskDetails.course}
                    onValueChange={(value) => setNewTaskDetails({...newTaskDetails, course: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք դասընթացը" />
                    </SelectTrigger>
                    <SelectContent>
                      {COURSES.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="type" className="text-right font-medium">
                    Տեսակ
                  </label>
                  <Select 
                    value={newTaskDetails.type}
                    onValueChange={(value) => setNewTaskDetails({...newTaskDetails, type: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Ընտրեք տեսակը" />
                    </SelectTrigger>
                    <SelectContent>
                      {TASK_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="dueDate" className="text-right font-medium">
                    Վերջնաժամկետ
                  </label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTaskDetails.dueDate}
                    onChange={(e) => setNewTaskDetails({...newTaskDetails, dueDate: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="maxPoints" className="text-right font-medium">
                    Առավ. միավորներ
                  </label>
                  <Input
                    id="maxPoints"
                    type="number"
                    min="1"
                    max="100"
                    value={newTaskDetails.maxPoints}
                    onChange={(e) => setNewTaskDetails({...newTaskDetails, maxPoints: parseInt(e.target.value) || 20})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="attachments" className="text-right font-medium">
                    Հավելվածներ
                  </label>
                  <Input
                    id="attachments"
                    type="number"
                    min="0"
                    max="10"
                    value={newTaskDetails.attachmentsCount}
                    onChange={(e) => setNewTaskDetails({...newTaskDetails, attachmentsCount: parseInt(e.target.value) || 0})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="description" className="text-right font-medium mt-2">
                    Նկարագրություն
                  </label>
                  <Textarea
                    id="description"
                    value={newTaskDetails.description}
                    onChange={(e) => setNewTaskDetails({...newTaskDetails, description: e.target.value})}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateTask}>Ստեղծել առաջադրանք</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Բոլորը ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="active">Ակտիվ ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Առաջիկա ({upcomingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Ավարտված ({completedTasks.length})</TabsTrigger>
          <TabsTrigger value="draft">Սևագիր ({draftTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TasksTable 
            tasks={sortedTasks}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
            selectedTasks={selectedTasks}
            toggleTaskSelection={toggleTaskSelection}
            toggleSelectAll={toggleSelectAll}
            handleSortChange={handleSortChange}
            sortOrder={sortOrder}
            SortIcon={SortIcon}
            handleViewSubmissions={handleViewSubmissions}
            toggleTaskStatus={toggleTaskStatus}
            handleDuplicateTask={handleDuplicateTask}
            handleDeleteTask={handleDeleteTask}
            handleBulkDelete={handleBulkDelete}
          />
        </TabsContent>
        
        <TabsContent value="active">
          <TasksTable 
            tasks={sortedTasks.filter(t => t.status === 'active')}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
            selectedTasks={selectedTasks}
            toggleTaskSelection={toggleTaskSelection}
            toggleSelectAll={toggleSelectAll}
            handleSortChange={handleSortChange}
            sortOrder={sortOrder}
            SortIcon={SortIcon}
            handleViewSubmissions={handleViewSubmissions}
            toggleTaskStatus={toggleTaskStatus}
            handleDuplicateTask={handleDuplicateTask}
            handleDeleteTask={handleDeleteTask}
            handleBulkDelete={handleBulkDelete}
          />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <TasksTable 
            tasks={sortedTasks.filter(t => t.status === 'upcoming')}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
            selectedTasks={selectedTasks}
            toggleTaskSelection={toggleTaskSelection}
            toggleSelectAll={toggleSelectAll}
            handleSortChange={handleSortChange}
            sortOrder={sortOrder}
            SortIcon={SortIcon}
            handleViewSubmissions={handleViewSubmissions}
            toggleTaskStatus={toggleTaskStatus}
            handleDuplicateTask={handleDuplicateTask}
            handleDeleteTask={handleDeleteTask}
            handleBulkDelete={handleBulkDelete}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <TasksTable 
            tasks={sortedTasks.filter(t => t.status === 'completed')}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
            selectedTasks={selectedTasks}
            toggleTaskSelection={toggleTaskSelection}
            toggleSelectAll={toggleSelectAll}
            handleSortChange={handleSortChange}
            sortOrder={sortOrder}
            SortIcon={SortIcon}
            handleViewSubmissions={handleViewSubmissions}
            toggleTaskStatus={toggleTaskStatus}
            handleDuplicateTask={handleDuplicateTask}
            handleDeleteTask={handleDeleteTask}
            handleBulkDelete={handleBulkDelete}
          />
        </TabsContent>
        
        <TabsContent value="draft">
          <TasksTable 
            tasks={sortedTasks.filter(t => t.status === 'draft')}
            getStatusBadge={getStatusBadge}
            getTypeBadge={getTypeBadge}
            selectedTasks={selectedTasks}
            toggleTaskSelection={toggleTaskSelection}
            toggleSelectAll={toggleSelectAll}
            handleSortChange={handleSortChange}
            sortOrder={sortOrder}
            SortIcon={SortIcon}
            handleViewSubmissions={handleViewSubmissions}
            toggleTaskStatus={toggleTaskStatus}
            handleDuplicateTask={handleDuplicateTask}
            handleDeleteTask={handleDeleteTask}
            handleBulkDelete={handleBulkDelete}
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

interface TasksTableProps {
  tasks: Task[];
  getStatusBadge: (status: string) => React.ReactNode;
  getTypeBadge: (type: string) => React.ReactNode;
  selectedTasks: string[];
  toggleTaskSelection: (taskId: string) => void;
  toggleSelectAll: () => void;
  handleSortChange: (field: string) => void;
  sortOrder: { field: string; direction: 'asc' | 'desc' };
  SortIcon: ({ field }: { field: string }) => React.ReactNode;
  handleViewSubmissions: (task: Task) => void;
  toggleTaskStatus: (task: Task) => void;
  handleDuplicateTask: (task: Task) => void;
  handleDeleteTask: (task: Task) => void;
  handleBulkDelete: () => void;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  getStatusBadge,
  getTypeBadge,
  selectedTasks,
  toggleTaskSelection,
  toggleSelectAll,
  handleSortChange,
  sortOrder,
  SortIcon,
  handleViewSubmissions,
  toggleTaskStatus,
  handleDuplicateTask,
  handleDeleteTask,
  handleBulkDelete
}) => {
  if (tasks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Հանձնարարություններ չեն գտնվել</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {selectedTasks.length > 0 && (
          <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
            <span>{selectedTasks.length} ընտրված</span>
            <Button variant="destructive" onClick={handleBulkDelete}>Ջնջել ընտրվածները</Button>
          </div>
        )}
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-0">
                  <Checkbox
                    checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('title')}>
                  Վերնագիր <SortIcon field="title" />
                </TableHead>
                <TableHead>Դասընթաց</TableHead>
                <TableHead>Տեսակ</TableHead>
                <TableHead>Կարգավիճակ</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('dueDate')}>
                  Վերջնաժամկետ <SortIcon field="dueDate" />
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSortChange('submissionsReceived')}>
                  Հանձնումներ <SortIcon field="submissionsReceived" />
                </TableHead>
                <TableHead className="text-right">Գործողություններ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                      aria-label={`Select ${task.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Popover>
                      <PopoverTrigger asChild>
                        <span className="cursor-pointer hover:text-primary">{task.title}</span>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="text-sm">
                            <div className="flex justify-between my-1">
                              <span className="text-muted-foreground">Առավելագույն միավոր:</span>
                              <span>{task.maxPoints}</span>
                            </div>
                            <div className="flex justify-between my-1">
                              <span className="text-muted-foreground">Միջին գնահատական:</span>
                              <span>{task.averageScore || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between my-1">
                              <span className="text-muted-foreground">Հավելվածներ:</span>
                              <span>{task.attachmentsCount}</span>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>{task.course}</TableCell>
                  <TableCell>{getTypeBadge(task.type)}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{task.submissionsReceived}/{task.totalStudents}</span>
                      {task.status !== 'draft' && task.status !== 'upcoming' && (
                        <Progress 
                          value={(task.submissionsReceived / task.totalStudents) * 100} 
                          className="h-2 w-12"
                          indicatorClassName={
                            task.status === 'completed' 
                              ? "bg-purple-500" 
                              : (task.submissionsReceived / task.totalStudents) * 100 > 75 
                                ? "bg-green-500" 
                                : (task.submissionsReceived / task.totalStudents) * 100 > 25 
                                  ? "bg-amber-500" 
                                  : "bg-red-500"
                          }
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Բացել մենյուն</span>
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewSubmissions(task)}>
                            Դիտել հանձնումները
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleTaskStatus(task)}>
                            Փոխել կարգավիճակը
                          </DropdownMenuItem>
