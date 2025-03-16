
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FadeIn } from '@/components/LocalTransitions';
import { projectThemes, ProjectTheme } from '@/data/projectThemes';
import ProjectCard from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import {
  Tag,
  Users,
  Layers,
  GraduationCap,
  BookOpen,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const AdminProjectGrid: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [displayLimit, setDisplayLimit] = useState(12);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const permissions = useProjectPermissions(user?.role);
  
  // Get categories from project themes
  const categories = ["all", ...new Set(projectThemes.map(project => project.category))];

  // Filter projects by category and status
  const getFilteredProjects = () => {
    let filtered = [...projectThemes];
    
    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter(project => project.category === activeCategory);
    }
    
    // Additional status filtering
    if (filterStatus === "assigned") {
      filtered = filtered.filter(project => project.status === "assigned");
    } else if (filterStatus === "pending") {
      filtered = filtered.filter(project => project.status === "pending");
    } else if (filterStatus === "approved") {
      filtered = filtered.filter(project => project.status === "approved");
    }
    
    return filtered;
  };
  
  const filteredProjects = getFilteredProjects();
  const themes = filteredProjects.slice(0, displayLimit);
  
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, filteredProjects.length));
  };
  
  const hasMore = displayLimit < filteredProjects.length;
  
  const handleAssignProject = () => {
    if (selectedProject) {
      // Placeholder for actual assignment functionality
      toast({
        title: "Նախագիծը նշանակված է",
        description: `"${selectedProject.title}" նախագիծը հաջողությամբ նշանակվել է։`
      });
      setIsAssignDialogOpen(false);
      setSelectedProject(null);
    }
  };
  
  const handleApproveProject = () => {
    if (selectedProject) {
      // Placeholder for actual approval functionality
      toast({
        title: "Նախագիծը հաստատված է",
        description: `"${selectedProject.title}" նախագիծը հաջողությամբ հաստատվել է։`
      });
      setIsApproveDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const handleEditProject = (project: ProjectTheme) => {
    // Placeholder for edit action
    console.log("Edit project:", project);
  };

  const handleImageChange = (project: ProjectTheme) => {
    // Placeholder for image change action
    console.log("Change image for project:", project);
  };

  const handleDeleteProject = (project: ProjectTheme) => {
    // Placeholder for delete action
    console.log("Delete project:", project);
  };
  
  return (
    <div className="mt-8 text-left">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ադմինիստրատիվ նախագծերի կառավարում</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Select
            value={activeCategory}
            onValueChange={(value) => {
              setActiveCategory(value);
              setDisplayLimit(12);
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px] bg-background">
              <SelectValue placeholder="Ընտրեք կատեգորիան" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all" className="flex items-center gap-2">
                <Layers size={14} className="opacity-80" />
                <span>Բոլորը</span>
              </SelectItem>
              {categories.filter(cat => cat !== "all").map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setDisplayLimit(12);
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px] bg-background">
              <SelectValue placeholder="Կարգավիճակ" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Բոլոր կարգավիճակները</SelectItem>
              <SelectItem value="pending">Սպասող</SelectItem>
              <SelectItem value="assigned">Նշանակված</SelectItem>
              <SelectItem value="approved">Հաստատված</SelectItem>
            </SelectContent>
          </Select>
        
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-muted flex items-center gap-1">
              <Tag size={14} />
              {filteredProjects.length} նախագիծ
            </Badge>
            
            {user && (
              <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1">
                {user.role === 'student' ? (
                  <>
                    <GraduationCap size={14} />
                    Ուսանող
                  </>
                ) : user.role === 'instructor' ? (
                  <>
                    <BookOpen size={14} />
                    Դասախոս
                  </>
                ) : user.role === 'supervisor' ? (
                  <>
                    <Users size={14} />
                    Ղեկավար
                  </>
                ) : (
                  'Ադմինիստրատոր'
                )}
              </Badge>
            )}
          </div>
        </div>

        <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {themes.map((project) => (
            <div key={project.id} className="relative">
              <ProjectCard
                project={project}
                onEdit={handleEditProject}
                onImageChange={handleImageChange}
                onDelete={handleDeleteProject}
              />
              
              {/* Action buttons overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {permissions.canAssignProjects && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setIsAssignDialogOpen(true);
                    }}
                  >
                    Նշանակել
                  </Button>
                )}
                
                {permissions.canApproveProject && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setIsApproveDialogOpen(true);
                    }}
                  >
                    Հաստատել
                  </Button>
                )}
              </div>
            </div>
          ))}
        </FadeIn>
        
        {themes.length === 0 && (
          <div className="text-center p-10 bg-muted rounded-lg">
            <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-4 mt-8">
          {hasMore && (
            <Button onClick={loadMore} variant="outline" size="lg">
              Տեսնել ավելին
            </Button>
          )}
        </div>
      </div>
      
      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Նախագծի նշանակում</DialogTitle>
            <DialogDescription>
              {selectedProject && `Նշանակել "${selectedProject.title}" նախագիծը ուսանողին կամ խմբին։`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ընտրեք ուսանողին կամ խումբը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student1">Գագիկ Պետրոսյան</SelectItem>
                <SelectItem value="student2">Արփինե Հովհաննիսյան</SelectItem>
                <SelectItem value="group1">Խումբ 913</SelectItem>
                <SelectItem value="group2">Խումբ 825</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Չեղարկել</Button>
            <Button onClick={handleAssignProject}>Նշանակել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Նախագծի հաստատում</DialogTitle>
            <DialogDescription>
              {selectedProject && `Հաստատել "${selectedProject.title}" նախագիծը։`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-4 py-4 justify-end">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsApproveDialogOpen(false)}
            >
              <XCircle size={16} />
              Չեղարկել
            </Button>
            
            <Button 
              className="flex items-center gap-2"
              onClick={handleApproveProject}
            >
              <CheckCircle size={16} />
              Հաստատել
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjectGrid;
