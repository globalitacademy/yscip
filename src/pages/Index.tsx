
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ThemeGrid from '@/components/ThemeGrid';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { projectThemes } from '@/data/projectThemes';
import { Card } from '@/components/ui/card';
import { Check, BookOpen, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  // Load projects and assignments from localStorage
  useEffect(() => {
    // Get created projects
    const storedProjects = localStorage.getItem('createdProjects');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setCreatedProjects(parsedProjects);
        console.log('Loaded created projects:', parsedProjects);
      } catch (e) {
        console.error('Error parsing stored projects:', e);
      }
    }
    
    // Get reserved projects
    const storedReservations = localStorage.getItem('reservedProjects');
    if (storedReservations) {
      try {
        const parsedReservations = JSON.parse(storedReservations);
        setReservedProjects(parsedReservations);
        console.log('Loaded reserved projects:', parsedReservations);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
      }
    }
    
    // Get assignments
    const storedAssignments = localStorage.getItem('projectAssignments');
    if (storedAssignments) {
      try {
        const parsedAssignments = JSON.parse(storedAssignments);
        setAssignments(parsedAssignments);
        console.log('Loaded assignments:', parsedAssignments);
      } catch (e) {
        console.error('Error parsing assignments:', e);
      }
    }
  }, []);

  // Display user role toast when logged in
  useEffect(() => {
    if (user) {
      const roleMap: Record<string, string> = {
        'student': 'Ուսանող',
        'instructor': 'Դասախոս',
        'admin': 'Ադմինիստրատոր',
        'supervisor': 'Ղեկավար'
      };
      
      const roleName = roleMap[user.role] || user.role;
      
      toast.success(`Մուտք եք գործել որպես ${roleName}`, {
        duration: 3000,
        position: 'top-right'
      });
    }
  }, [user]);

  // Filter user's reserved projects
  const userReservedProjects = user 
    ? reservedProjects.filter(rp => rp.userId === user.id)
    : [];

  // Find actual project details for reserved projects
  const userReservedProjectDetails = userReservedProjects.map(rp => {
    const project = [...projectThemes, ...createdProjects].find(p => Number(p.id) === Number(rp.projectId));
    return { ...rp, project };
  }).filter(rp => rp.project); // Filter out any without matching project details

  // Find user's assigned projects
  const userAssignedProjects = user && user.role === 'student'
    ? assignments.filter(a => a.studentId === user.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div id="themes-section" className="container mx-auto px-4 pb-16">
          {user && userReservedProjectDetails.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-left">Իմ Ամրագրված Նախագծերը</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userReservedProjectDetails.map((rp) => (
                  <Card key={rp.projectId} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium">{rp.project?.title || rp.projectTitle}</h3>
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        <Check size={14} className="mr-1" /> Ամրագրված
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {rp.project?.techStack?.map((tech: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>Ամրագրվել է {new Date(rp.timestamp).toLocaleDateString('hy-AM')}</span>
                      </div>
                      <Link to={`/project/${rp.projectId}`} className="text-primary text-sm font-medium">
                        Դիտել մանրամասներ
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <Tabs defaultValue="all-projects" className="mb-6">
            <TabsList className="h-auto mb-6">
              <TabsTrigger value="all-projects">Բոլոր Նախագծերը</TabsTrigger>
              {user?.role !== 'student' && (
                <TabsTrigger value="created-projects">Ստեղծված Նախագծեր</TabsTrigger>
              )}
              {user?.role === 'supervisor' && (
                <TabsTrigger value="assigned-projects">Հանձնարարված Նախագծեր</TabsTrigger>
              )}
              {user?.role === 'instructor' && (
                <TabsTrigger value="teaching-projects">Դասավանդվող Նախագծեր</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="all-projects">
              <ThemeGrid 
                createdProjects={createdProjects} 
              />
            </TabsContent>
            
            {user?.role !== 'student' && (
              <TabsContent value="created-projects">
                {createdProjects.filter(p => p.createdBy === user?.id).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {createdProjects
                      .filter(p => p.createdBy === user?.id)
                      .map((project) => (
                        <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{project.title}</h3>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              <BookOpen size={14} className="mr-1" /> Ստեղծված
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.techStack?.map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-end mt-4">
                            <Link to={`/project/${project.id}`} className="text-primary text-sm font-medium">
                              Դիտել մանրամասներ
                            </Link>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Դեռևս ստեղծված նախագծեր չկան</p>
                    <Link to="/admin" className="text-primary font-medium mt-2 inline-block">
                      Ստեղծել նոր նախագիծ
                    </Link>
                  </div>
                )}
              </TabsContent>
            )}
            
            {user?.role === 'supervisor' && (
              <TabsContent value="assigned-projects">
                {assignments.filter(a => a.assignedBy === user?.id).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assignments
                      .filter(a => a.assignedBy === user?.id)
                      .map((assignment) => {
                        const project = [...projectThemes, ...createdProjects]
                          .find(p => Number(p.id) === Number(assignment.projectId));
                        
                        return project ? (
                          <Card key={assignment.id} className="p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-medium">{project.title}</h3>
                              <Badge variant="outline" className="bg-orange-100 text-orange-700">
                                <Check size={14} className="mr-1" /> Նշանակված
                              </Badge>
                            </div>
                            
                            <div className="flex flex-col gap-2 mb-4">
                              <p className="text-sm text-muted-foreground">
                                <strong>Ուսանող:</strong> {assignment.studentName}
                              </p>
                              {assignment.studentCourse && assignment.studentGroup && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Կուրս/Խումբ:</strong> {assignment.studentCourse}-րդ կուրս, {assignment.studentGroup}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center justify-end mt-4">
                              <Link to={`/project/${assignment.projectId}`} className="text-primary text-sm font-medium">
                                Դիտել մանրամասներ
                              </Link>
                            </div>
                          </Card>
                        ) : null;
                      })
                      .filter(Boolean)
                    }
                  </div>
                ) : (
                  <div className="text-center p-10 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Դեռևս նշանակված նախագծեր չկան</p>
                    <Link to="/admin" className="text-primary font-medium mt-2 inline-block">
                      Նշանակել նախագիծ
                    </Link>
                  </div>
                )}
              </TabsContent>
            )}
            
            {user?.role === 'instructor' && (
              <TabsContent value="teaching-projects">
                {user.assignedProjects && user.assignedProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.assignedProjects.map(projectId => {
                      const project = [...projectThemes, ...createdProjects]
                        .find(p => Number(p.id) === projectId);
                      
                      return project ? (
                        <Card key={project.id} className="p-6 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-medium">{project.title}</h3>
                            <Badge variant="outline" className="bg-blue-100 text-blue-700">
                              <BookOpen size={14} className="mr-1" /> Դասավանդվող
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {project.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.techStack?.map((tech: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-end mt-4">
                            <Link to={`/project/${project.id}`} className="text-primary text-sm font-medium">
                              Դիտել մանրամասներ
                            </Link>
                          </div>
                        </Card>
                      ) : null;
                    })
                    .filter(Boolean)}
                  </div>
                ) : (
                  <div className="text-center p-10 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Դեռևս դասավանդվող նախագծեր չկան</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
