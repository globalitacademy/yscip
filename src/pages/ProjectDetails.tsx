import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectThemes } from '@/data/projectThemes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  ArrowRight, 
  KanbanSquare,
  ListChecks,
  CalendarRange
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Timeline from '@/components/Timeline';
import TaskManager from '@/components/TaskManager';
import ProjectApproval from '@/components/ProjectApproval';
import { ProjectProvider, useProject } from '@/contexts/ProjectContext';
import { v4 as uuidv4 } from 'uuid';
import { getProjectImage } from '@/lib/getProjectImage';
import { Task } from '@/types/database.types';

const ProjectDetailsContent: React.FC = () => {
  const { project, timeline, tasks, projectStatus, addTimelineEvent, completeTimelineEvent, addTask, updateTaskStatus, submitProject, approveProject, rejectProject, reserveProject, isReserved } = useProject();
  const navigate = useNavigate();
  
  const similarProjects = projectThemes
    .filter(p => p.id !== project?.id && 
      (p.category === project?.category || 
       p.techStack.some(tech => project?.techStack.includes(tech))))
    .slice(0, 3);
  
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Պրոեկտը չի գտնվել</h1>
        <Button onClick={() => navigate('/')}>Վերադառնալ գլխավոր էջ</Button>
      </div>
    );
  }
  
  const handleReserveProject = () => {
    reserveProject();
    toast({
      title: "Պրոեկտն ամրագրված է",
      description: `Դուք հաջողությամբ ամրագրել եք "${project.title}" պրոեկտը։`,
    });
  };
  
  const complexityColor = {
    Սկսնակ: 'bg-green-500/10 text-green-600 border-green-200',
    Միջին: 'bg-amber-500/10 text-amber-600 border-amber-200',
    Առաջադեմ: 'bg-red-500/10 text-red-600 border-red-200',
  }[project.complexity];
  
  const imageUrl = getProjectImage(project);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container px-4 mx-auto py-8 max-w-6xl">
          <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Վերադառնալ բոլոր պրոեկտների ցանկին
          </Link>
          
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-2">
                <Badge variant="outline" className={cn("font-medium mb-3", complexityColor)}>
                  {project.complexity}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {project.duration && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      <span>{project.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    <span>Անհատական նախագիծ</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen size={16} />
                    <span>{project.category}</span>
                  </div>
                </div>
                
                {!isReserved ? (
                  <Button onClick={handleReserveProject} size="lg" className="mt-2">
                    Ամրագրել այս պրոեկտը
                  </Button>
                ) : (
                  <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                    <CheckCircle size={14} className="mr-1" /> Այս պրոեկտն ամրագրված է
                  </Badge>
                )}
              </div>
              
              <div className="rounded-lg overflow-hidden border border-border h-64 md:h-auto">
                <img 
                  src={imageUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </FadeIn>
          
          <Tabs defaultValue="overview" className="w-full mb-16">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BookOpen size={16} /> Նախագծի նկարագիր
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2" disabled={!isReserved}>
                <CalendarRange size={16} /> Ժամանակացույց
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2" disabled={!isReserved}>
                <ListChecks size={16} /> Առաջադրանքներ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <SlideUp className="space-y-8">
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Նախագծի նկարագրություն</h2>
                      <div className="prose prose-slate max-w-none">
                        <p>{project.detailedDescription || project.description}</p>
                      </div>
                    </section>
                    
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Իրականացման քայլեր</h2>
                      <div className="space-y-3 relative">
                        <div className="absolute left-4 top-0 bottom-0 w-px bg-border"></div>
                        {project.steps.map((step, index) => (
                          <div key={index} className="flex items-start gap-4 pl-4 relative">
                            <div className="absolute left-0 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary z-10">
                              {index + 1}
                            </div>
                            <div className="bg-accent/40 rounded-lg p-4 w-full">
                              <p>{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                    
                    {project.learningOutcomes && (
                      <section>
                        <h2 className="text-2xl font-bold mb-4">Ինչ կսովորեք</h2>
                        <ul className="space-y-2">
                          {project.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </SlideUp>
                </div>
                
                <div>
                  <SlideUp className="space-y-8">
                    {project.prerequisites && (
                      <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <BookOpen size={18} className="mr-2 text-primary" />
                          Նախապայմաններ
                        </h3>
                        <Separator className="mb-4" />
                        <ul className="space-y-2">
                          {project.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                              <span>{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {similarProjects.length > 0 && (
                      <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-3">Նմանատիպ պրոեկտներ</h3>
                        <Separator className="mb-4" />
                        <div className="space-y-4">
                          {similarProjects.map(relatedProject => (
                            <Link 
                              key={relatedProject.id} 
                              to={`/project/${relatedProject.id}`}
                              className="flex items-start gap-3 group"
                            >
                              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={getProjectImage(relatedProject)} 
                                  alt={relatedProject.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium group-hover:text-primary transition-colors">
                                  {relatedProject.title}
                                </h4>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {relatedProject.category}
                                </Badge>
                              </div>
                            </Link>
                          ))}
                          
                          <Link to="/" className="text-sm text-primary font-medium inline-flex items-center gap-1 hover:gap-2 transition-all mt-2">
                            Տեսնել բոլոր պրոեկտները <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    )}
                  </SlideUp>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="timeline" className="mt-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <SlideUp>
                    <Timeline 
                      events={timeline}
                      onAddEvent={addTimelineEvent}
                      onCompleteEvent={completeTimelineEvent}
                    />
                  </SlideUp>
                </div>
                
                <div>
                  <SlideUp>
                    <ProjectApproval 
                      projectStatus={projectStatus}
                      onSubmit={submitProject}
                      onApprove={approveProject}
                      onReject={rejectProject}
                    />
                  </SlideUp>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-6">
              <SlideUp>
                <TaskManager 
                  tasks={tasks as Task[]}
                  onAddTask={addTask}
                  onUpdateTaskStatus={updateTaskStatus}
                />
              </SlideUp>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id) : null;
  const project = projectThemes.find(p => p.id === projectId) || null;
  
  return (
    <ProjectProvider projectId={projectId} initialProject={project}>
      <ProjectDetailsContent />
    </ProjectProvider>
  );
};

export default ProjectDetails;

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
