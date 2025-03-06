
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { FadeIn } from '@/components/LocalTransitions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagement from '@/components/UserManagement';
import ProjectCreation from '@/components/ProjectCreation';
import { Users, FileText, BookOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getUsersByRole } from '@/data/userRoles';
import { projectThemes } from '@/data/projectThemes';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  
  const students = getUsersByRole('student');
  const allProjects = [...projectThemes, ...createdProjects];

  // Load any previously created projects from localStorage
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
    
    // Store in localStorage for demo purposes
    localStorage.setItem('createdProjects', JSON.stringify(newProjects));
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
      assignedBy: user?.id,
      assignedByName: user?.name,
      date: new Date().toISOString()
    };
    
    const newAssignments = [...assignments, newAssignment];
    setAssignments(newAssignments);
    localStorage.setItem('projectAssignments', JSON.stringify(newAssignments));
    
    // Create a reservation for the student
    const reservedProjects = localStorage.getItem('reservedProjects');
    let reservations = [];
    
    if (reservedProjects) {
      try {
        reservations = JSON.parse(reservedProjects);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
      }
    }
    
    // Avoid duplicate reservations
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
    
    // Reset selections
    setSelectedProject("");
    setSelectedStudent("");
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
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <FadeIn>
            <h1 className="text-3xl font-bold mb-2">Կառավարման վահանակ</h1>
            <p className="text-muted-foreground mb-8">
              Կառավարեք համակարգի օգտատերերին, դասընթացները և պրոեկտները։
            </p>
            
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto mb-8">
                <TabsTrigger value="users" className="flex items-center gap-2" disabled={user.role !== 'admin'}>
                  <Users size={16} /> Օգտատերերի կառավարում
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2">
                  <FileText size={16} /> Պրոեկտների ստեղծում
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <BookOpen size={16} /> Պրոեկտների նշանակում
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="projects">
                <ProjectCreation onProjectCreated={handleProjectCreated} />
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
                                  {student.name}
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
                            <TableHead>Նախագիծ</TableHead>
                            <TableHead>Ուսանող</TableHead>
                            <TableHead>Նշանակման ամսաթիվ</TableHead>
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
                                  {new Date(assignment.date).toLocaleDateString('hy-AM')}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
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
            </Tabs>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
