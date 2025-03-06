import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { FadeIn } from '@/components/LocalTransitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from '@/components/UserManagement';
import ProjectCreation from '@/components/ProjectCreation';
import { Users, FileText, BookOpen, Trash, Pencil, Eye, Filter, Database, UserPlus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { getUsersByRole, getStudentsByCourseAndGroup, getCourses, getGroups } from '@/data/userRoles';
import { projectThemes } from '@/data/projectThemes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ThemeGrid from '@/components/ThemeGrid';
import { Badge } from '@/components/ui/badge';
import { getProjectImage } from '@/lib/getProjectImage';

const AdminDashboard: React.FC = () => {
  
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("themes");
  const [sampleProjectToEdit, setSampleProjectToEdit] = useState<any>(null);
  const [projectToAssign, setProjectToAssign] = useState<any>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");

  const students = selectedCourse || selectedGroup
    ? getStudentsByCourseAndGroup(selectedCourse, selectedGroup)
    : getUsersByRole('student');
    
  const instructors = getUsersByRole('instructor');
  const allProjects = [...projectThemes, ...createdProjects];
  const courses = getCourses();
  const groups = getGroups(selectedCourse);

  useEffect(() => {
    const storedProjects = localStorage.getItem('createdProjects');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setCreatedProjects(parsedProjects);
      } catch (e) {
        console.error('Error parsing stored projects:', e);
      }
    }
    
    const storedAssignments = localStorage.getItem('projectAssignments');
    if (storedAssignments) {
      try {
        const parsedAssignments = JSON.parse(storedAssignments);
        setAssignments(parsedAssignments);
      } catch (e) {
        console.error('Error parsing stored assignments:', e);
      }
    }
  }, []);

  const handleProjectCreated = (project: any) => {
    const newProjects = [...createdProjects, project];
    setCreatedProjects(newProjects);
    
    localStorage.setItem('createdProjects', JSON.stringify(newProjects));
    
    setActiveTab("projects");
  };
  
  const handleAssignProject = () => {
    if (!selectedProject || !selectedStudent) {
      toast.error("Խնդրում ենք ընտրել և՛ նախագիծը, և՛ ուսանողին։");
      return;
    }
    
    const projectId = parseInt(selectedProject);
    const project = allProjects.find(p => p.id === projectId);
    
    if (!project) {
      toast.error("Նախագիծը չի գտնվել։");
      return;
    }
    
    const student = students.find(s => s.id === selectedStudent);
    
    if (!student) {
      toast.error("Ուսանողը չի գտնվել։");
      return;
    }
    
    const newAssignment = {
      id: Date.now().toString(),
      projectId,
      projectTitle: project.title,
      studentId: student.id,
      studentName: student.name,
      studentCourse: student.course || '',
      studentGroup: student.group || '',
      assignedBy: user?.id,
      assignedByName: user?.name,
      date: new Date().toISOString()
    };
    
    const newAssignments = [...assignments, newAssignment];
    setAssignments(newAssignments);
    localStorage.setItem('projectAssignments', JSON.stringify(newAssignments));
    
    const reservedProjects = localStorage.getItem('reservedProjects');
    let reservations = [];
    
    if (reservedProjects) {
      try {
        reservations = JSON.parse(reservedProjects);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
        reservations = [];
      }
    }
    
    const existingReservation = reservations.find(
      (r: any) => r.projectId === projectId && r.userId === student.id
    );
    
    if (!existingReservation) {
      const newReservation = {
        projectId,
        userId: student.id,
        projectTitle: project.title,
        timestamp: new Date().toISOString(),
        assignedBy: user?.id
      };
      
      reservations.push(newReservation);
      localStorage.setItem('reservedProjects', JSON.stringify(reservations));
    }
    
    toast.success(`${project.title} նախագիծը հաջողությամբ նշանակվել է ${student.name}-ին։`);
    
    setSelectedProject("");
    setSelectedStudent("");
  };

  const handleEditProject = (project: any) => {
    setProjectToEdit(project);
  };

  const handleUpdateProject = (updatedData: any) => {
    const updatedProjects = createdProjects.map(project => 
      project.id === projectToEdit.id ? { ...project, ...updatedData } : project
    );
    
    setCreatedProjects(updatedProjects);
    localStorage.setItem('createdProjects', JSON.stringify(updatedProjects));
    setProjectToEdit(null);
    
    toast.success("Նախագիծը հաջողությամբ թարմացվել է։");
  };

  const handleDeleteProject = (projectId: number) => {
    const updatedProjects = createdProjects.filter(project => project.id !== projectId);
    setCreatedProjects(updatedProjects);
    localStorage.setItem('createdProjects', JSON.stringify(updatedProjects));
    
    const updatedAssignments = assignments.filter((a: any) => a.projectId !== projectId);
    setAssignments(updatedAssignments);
    localStorage.setItem('projectAssignments', JSON.stringify(updatedAssignments));
    
    try {
      const reservedProjects = localStorage.getItem('reservedProjects');
      if (reservedProjects) {
        const reservations = JSON.parse(reservedProjects);
        const updatedReservations = reservations.filter((r: any) => r.projectId !== projectId);
        localStorage.setItem('reservedProjects', JSON.stringify(updatedReservations));
      }
    } catch (e) {
      console.error('Error updating reserved projects:', e);
    }
    
    toast.success("Նախագիծը հաջողությամբ ջնջվել է։");
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    const assignment = assignments.find((a: any) => a.id === assignmentId);
    if (!assignment) return;
    
    const updatedAssignments = assignments.filter((a: any) => a.id !== assignmentId);
    setAssignments(updatedAssignments);
    localStorage.setItem('projectAssignments', JSON.stringify(updatedAssignments));
    
    try {
      const reservedProjects = localStorage.getItem('reservedProjects');
      if (reservedProjects) {
        const reservations = JSON.parse(reservedProjects);
        const updatedReservations = reservations.filter(
          (r: any) => !(r.projectId === assignment.projectId && r.userId === assignment.studentId)
        );
        localStorage.setItem('reservedProjects', JSON.stringify(updatedReservations));
      }
    } catch (e) {
      console.error('Error updating reserved projects:', e);
    }
    
    toast.success("Նշանակումը հաջողությամբ ջնջվել է։");
  };

  const handleEditSampleProject = (project: any) => {
    setSampleProjectToEdit({...project});
  };

  const handleUpdateSampleProject = (updatedData: any) => {
    const projectExists = createdProjects.some(p => p.id === sampleProjectToEdit.id);
    
    if (projectExists) {
      const updatedProjects = createdProjects.map(project => 
        project.id === sampleProjectToEdit.id ? { ...project, ...updatedData } : project
      );
      setCreatedProjects(updatedProjects);
      localStorage.setItem('createdProjects', JSON.stringify(updatedProjects));
    } else {
      const newProject = {
        ...sampleProjectToEdit,
        ...updatedData,
        id: Date.now(),
        createdBy: user?.id,
        createdAt: new Date().toISOString()
      };
      
      const newProjects = [...createdProjects, newProject];
      setCreatedProjects(newProjects);
      localStorage.setItem('createdProjects', JSON.stringify(newProjects));
    }
    
    setSampleProjectToEdit(null);
    toast.success("Նախագիծը հաջողությամբ թարմացվել է։");
  };

  const handleOpenAssignDialog = (project: any) => {
    setProjectToAssign(project);
    setSelectedInstructor("");
  };

  const handleAssignInstructor = () => {
    if (!selectedInstructor || !projectToAssign) {
      toast.error("Խնդրում ենք ընտրել դասախոսին։");
      return;
    }

    const instructor = instructors.find(i => i.id === selectedInstructor);
    if (!instructor) {
      toast.error("Դասախոսը չի գտնվել։");
      return;
    }

    const projectExists = createdProjects.some(p => p.id === projectToAssign.id);
    
    if (projectExists) {
      const updatedProjects = createdProjects.map(project => 
        project.id === projectToAssign.id 
          ? { ...project, assignedInstructor: instructor.id, assignedInstructorName: instructor.name } 
          : project
      );
      setCreatedProjects(updatedProjects);
      localStorage.setItem('createdProjects', JSON.stringify(updatedProjects));
    } else {
      const newProject = {
        ...projectToAssign,
        id: Date.now(),
        assignedInstructor: instructor.id,
        assignedInstructorName: instructor.name,
        createdBy: user?.id,
        createdAt: new Date().toISOString()
      };
      
      const newProjects = [...createdProjects, newProject];
      setCreatedProjects(newProjects);
      localStorage.setItem('createdProjects', JSON.stringify(newProjects));
    }

    setProjectToAssign(null);
    toast.success(`${projectToAssign.title} նախագիծը հաջողությամբ նշանակվել է ${instructor.name}-ին։`);
  };

  const canEditProject = (project: any) => {
    return user && (
      user.role === 'admin' || 
      user.role === 'supervisor' ||
      (user.role === 'instructor' && project.assignedInstructor === user.id) ||
      (user.role === 'instructor' && project.createdBy === user.id)
    );
  };

  if (!user || (user.role !== 'admin' && user.role !== 'supervisor' && user.role !== 'instructor')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Մուտքն արգելված է</h1>
            <p className="text-muted-foreground">
              Դուք չունեք այս էջ մտնելու համար անհրաժեշտ իրավունքներ։
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 max-w-6xl text-left">
          <FadeIn>
            <h1 className="text-3xl font-bold mb-2">Կառավարման վահանակ</h1>
            <p className="text-muted-foreground mb-8">
              Կառավարեք համակարգի օգտատերերին, դասընթացները և պրոեկտները։
            </p>
            
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 h-auto mb-8">
                <TabsTrigger value="users" className="flex items-center gap-2" disabled={user.role !== 'admin'}>
                  <Users size={16} /> Օգտատերերի կառավարում
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FileText size={16} /> Պրոեկտների ստեղծում
                </TabsTrigger>
                <TabsTrigger value="themes" className="flex items-center gap-2">
                  <Database size={16} /> Առկա պրոեկտներ
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <BookOpen size={16} /> Պրոեկտների նշանակում
                </TabsTrigger>
                <TabsTrigger value="management" className="flex items-center gap-2">
                  <Filter size={16} /> Ըստ կուրսերի
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="projects">
                <ProjectCreation onProjectCreated={handleProjectCreated} />
                
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Ստեղծված նախագծեր</CardTitle>
                    <CardDescription>
                      Բոլոր նախագծերը, որոնք ստեղծվել են համակարգում
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">Նախագիծ</TableHead>
                            <TableHead className="text-left">Կատեգորիա</TableHead>
                            <TableHead className="text-left">Բարդություն</TableHead>
                            <TableHead className="text-left">Ստեղծվել է</TableHead>
                            <TableHead className="text-right">Գործողություններ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {createdProjects.length > 0 ? (
                            createdProjects.map((project) => (
                              <TableRow key={project.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={getProjectImage(project)} 
                                      alt={project.title}
                                      className="w-10 h-10 rounded object-cover" 
                                    />
                                    {project.title}
                                  </div>
                                </TableCell>
                                <TableCell>{project.category}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    project.complexity === 'Սկսնակ' ? 'outline' : 
                                    project.complexity === 'Միջին' ? 'secondary' : 
                                    'default'
                                  }>
                                    {project.complexity}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {project.createdAt ? new Date(project.createdAt).toLocaleDateString('hy-AM') : 'Անհայտ'}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      onClick={() => handleEditProject(project)}
                                      title="Խմբագրել"
                                    >
                                      <Pencil size={14} />
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="icon"
                                      onClick={() => handleDeleteProject(project.id)}
                                      title="Ջնջել"
                                    >
                                      <Trash size={14} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                Ստեղծված նախագծեր չկան
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="themes">
                <Card>
                  <CardHeader>
                    <CardTitle>Առկա պրոեկտներ</CardTitle>
                    <CardDescription>
                      Համակարգում առկա բոլոր օրինակ պրոեկտների ցանկը կամ ձեր խմբագրած պրոեկտները
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left w-[35%]">Վերնագիր</TableHead>
                            <TableHead className="text-left">Կատեգորիա</TableHead>
                            <TableHead className="text-left">Բարդություն</TableHead>
                            <TableHead className="text-left">Դասախոս</TableHead>
                            <TableHead className="text-right">Գործողություններ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projectThemes.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={getProjectImage(project)} 
                                    alt={project.title}
                                    className="w-10 h-10 rounded object-cover" 
                                  />
                                  <span className="line-clamp-2">{project.title}</span>
                                </div>
                              </TableCell>
                              <TableCell>{project.category}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  project.complexity === 'Սկսնակ' ? 'outline' : 
                                  project.complexity === 'Միջին' ? 'secondary' : 
                                  'default'
                                }>
                                  {project.complexity}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {project.assignedInstructorName ? (
                                  <Badge variant="secondary" className="text-xs">
                                    {project.assignedInstructorName}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground text-xs">Չնշանակված</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    title="Դիտել"
                                    asChild
                                  >
                                    <a href={`/project/${project.id}`} target="_blank" rel="noopener noreferrer">
                                      <Eye size={14} />
                                    </a>
                                  </Button>
                                  {canEditProject(project) && (
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="icon"
                                        title="Խմբագրել պրոեկտը"
                                        onClick={() => handleEditSampleProject(project)}
                                      >
                                        <Pencil size={14} />
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="icon"
                                        title="Նշանակել դասախոսին"
                                        onClick={() => handleOpenAssignDialog(project)}
                                      >
                                        <UserPlus size={14} />
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="icon"
                                        title="Կլոնավորել պրոեկտը"
                                        onClick={() => {
                                          const newProject = {
                                            ...project,
                                            id: Date.now(),
                                            createdBy: user?.id,
                                            createdAt: new Date().toISOString()
                                          };
                                          const newProjects = [...createdProjects, newProject];
                                          setCreatedProjects(newProjects);
                                          localStorage.setItem('createdProjects', JSON.stringify(newProjects));
                                          toast.success(`${project.title} պրոեկտը հաջողությամբ կլոնավորվել է`);
                                        }}
                                      >
                                        <FileText size={14} />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-8 mb-4">Ձեր խմբագրած պրոեկտները</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left w-[35%]">Վերնագիր</TableHead>
                            <TableHead className="text-left">Կատեգորիա</TableHead>
                            <TableHead className="text-left">Բարդություն</TableHead>
                            <TableHead className="text-left">Դասախոս</TableHead>
                            <TableHead className="text-right">Գործողություններ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {createdProjects.length > 0 ? (
                            createdProjects.map((project) => (
                              <TableRow key={project.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={getProjectImage(project)} 
                                      alt={project.title}
                                      className="w-10 h-10 rounded object-cover" 
                                    />
                                    <span className="line-clamp-2">{project.title}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{project.category}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    project.complexity === 'Սկսնակ' ? 'outline' : 
                                    project.complexity === 'Միջին' ? 'secondary' : 
                                    'default'
                                  }>
                                    {project.complexity}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {project.assignedInstructorName ? (
                                    <Badge variant="secondary" className="text-xs">
                                      {project.assignedInstructorName}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">Չնշանակված</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      title="Դիտել"
                                      asChild
                                    >
                                      <a href={`/project/${project.id}`} target="_blank" rel="noopener noreferrer">
                                        <Eye size={14} />
                                      </a>
                                    </Button>
                                    {canEditProject(project) && (
                                      <>
                                        <Button 
                                          variant="outline" 
                                          size="icon"
                                          title="Խմբագրել պրոեկտը"
                                          onClick={() => handleEditSampleProject(project)}
                                        >
                                          <Pencil size={14} />
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="icon"
                                          title="Նշանակել դասախոսին"
                                          onClick={() => handleOpenAssignDialog(project)}
                                        >
                                          <UserPlus size={14} />
                                        </Button>
                                        <Button 
                                          variant="destructive" 
                                          size="icon"
                                          onClick={() => handleDeleteProject(project.id)}
                                          title="Ջնջել"
                                        >
                                          <Trash size={14} />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                Ձեր խմբագրած պրոեկտներ չկան
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="assignments">
                <Card>
                  <CardHeader>
                    <CardTitle>Պրոեկտների նշանակում</CardTitle>
                    <CardDescription>
                      Նշանակեք պրոեկտներ ուսանողներին՝ պրակտիկայի համար
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Ֆիլտրել ուսանողներին</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                              <SelectTrigger>
                                <SelectValue placeholder="Ընտրեք կուրսը" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Բոլոր կուրսերը</SelectItem>
                                {courses.map((course) => (
                                  <SelectItem key={course} value={course}>
                                    {course}-րդ կուրս
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <Select 
                              value={selectedGroup} 
                              onValueChange={setSelectedGroup}
                              disabled={!selectedCourse || selectedCourse === "all"}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Ընտրեք խումբը" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Բոլոր խմբերը</SelectItem>
                                {groups.map((group) => (
                                  <SelectItem key={group} value={group}>
                                    {group}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ընտրեք նախագիծը</label>
                          <Select value={selectedProject} onValueChange={setSelectedProject}>
                            <SelectTrigger>
                              <SelectValue placeholder="Ընտրեք նախագիծ" />
                            </SelectTrigger>
                            <SelectContent>
                              {allProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id.toString()}>
                                  {project.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Ընտրեք ուսանողին</label>
                          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                            <SelectTrigger>
                              <SelectValue placeholder="Ընտրեք ուսանող" />
                            </SelectTrigger>
                            <SelectContent>
                              {students.map((student) => (
                                <SelectItem key={student.id} value={student.id}>
                                  {student.name} {student.course && student.group ? 
                                    `(${student.course}-րդ կուրս, ${student.group})` : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button onClick={handleAssignProject} className="w-full">
                          Նշանակել պրոեկտը
                        </Button>
                      </div>
                      
                      <div className="bg-accent/20 rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-2">Նշանակման մասին</h3>
                        <p className="text-sm text-muted-foreground">
                          Նշանակելով նախագիծը ուսանողին, այն ավտոմատ կերպով կավելացվի ուսանողի ամրագրված նախագծերի ցանկում:
                          Ուսանողը կարող է մուտք գործել համակարգ և տեսնել իրեն նշանակված պրոեկտները, ինչպես նաև կառավարել դրանց ընթացքը:
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">Նախագիծ</TableHead>
                            <TableHead className="text-left">Ուսանող</TableHead>
                            <TableHead className="text-left">Կուրս/Խումբ</TableHead>
                            <TableHead className="text-left">Նշանակման ամսաթիվ</TableHead>
                            <TableHead className="text-right">Գործողություններ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignments.length > 0 ? (
                            assignments.map((assignment) => (
                              <TableRow key={assignment.id}>
                                <TableCell className="font-medium">
                                  {assignment.projectTitle}
                                </TableCell>
                                <TableCell>{assignment.studentName}</TableCell>
                                <TableCell>
                                  {assignment.studentCourse && assignment.studentGroup ? 
                                    `${assignment.studentCourse}-րդ կուրս, ${assignment.studentGroup}` : ''}
                                </TableCell>
                                <TableCell>
                                  {new Date(assignment.date).toLocaleDateString('hy-AM')}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      title="Դիտել"
                                      asChild
                                    >
                                      <a href={`/project/${assignment.projectId}`} target="_blank" rel="noopener noreferrer">
                                        <Eye size={14} />
                                      </a>
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="icon"
                                      onClick={() => handleDeleteAssignment(assignment.id)}
                                      title="Ջնջել"
                                    >
                                      <Trash size={14} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                Նշանակված պրոեկտներ չկան
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="management">
                <Card>
                  <CardHeader>
                    <CardTitle>Պրոեկտները ըստ կուրսերի</CardTitle>
                    <CardDescription>
                      Դիտեք և կառավարեք պրոեկտները ըստ կուրսերի և խմբերի
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label>Ընտրեք կուրսը</Label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Ընտրեք կուրսը" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Բոլոր կուրսերը</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course} value={course}>
                                {course}-րդ կուրս
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Ընտրեք խումբը</Label>
                        <Select 
                          value={selectedGroup} 
                          onValueChange={setSelectedGroup}
                          disabled={!selectedCourse || selectedCourse === "all"}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Ընտրեք խումբը" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Բոլոր խմբերը</SelectItem>
                            {groups.map((group) => (
                              <SelectItem key={group} value={group}>
                                {group}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">Նախագիծ</TableHead>
                            <TableHead className="text-left">Ուսանող</TableHead>
                            <TableHead className="text-left">Կուրս/Խումբ</TableHead>
                            <TableHead className="text-left">Նշանակման ամսաթիվ</TableHead>
                            <TableHead className="text-left">Կարգավիճակ</TableHead>
                            <TableHead className="text-right">Գործողություններ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignments
                            .filter((a: any) => 
                              (!selectedCourse || selectedCourse === "all" || a.studentCourse === selectedCourse) && 
                              (!selectedGroup || selectedGroup === "all" || a.studentGroup === selectedGroup)
                            )
                            .map((assignment) => (
                              <TableRow key={assignment.id}>
                                <TableCell className="font-medium">
                                  {assignment.projectTitle}
                                </TableCell>
                                <TableCell>{assignment.studentName}</TableCell>
                                <TableCell>
                                  {assignment.studentCourse && assignment.studentGroup ? 
                                    `${assignment.studentCourse}-րդ կուրս, ${assignment.studentGroup}` : ''}
                                </TableCell>
                                <TableCell>
                                  {new Date(assignment.date).toLocaleDateString('hy-AM')}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">Նշանակված</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon"
                                      title="Դիտել"
                                      asChild
                                    >
                                      <a href={`/project/${assignment.projectId}`} target="_blank" rel="noopener noreferrer">
                                        <Eye size={14} />
                                      </a>
                                    </Button>
                                    <Button 
                                      variant="destructive" 
                                      size="icon"
                                      onClick={() => handleDeleteAssignment(assignment.id)}
                                      title="Ջնջել"
                                    >
                                      <Trash size={14} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          }
                          {assignments.filter((a: any) => 
                            (!selectedCourse || selectedCourse === "all" || a.studentCourse === selectedCourse) && 
                            (!selectedGroup || selectedGroup === "all" || a.studentGroup === selectedGroup)
                          ).length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                Ընտրված կուրսի/խմբի համար նշանակված պրոեկտներ չկան
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Բոլոր նախագծերը</h3>
                      <ThemeGrid createdProjects={createdProjects} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
      
      {projectToEdit && (
        <Dialog 
          open={!!projectToEdit} 
          onOpenChange={(open) => !open && setProjectToEdit(null)}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Խմբագրել նախագիծը</DialogTitle>
              <DialogDescription>
                Փոփոխեք նախագծի տվյալները
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Վերնագիր</Label>
                <Input
                  id="edit-title"
                  defaultValue={projectToEdit.title}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Կատեգորիա</Label>
                <Input
                  id="edit-category"
                  defaultValue={projectToEdit.category}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-complexity">Բարդություն</Label>
                <Select defaultValue={projectToEdit.complexity}>
                  <SelectTrigger id="edit-complexity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Սկսնակ">Սկսնակ</SelectItem>
                    <SelectItem value="Միջին">Միջին</SelectItem>
                    <SelectItem value="Առաջադեմ">Առաջադեմ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Նկարագրություն</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={projectToEdit.description}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-detailed-description">Մանրամասն նկարագրություն</Label>
                <Textarea
                  id="edit-detailed-description"
                  defaultValue={projectToEdit.detailedDescription}
                  rows={5}
                />
              </div>
              
              {projectToEdit.image && (
                <div className="mt-2">
                  <Label>Ընթացիկ նկար</Label>
                  <div className="mt-1 border rounded-md overflow-hidden">
                    <img 
                      src={getProjectImage(projectToEdit)} 
                      alt={projectToEdit.title} 
                      className="w-full max-h-32 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setProjectToEdit(null)}>
                Չեղարկել
              </Button>
              <Button onClick={() => {
                const titleInput = document.getElementById('edit-title') as HTMLInputElement;
                const categoryInput = document.getElementById('edit-category') as HTMLInputElement;
                const complexitySelect = document.getElementById('edit-complexity') as HTMLSelectElement;
                const descriptionInput = document.getElementById('edit-description') as HTMLTextAreaElement;
                const detailedDescInput = document.getElementById('edit-detailed-description') as HTMLTextAreaElement;
                
                const updatedData = {
                  title: titleInput.value,
                  category: categoryInput.value,
                  complexity: complexitySelect.value,
                  description: descriptionInput.value,
                  detailedDescription: detailedDescInput.value,
                };
                
                handleUpdateProject(updatedData);
              }}>
                Պահպանել
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {sampleProjectToEdit && (
        <Dialog 
          open={!!sampleProjectToEdit} 
          onOpenChange={(open) => !open && setSampleProjectToEdit(null)}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Խմբագրել նախագիծը</DialogTitle>
              <DialogDescription>
                Փոփոխեք նախագծի տվյալները։ Փոփոխությունները կպահպանվեն որպես ձեր կլոնավորված նախագիծ։
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="sample-edit-title">Վերնագիր</Label>
                <Input
                  id="sample-edit-title"
                  defaultValue={sampleProjectToEdit.title}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sample-edit-category">Կատեգորիա</Label>
                <Input
                  id="sample-edit-category"
                  defaultValue={sampleProjectToEdit.category}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sample-edit-complexity">Բարդություն</Label>
                <Select defaultValue={sampleProjectToEdit.complexity}>
                  <SelectTrigger id="sample-edit-complexity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Սկսնակ">Սկսնակ</SelectItem>
                    <SelectItem value="Միջին">Միջին</SelectItem>
                    <SelectItem value="Առաջադեմ">Առաջադեմ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="sample-edit-description">Նկարագրություն</Label>
                <Textarea
                  id="sample-edit-description"
                  defaultValue={sampleProjectToEdit.description}
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sample-edit-detailed-description">Մանրամասն նկարագրություն</Label>
                <Textarea
                  id="sample-edit-detailed-description"
                  defaultValue={sampleProjectToEdit.detailedDescription}
                  rows={5}
                />
              </div>
              
              {sampleProjectToEdit.image && (
                <div className="mt-2">
                  <Label>Ընթացիկ նկար</Label>
                  <div className="mt-1 border rounded-md overflow-hidden">
                    <img 
                      src={getProjectImage(sampleProjectToEdit)} 
                      alt={sampleProjectToEdit.title} 
                      className="w-full max-h-32 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSampleProjectToEdit(null)}>
                Չեղարկել
              </Button>
              <Button onClick={() => {
                const titleInput = document.getElementById('sample-edit-title') as HTMLInputElement;
                const categoryInput = document.getElementById('sample-edit-category') as HTMLInputElement;
                const complexitySelect = document.getElementById('sample-edit-complexity') as HTMLSelectElement;
                const descriptionInput = document.getElementById('sample-edit-description') as HTMLTextAreaElement;
                const detailedDescInput = document.getElementById('sample-edit-detailed-description') as HTMLTextAreaElement;
                
                const updatedData = {
                  title: titleInput.value,
                  category: categoryInput.value,
                  complexity: complexitySelect.value,
                  description: descriptionInput.value,
                  detailedDescription: detailedDescInput.value,
                };
                
                handleUpdateSampleProject(updatedData);
              }}>
                Պահպանել
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {projectToAssign && (
        <Dialog 
          open={!!projectToAssign} 
          onOpenChange={(open) => !open && setProjectToAssign(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Նշանակել դասախոսին</DialogTitle>
              <DialogDescription>
                Ընտրեք դասախոսին, ով պատասխանատու կլինի այս նախագծի համար
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Նախագիծ՝</h3>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  {projectToAssign.image && (
                    <img 
                      src={getProjectImage(projectToAssign)} 
                      alt={projectToAssign.title} 
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <span className="font-medium">{projectToAssign.title}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Ընտրեք դասախոսին</Label>
                <Select value={selectedInstructor} onValueChange={setSelectedInstructor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ընտրեք դասախոսին" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setProjectToAssign(null)}>
                Չեղարկել
              </Button>
              <Button onClick={handleAssignInstructor}>
                Նշանակել
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;
