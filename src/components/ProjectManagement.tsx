
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { mockUsers, getUsersByRole, User, getStudentsForProject } from '@/data/userRoles';

interface ProjectStep {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  supervisorId: string;
  courseId?: string;
  organizationId?: string;
  steps: ProjectStep[];
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Հաճախորդների կառավարման համակարգի մշակում',
    description: 'Մշակել հաճախորդների կառավարման համակարգ, որը թույլ է տալիս գրանցել հաճախորդներին, կառավարել նրանց տվյալները և հետևել պատվերներին:',
    technologies: ['React', 'Node.js', 'MongoDB'],
    deadline: '2024-07-30',
    status: 'in_progress',
    supervisorId: 'supervisor1',
    courseId: '1',
    steps: [
      {
        id: '101',
        name: 'Պահանջների վերլուծություն և դիզայն',
        description: 'Վերլուծել պահանջները և ստեղծել համակարգի դիզայնը',
        deadline: '2024-04-30',
        status: 'completed'
      },
      {
        id: '102',
        name: 'Ինտերֆեյսի մշակում',
        description: 'Մշակել օգտատիրոջ ինտերֆեյսը React-ով',
        deadline: '2024-05-30',
        status: 'in_progress'
      },
      {
        id: '103',
        name: 'Բեքենդի մշակում',
        description: 'Մշակել API-ները Node.js-ով',
        deadline: '2024-06-30',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    title: 'Օնլայն խանութի մշակում',
    description: 'Մշակել օնլայն խանութ, որը թույլ է տալիս օգտատերերին դիտել ապրանքները, ավելացնել զամբյուղ և կատարել գնումներ:',
    technologies: ['Angular', 'Firebase', 'Stripe'],
    deadline: '2024-08-15',
    status: 'pending',
    supervisorId: 'project_manager1',
    organizationId: 'org1',
    steps: []
  }
];

const statuses = {
  pending: 'Սպասման մեջ',
  in_progress: 'Ընթացքում',
  completed: 'Ավարտված',
  cancelled: 'Չեղարկված'
};

const stepStatuses = {
  pending: 'Սպասման մեջ',
  in_progress: 'Ընթացքում',
  completed: 'Ավարտված'
};

const ProjectManagement: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);
  const [isAddStepDialogOpen, setIsAddStepDialogOpen] = useState(false);
  const [isViewProjectDialogOpen, setIsViewProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStep, setSelectedStep] = useState<ProjectStep | null>(null);
  const [isEditStepDialogOpen, setIsEditStepDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    deadline: '',
    status: 'pending',
    supervisorId: user?.id || '',
    steps: []
  });
  const [newStep, setNewStep] = useState<Partial<ProjectStep>>({
    name: '',
    description: '',
    deadline: '',
    status: 'pending'
  });
  const [technology, setTechnology] = useState('');

  const supervisors = getUsersByRole('supervisor').concat(getUsersByRole('project_manager'));

  const handleAddProject = () => {
    if (!newProject.title || !newProject.description || !newProject.deadline || !newProject.supervisorId) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const projectToAdd: Project = {
      id: uuidv4(),
      title: newProject.title || '',
      description: newProject.description || '',
      technologies: newProject.technologies || [],
      deadline: newProject.deadline || '',
      status: newProject.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
      supervisorId: newProject.supervisorId || user?.id || '',
      courseId: newProject.courseId,
      organizationId: newProject.organizationId,
      steps: []
    };

    setProjects([...projects, projectToAdd]);
    setNewProject({
      title: '',
      description: '',
      technologies: [],
      deadline: '',
      status: 'pending',
      supervisorId: user?.id || '',
      steps: []
    });
    setIsAddProjectDialogOpen(false);
    toast.success('Նախագիծը հաջողությամբ ավելացվել է');
  };

  const handleAddTechnology = () => {
    if (!technology) return;
    setNewProject({
      ...newProject,
      technologies: [...(newProject.technologies || []), technology]
    });
    setTechnology('');
  };

  const handleRemoveTechnology = (index: number) => {
    const updatedTechnologies = [...(newProject.technologies || [])];
    updatedTechnologies.splice(index, 1);
    setNewProject({
      ...newProject,
      technologies: updatedTechnologies
    });
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsViewProjectDialogOpen(true);
  };

  const handleAddStep = () => {
    if (!selectedProject) return;
    if (!newStep.name || !newStep.description || !newStep.deadline) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const stepToAdd: ProjectStep = {
      id: uuidv4(),
      name: newStep.name,
      description: newStep.description,
      deadline: newStep.deadline,
      status: newStep.status as 'pending' | 'in_progress' | 'completed'
    };

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          steps: [...project.steps, stepToAdd]
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setSelectedProject({
      ...selectedProject,
      steps: [...selectedProject.steps, stepToAdd]
    });
    setNewStep({
      name: '',
      description: '',
      deadline: '',
      status: 'pending'
    });
    setIsAddStepDialogOpen(false);
    toast.success('Քայլը հաջողությամբ ավելացվել է');
  };

  const handleEditStep = (step: ProjectStep) => {
    setSelectedStep(step);
    setNewStep({
      name: step.name,
      description: step.description,
      deadline: step.deadline,
      status: step.status
    });
    setIsEditStepDialogOpen(true);
  };

  const handleUpdateStep = () => {
    if (!selectedProject || !selectedStep) return;
    if (!newStep.name || !newStep.description || !newStep.deadline) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const updatedStep: ProjectStep = {
      id: selectedStep.id,
      name: newStep.name,
      description: newStep.description,
      deadline: newStep.deadline,
      status: newStep.status as 'pending' | 'in_progress' | 'completed'
    };

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          steps: project.steps.map(step => 
            step.id === selectedStep.id ? updatedStep : step
          )
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setSelectedProject({
      ...selectedProject,
      steps: selectedProject.steps.map(step => 
        step.id === selectedStep.id ? updatedStep : step
      )
    });
    setSelectedStep(null);
    setNewStep({
      name: '',
      description: '',
      deadline: '',
      status: 'pending'
    });
    setIsEditStepDialogOpen(false);
    toast.success('Քայլը հաջողությամբ թարմացվել է');
  };

  const handleDeleteStep = (stepId: string) => {
    if (!selectedProject) return;

    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          steps: project.steps.filter(step => step.id !== stepId)
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    setSelectedProject({
      ...selectedProject,
      steps: selectedProject.steps.filter(step => step.id !== stepId)
    });
    toast.success('Քայլը հաջողությամբ հեռացվել է');
  };

  const handleUpdateProjectStatus = (projectId: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          status
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        status
      });
    }
    toast.success('Նախագծի կարգավիճակը հաջողությամբ թարմացվել է');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
    toast.success('Նախագիծը հաջողությամբ հեռացվել է');
  };

  const getSupervisorName = (supervisorId: string) => {
    const supervisor = mockUsers.find(user => user.id === supervisorId);
    return supervisor ? supervisor.name : 'Անհայտ';
  };

  const getProjectStudents = (projectId: string) => {
    return getStudentsForProject(Number(projectId));
  };

  const filterProjectsByStatus = (status: string) => {
    if (status === 'all') return projects;
    return projects.filter(project => project.status === status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Նախագծերի կառավարում</h1>
        <Dialog open={isAddProjectDialogOpen} onOpenChange={setIsAddProjectDialogOpen}>
          <DialogTrigger asChild>
            <Button>Ավելացնել նոր նախագիծ</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Նոր նախագծի ավելացում</DialogTitle>
              <DialogDescription>
                Լրացրեք նախագծի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Անվանում
                </Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Նկարագրություն
                </Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="technologies" className="text-right">
                  Տեխնոլոգիաներ
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="technologies"
                      value={technology}
                      onChange={(e) => setTechnology(e.target.value)}
                      placeholder="Օր. React"
                    />
                    <Button type="button" onClick={handleAddTechnology} size="sm">
                      Ավելացնել
                    </Button>
                  </div>
                  {newProject.technologies && newProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newProject.technologies.map((tech, index) => (
                        <div key={index} className="flex items-center bg-secondary/30 px-2 py-1 rounded">
                          {tech}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveTechnology(index)}
                            className="h-5 w-5 text-destructive ml-1"
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deadline" className="text-right">
                  Վերջնաժամկետ
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newProject.deadline}
                  onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="supervisor" className="text-right">
                  Ղեկավար
                </Label>
                <Select 
                  value={newProject.supervisorId} 
                  onValueChange={(value) => setNewProject({ ...newProject, supervisorId: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Ընտրեք ղեկավարին" />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisors.map((supervisor) => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddProject}>
                Ավելացնել
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Բոլորը</TabsTrigger>
          <TabsTrigger value="pending">Սպասման մեջ</TabsTrigger>
          <TabsTrigger value="in_progress">Ընթացքում</TabsTrigger>
          <TabsTrigger value="completed">Ավարտված</TabsTrigger>
          <TabsTrigger value="cancelled">Չեղարկված</TabsTrigger>
        </TabsList>
        
        {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map(status => (
          <TabsContent key={status} value={status} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterProjectsByStatus(status === 'all' ? 'all' : status).map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-xl">{project.title}</CardTitle>
                        <CardDescription>
                          Ղեկավար: {getSupervisorName(project.supervisorId)}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive" 
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="text-xs bg-secondary px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">Վերջնաժամկետ:</span>
                        <span>{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">Կարգավիճակ:</span>
                        <span>{statuses[project.status]}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">Քայլեր:</span>
                        <span>{project.steps.length}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="pt-2 w-full">
                      <Button size="sm" className="w-full" onClick={() => handleViewProject(project)}>
                        Դիտել մանրամասները
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* View Project Dialog */}
      {selectedProject && (
        <Dialog open={isViewProjectDialogOpen} onOpenChange={setIsViewProjectDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.title}</DialogTitle>
              <DialogDescription>
                Ղեկավար: {getSupervisorName(selectedProject.supervisorId)} | 
                Կարգավիճակ: {statuses[selectedProject.status]} | 
                Վերջնաժամկետ: {new Date(selectedProject.deadline).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Նկարագրություն</h3>
                <p className="text-sm">{selectedProject.description}</p>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Տեխնոլոգիաներ</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, index) => (
                    <span key={index} className="text-sm bg-secondary px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Կարգավիճակի փոփոխություն</h3>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedProject.status === 'pending' ? 'default' : 'outline'} 
                    onClick={() => handleUpdateProjectStatus(selectedProject.id, 'pending')}
                  >
                    Սպասման մեջ
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedProject.status === 'in_progress' ? 'default' : 'outline'} 
                    onClick={() => handleUpdateProjectStatus(selectedProject.id, 'in_progress')}
                  >
                    Ընթացքում
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedProject.status === 'completed' ? 'default' : 'outline'} 
                    onClick={() => handleUpdateProjectStatus(selectedProject.id, 'completed')}
                  >
                    Ավարտված
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedProject.status === 'cancelled' ? 'default' : 'outline'} 
                    onClick={() => handleUpdateProjectStatus(selectedProject.id, 'cancelled')}
                  >
                    Չեղարկված
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Քայլեր</h3>
                  <Dialog open={isAddStepDialogOpen} onOpenChange={setIsAddStepDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">Ավելացնել քայլ</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Նոր քայլի ավելացում</DialogTitle>
                        <DialogDescription>
                          Լրացրեք քայլի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="stepName" className="text-right">
                            Անվանում
                          </Label>
                          <Input
                            id="stepName"
                            value={newStep.name}
                            onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="stepDescription" className="text-right pt-2">
                            Նկարագրություն
                          </Label>
                          <Textarea
                            id="stepDescription"
                            value={newStep.description}
                            onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                            className="col-span-3"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="stepDeadline" className="text-right">
                            Վերջնաժամկետ
                          </Label>
                          <Input
                            id="stepDeadline"
                            type="date"
                            value={newStep.deadline}
                            onChange={(e) => setNewStep({ ...newStep, deadline: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="stepStatus" className="text-right">
                            Կարգավիճակ
                          </Label>
                          <Select
                            value={newStep.status}
                            onValueChange={(value: 'pending' | 'in_progress' | 'completed') => setNewStep({ ...newStep, status: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Ընտրեք կարգավիճակը" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Սպասման մեջ</SelectItem>
                              <SelectItem value="in_progress">Ընթացքում</SelectItem>
                              <SelectItem value="completed">Ավարտված</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddStep}>
                          Ավելացնել
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {selectedProject.steps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Այս նախագծի համար քայլեր չկան</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProject.steps.map((step) => (
                      <div 
                        key={step.id} 
                        className={`p-3 rounded-lg border ${
                          step.status === 'completed' 
                            ? 'bg-green-50 border-green-200' 
                            : step.status === 'in_progress' 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-medium">{step.name}</h4>
                            <p className="text-xs text-muted-foreground">Վերջնաժամկետ: {new Date(step.deadline).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => handleEditStep(step)}
                            >
                              ✏️
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive" 
                              onClick={() => handleDeleteStep(step.id)}
                            >
                              ✕
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm my-1">{step.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs px-2 py-1 rounded bg-secondary">
                            {stepStatuses[step.status]}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant={step.status === 'pending' ? 'default' : 'outline'} 
                              className="text-xs h-7"
                              onClick={() => {
                                setSelectedStep(step);
                                setNewStep({...step, status: 'pending'});
                                handleUpdateStep();
                              }}
                            >
                              Սպասման մեջ
                            </Button>
                            <Button 
                              size="sm" 
                              variant={step.status === 'in_progress' ? 'default' : 'outline'} 
                              className="text-xs h-7"
                              onClick={() => {
                                setSelectedStep(step);
                                setNewStep({...step, status: 'in_progress'});
                                handleUpdateStep();
                              }}
                            >
                              Ընթացքում
                            </Button>
                            <Button 
                              size="sm" 
                              variant={step.status === 'completed' ? 'default' : 'outline'} 
                              className="text-xs h-7"
                              onClick={() => {
                                setSelectedStep(step);
                                setNewStep({...step, status: 'completed'});
                                handleUpdateStep();
                              }}
                            >
                              Ավարտված
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Նշանակված ուսանողներ</h3>
                {getProjectStudents(selectedProject.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Այս նախագծին ուսանողներ դեռ նշանակված չեն</p>
                ) : (
                  <div className="space-y-2">
                    {getProjectStudents(selectedProject.id).map((student) => (
                      <div key={student.id} className="flex items-center gap-2 p-2 bg-secondary/20 rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Step Dialog */}
      {selectedStep && (
        <Dialog open={isEditStepDialogOpen} onOpenChange={setIsEditStepDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Քայլի խմբագրում</DialogTitle>
              <DialogDescription>
                Խմբագրեք քայլի տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Թարմացնել" կոճակը:
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStepName" className="text-right">
                  Անվանում
                </Label>
                <Input
                  id="editStepName"
                  value={newStep.name}
                  onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="editStepDescription" className="text-right pt-2">
                  Նկարագրություն
                </Label>
                <Textarea
                  id="editStepDescription"
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStepDeadline" className="text-right">
                  Վերջնաժամկետ
                </Label>
                <Input
                  id="editStepDeadline"
                  type="date"
                  value={newStep.deadline}
                  onChange={(e) => setNewStep({ ...newStep, deadline: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStepStatus" className="text-right">
                  Կարգավիճակ
                </Label>
                <Select
                  value={newStep.status}
                  onValueChange={(value: 'pending' | 'in_progress' | 'completed') => setNewStep({ ...newStep, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Ընտրեք կարգավիճակը" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Սպասման մեջ</SelectItem>
                    <SelectItem value="in_progress">Ընթացքում</SelectItem>
                    <SelectItem value="completed">Ավարտված</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleUpdateStep}>
                Թարմացնել
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectManagement;
