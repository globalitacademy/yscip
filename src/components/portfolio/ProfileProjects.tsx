
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Pencil, Trash, Filter, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  status: string;
  role: string;
  grade: string;
  imageUrl: string;
  link: string;
}

// Sample projects data
const initialProjects = [
  {
    id: 1,
    title: 'Դինամիկ վեբ կայք Node.js-ով',
    description: 'MongoDB տվյալների բազայով կայք',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
    status: 'completed',
    role: 'Backend Developer',
    grade: '5.0',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project1',
    link: 'https://github.com/example/nodejs-project'
  },
  {
    id: 2,
    title: 'React հավելված',
    description: 'Single Page Application Redux-ով և TypeScript-ով',
    technologies: ['React', 'Redux', 'TypeScript', 'CSS'],
    status: 'completed',
    role: 'Frontend Developer',
    grade: '4.8',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project2',
    link: 'https://github.com/example/react-app'
  },
  {
    id: 3,
    title: 'E-commerce կայք',
    description: 'Ամբողջական ֆունկցիոնալությամբ էլեկտրոնային առևտրի կայք',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux'],
    status: 'in-progress',
    role: 'Full Stack Developer',
    grade: 'N/A',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project3',
    link: 'https://github.com/example/ecommerce'
  },
  {
    id: 4,
    title: 'Մոբայլ հավելված',
    description: 'React Native-ով մշակված մոբայլ հավելված',
    technologies: ['React Native', 'JavaScript', 'Firebase'],
    status: 'in-progress',
    role: 'Mobile Developer',
    grade: 'N/A',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project4',
    link: 'https://github.com/example/mobile-app'
  },
  {
    id: 5,
    title: 'Տվյալների վերլուծություն',
    description: 'Python-ով իրականացված տվյալների վերլուծության նախագիծ',
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    status: 'completed',
    role: 'Data Analyst',
    grade: '4.7',
    imageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=project5',
    link: 'https://github.com/example/data-analysis'
  }
];

// Status label mapper
const statusLabels: Record<string, { label: string, className: string }> = {
  'completed': { label: 'Ավարտված', className: 'bg-green-100 text-green-800' },
  'in-progress': { label: 'Ընթացքում', className: 'bg-blue-100 text-blue-800' },
  'pending': { label: 'Սպասման մեջ', className: 'bg-yellow-100 text-yellow-800' }
};

// Sample roles
const projectRoles = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'UI/UX Designer',
  'Data Analyst',
  'DevOps Engineer',
  'Project Manager',
  'QA Tester'
];

const ProfileProjects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);
  
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newTech, setNewTech] = useState<string>('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [techFilter, setTechFilter] = useState<string | null>(null);
  
  // Create empty project template
  const emptyProject: Project = {
    id: Date.now(),
    title: '',
    description: '',
    technologies: [],
    status: 'in-progress',
    role: '',
    grade: 'N/A',
    imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=project${Date.now()}`,
    link: ''
  };
  
  const handleAddProject = () => {
    setCurrentProject(emptyProject);
    setIsAddProjectOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setCurrentProject({...project});
    setIsEditProjectOpen(true);
  };
  
  const handleDeleteProjectConfirm = (project: Project) => {
    setCurrentProject(project);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleDeleteProject = () => {
    if (!currentProject) return;
    
    const updatedProjects = projects.filter(p => p.id !== currentProject.id);
    setProjects(updatedProjects);
    applyFilters(updatedProjects);
    setIsDeleteConfirmOpen(false);
    setCurrentProject(null);
    
    toast.success("Նախագիծը հաջողությամբ հեռացվեց");
  };
  
  const handleAddTechnology = () => {
    if (!currentProject || !newTech.trim()) return;
    
    if (currentProject.technologies.includes(newTech.trim())) {
      toast.error("Այս տեխնոլոգիան արդեն ավելացված է");
      return;
    }
    
    setCurrentProject({
      ...currentProject,
      technologies: [...currentProject.technologies, newTech.trim()]
    });
    
    setNewTech('');
  };
  
  const handleRemoveTechnology = (tech: string) => {
    if (!currentProject) return;
    
    setCurrentProject({
      ...currentProject,
      technologies: currentProject.technologies.filter(t => t !== tech)
    });
  };
  
  const handleSaveProject = () => {
    if (!currentProject) return;
    
    // Validate project data
    if (!currentProject.title.trim()) {
      toast.error("Խնդրում ենք լրացնել նախագծի անվանումը");
      return;
    }
    
    if (!currentProject.role.trim()) {
      toast.error("Խնդրում ենք լրացնել Ձեր դերը նախագծում");
      return;
    }
    
    if (currentProject.technologies.length === 0) {
      toast.error("Խնդրում ենք ավելացնել առնվազն մեկ տեխնոլոգիա");
      return;
    }
    
    // Check if this is a new project or an edit
    if (projects.some(p => p.id === currentProject.id)) {
      // Edit existing project
      const updatedProjects = projects.map(p => 
        p.id === currentProject.id ? currentProject : p
      );
      setProjects(updatedProjects);
      applyFilters(updatedProjects);
      setIsEditProjectOpen(false);
      toast.success("Նախագիծը հաջողությամբ թարմացվել է");
    } else {
      // Add new project
      const updatedProjects = [...projects, currentProject];
      setProjects(updatedProjects);
      applyFilters(updatedProjects);
      setIsAddProjectOpen(false);
      toast.success("Նախագիծը հաջողությամբ ավելացվել է");
    }
    
    setCurrentProject(null);
  };
  
  const applyFilters = (projectsToFilter = projects) => {
    let filtered = [...projectsToFilter];
    
    if (statusFilter) {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    if (roleFilter) {
      filtered = filtered.filter(p => p.role === roleFilter);
    }
    
    if (techFilter) {
      filtered = filtered.filter(p => p.technologies.includes(techFilter));
    }
    
    setFilteredProjects(filtered);
  };
  
  const handleClearFilters = () => {
    setStatusFilter(null);
    setRoleFilter(null);
    setTechFilter(null);
    setFilteredProjects(projects);
    setIsFilterDialogOpen(false);
  };
  
  const handleApplyFilters = () => {
    applyFilters();
    setIsFilterDialogOpen(false);
  };
  
  // Get all unique technologies from all projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap(p => p.technologies))
  ).sort();
  
  // Get all unique roles from all projects
  const allRoles = Array.from(
    new Set(projects.map(p => p.role))
  ).sort();
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Նախագծեր</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsFilterDialogOpen(true)}
            >
              <Filter size={16} />
              Ֆիլտրել
            </Button>
            <Button 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleAddProject}
            >
              <Plus size={16} />
              Նոր նախագիծ
            </Button>
          </div>
        </div>
        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(project => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-slate-100 flex items-center justify-center">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <span className={`text-xs px-2 py-1 rounded ${statusLabels[project.status]?.className}`}>
                      {statusLabels[project.status]?.label}
                    </span>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <p className="text-sm mb-1"><span className="font-medium">Դեր:</span> {project.role}</p>
                    {project.grade !== 'N/A' && (
                      <p className="text-sm mb-1"><span className="font-medium">Գնահատական:</span> {project.grade}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map(tech => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between">
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1 text-slate-600"
                        onClick={() => handleEditProject(project)}
                      >
                        <Pencil size={14} />
                        Խմբագրել
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteProjectConfirm(project)}
                      >
                        <Trash size={14} />
                        Ջնջել
                      </Button>
                    </div>
                    {project.link && (
                      <Button variant="outline" size="sm" className="flex items-center gap-1" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} />
                          Դիտել
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Նախագծեր չեն գտնվել</p>
            {(statusFilter || roleFilter || techFilter) ? (
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={handleClearFilters}
              >
                Մաքրել ֆիլտրերը
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={handleAddProject}
              >
                Ավելացնել առաջին նախագիծը
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Project Dialog */}
      {currentProject && (
        <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Նոր նախագծի ավելացում</DialogTitle>
              <DialogDescription>
                Ավելացրեք նոր նախագիծ Ձեր պորտֆոլիոյին
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Նախագծի անվանում</label>
                  <Input 
                    value={currentProject.title} 
                    onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})} 
                    placeholder="Օր.՝ Էլեկտրոնային առևտրի կայք"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Կարգավիճակ</label>
                  <Select
                    value={currentProject.status}
                    onValueChange={(value) => setCurrentProject({...currentProject, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրեք կարգավիճակը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Ավարտված</SelectItem>
                      <SelectItem value="in-progress">Ընթացքում</SelectItem>
                      <SelectItem value="pending">Սպասման մեջ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Նկարագրություն</label>
                <Textarea 
                  value={currentProject.description} 
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})} 
                  placeholder="Կարճ նկարագրություն նախագծի մասին"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Դեր նախագծում</label>
                  <Select
                    value={currentProject.role}
                    onValueChange={(value) => setCurrentProject({...currentProject, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրեք Ձեր դերը" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Գնահատական (եթե կա)</label>
                  <Input 
                    value={currentProject.grade !== 'N/A' ? currentProject.grade : ''} 
                    onChange={(e) => setCurrentProject({...currentProject, grade: e.target.value || 'N/A'})} 
                    placeholder="Օր.՝ 4.5"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Տեխնոլոգիաներ</label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-md">
                  {currentProject.technologies.map(tech => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button 
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {currentProject.technologies.length === 0 && (
                    <span className="text-sm text-gray-500">Տեխնոլոգիաներ չկան</span>
                  )}
                </div>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={newTech} 
                    onChange={(e) => setNewTech(e.target.value)} 
                    placeholder="Օր.՝ React, Node.js, MongoDB"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTechnology}>Ավելացնել</Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Հղում դեպի նախագիծը (GitHub, GitLab և այլն)</label>
                <Input 
                  value={currentProject.link} 
                  onChange={(e) => setCurrentProject({...currentProject, link: e.target.value})} 
                  placeholder="https://github.com/example/project"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProjectOpen(false)}>Չեղարկել</Button>
              <Button onClick={handleSaveProject}>Ավելացնել</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Project Dialog */}
      {currentProject && (
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Նախագծի խմբագրում</DialogTitle>
              <DialogDescription>
                Թարմացրեք նախագծի տվյալները
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Նախագծի անվանում</label>
                  <Input 
                    value={currentProject.title} 
                    onChange={(e) => setCurrentProject({...currentProject, title: e.target.value})} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Կարգավիճակ</label>
                  <Select
                    value={currentProject.status}
                    onValueChange={(value) => setCurrentProject({...currentProject, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրեք կարգավիճակը" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Ավարտված</SelectItem>
                      <SelectItem value="in-progress">Ընթացքում</SelectItem>
                      <SelectItem value="pending">Սպասման մեջ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Նկարագրություն</label>
                <Textarea 
                  value={currentProject.description} 
                  onChange={(e) => setCurrentProject({...currentProject, description: e.target.value})} 
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Դեր նախագծում</label>
                  <Select
                    value={currentProject.role}
                    onValueChange={(value) => setCurrentProject({...currentProject, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ընտրեք Ձեր դերը" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Գնահատական (եթե կա)</label>
                  <Input 
                    value={currentProject.grade !== 'N/A' ? currentProject.grade : ''} 
                    onChange={(e) => setCurrentProject({...currentProject, grade: e.target.value || 'N/A'})} 
                    placeholder="Օր.՝ 4.5"
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Տեխնոլոգիաներ</label>
                <div className="flex flex-wrap gap-1 p-2 border rounded-md min-h-10">
                  {currentProject.technologies.map(tech => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button 
                        onClick={() => handleRemoveTechnology(tech)}
                        className="ml-1 text-xs hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={newTech} 
                    onChange={(e) => setNewTech(e.target.value)} 
                    placeholder="Օր.՝ React, Node.js, MongoDB"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTechnology();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTechnology}>Ավելացնել</Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">Հղում դեպի նախագիծը (GitHub, GitLab և այլն)</label>
                <Input 
                  value={currentProject.link} 
                  onChange={(e) => setCurrentProject({...currentProject, link: e.target.value})} 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditProjectOpen(false)}>Չեղարկել</Button>
              <Button onClick={handleSaveProject}>Պահպանել</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Նախագծերի ֆիլտրացիա</DialogTitle>
            <DialogDescription>
              Ֆիլտրեք նախագծերը ըստ կարգավիճակի, դերի կամ տեխնոլոգիայի
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Կարգավիճակ</label>
              <Select
                value={statusFilter || ''}
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք կարգավիճակը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Բոլորը</SelectItem>
                  <SelectItem value="completed">Ավարտված</SelectItem>
                  <SelectItem value="in-progress">Ընթացքում</SelectItem>
                  <SelectItem value="pending">Սպասման մեջ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Դեր</label>
              <Select
                value={roleFilter || ''}
                onValueChange={(value) => setRoleFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք դերը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Բոլորը</SelectItem>
                  {allRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Տեխնոլոգիա</label>
              <Select
                value={techFilter || ''}
                onValueChange={(value) => setTechFilter(value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ընտրեք տեխնոլոգիա" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Բոլորը</SelectItem>
                  {allTechnologies.map(tech => (
                    <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters}>Մաքրել</Button>
            <Button onClick={handleApplyFilters}>Կիրառել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Հաստատեք ջնջումը</DialogTitle>
            <DialogDescription>
              Դուք իսկապե՞ս ցանկանում եք ջնջել "{currentProject?.title}" նախագիծը: 
              Այս գործողությունը չի կարող հետ շրջվել:
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Չեղարկել</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Ջնջել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileProjects;
