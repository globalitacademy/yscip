import React, { useState, useEffect } from 'react';
import { projectThemes, ProjectTheme } from '@/data/projectThemes';
import ProjectCard from './projects/ProjectCard';
import ProjectDeleteDialog from './projects/ProjectDeleteDialog';
import ProjectImageDialog from './projects/ProjectImageDialog';
import ProjectEditDialog from './projects/ProjectEditDialog';
import ProjectSearch from './projects/ProjectSearch';
import ProjectEmptyState from './projects/ProjectEmptyState';
import ProjectCategories from './projects/ProjectCategories';
import { deleteProject, changeProjectImage, saveEditedProject, filterProjects } from './projects/ProjectUtils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectCreation from './ProjectCreation';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProjectPermissions } from '@/hooks/useProjectPermissions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<ProjectTheme[]>(projectThemes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectTheme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editedProject, setEditedProject] = useState<Partial<ProjectTheme>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const permissions = useProjectPermissions(user?.role);
  
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*');
        
        if (error) {
          console.error('Error fetching projects:', error);
          toast('Սխալ նախագծերի ստացման ժամանակ');
        } else if (data) {
          const fetchedProjects: ProjectTheme[] = data.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(project.category)}`,
            category: project.category,
            techStack: project.tech_stack || [],
            createdBy: project.created_by,
            createdAt: project.created_at,
            duration: project.duration
          }));
          
          setProjects(fetchedProjects);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setProjects(projectThemes);
        toast('Տվյալների ստացման սխալ, օգտագործվում են լոկալ տվյալները');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  useEffect(() => {
    const projectsSubscription = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newProject = payload.new as any;
            setProjects(prevProjects => {
              const projectToAdd: ProjectTheme = {
                id: newProject.id,
                title: newProject.title,
                description: newProject.description,
                image: newProject.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(newProject.category)}`,
                category: newProject.category,
                techStack: newProject.tech_stack || [],
                createdBy: newProject.created_by,
                createdAt: newProject.created_at,
                duration: newProject.duration
              };
              
              if (!prevProjects.some(p => p.id === projectToAdd.id)) {
                toast(`Նոր նախագիծ: ${projectToAdd.title}`);
                return [projectToAdd, ...prevProjects];
              }
              return prevProjects;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedProject = payload.new as any;
            setProjects(prevProjects => 
              prevProjects.map(project => {
                if (project.id === updatedProject.id) {
                  return {
                    ...project,
                    title: updatedProject.title,
                    description: updatedProject.description,
                    image: updatedProject.image || project.image,
                    category: updatedProject.category,
                    techStack: updatedProject.tech_stack || [],
                    duration: updatedProject.duration
                  };
                }
                return project;
              })
            );
            toast(`Նախագիծը թարմացվել է: ${updatedProject.title}`);
          } else if (payload.eventType === 'DELETE') {
            const deletedProject = payload.old as any;
            setProjects(prevProjects => 
              prevProjects.filter(project => project.id !== deletedProject.id)
            );
            toast(`Նախագիծը ջնջվել է: ${deletedProject.title}`);
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(projectsSubscription);
    };
  }, []);
  
  const filteredProjects = React.useMemo(() => {
    let filtered = projects;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query) ||
        (project.category && project.category.toLowerCase().includes(query))
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    return filtered;
  }, [projects, searchQuery, selectedCategory]);

  const handleDelete = async () => {
    if (!selectedProject) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', selectedProject.id);
        
      if (error) {
        console.error('Error deleting project:', error);
        toast('Սխալ նախագծի ջնջման ժամանակ');
      } else {
        toast('Նախագիծը հաջողությամբ ջնջվել է');
      }
    } catch (err) {
      console.error('Unexpected error deleting project:', err);
      deleteProject(projects, selectedProject, setProjects);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը ջնջվել է լոկալ');
    }
    
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  const handleChangeImage = async () => {
    if (!selectedProject) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({ image: newImageUrl })
        .eq('id', selectedProject.id);
        
      if (error) {
        console.error('Error updating project image:', error);
        toast('Սխալ նախագծի նկարի թարմացման ժամանակ');
      } else {
        toast('Նախագծի նկարը հաջողությամբ թարմացվել է');
      }
    } catch (err) {
      console.error('Unexpected error updating project image:', err);
      changeProjectImage(projects, selectedProject, newImageUrl, setProjects);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը նկարը թարմացվել է լոկալ');
    }
    
    setIsImageDialogOpen(false);
    setNewImageUrl('');
    setSelectedProject(null);
  };

  const handleEditInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setEditedProject({
      title: project.title,
      description: project.description,
      category: project.category,
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedProject) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: editedProject.title,
          description: editedProject.description,
          category: editedProject.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedProject.id);
        
      if (error) {
        console.error('Error updating project:', error);
        toast('Սխալ նախագծի թարմացման ժամանակ');
      } else {
        toast('Նախագիծը հաջողությամբ թարմացվել է');
      }
    } catch (err) {
      console.error('Unexpected error updating project:', err);
      saveEditedProject(projects, selectedProject, editedProject, setProjects);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը թարմացվել է լոկալ');
    }
    
    setIsEditDialogOpen(false);
    setEditedProject({});
    setSelectedProject(null);
  };

  const handleImageChangeInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setNewImageUrl(project.image || '');
    setIsImageDialogOpen(true);
  };

  const handleDeleteInit = (project: ProjectTheme) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleProjectCreated = async (project: ProjectTheme) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: project.title,
          description: project.description,
          category: project.category,
          tech_stack: project.techStack,
          image: project.image,
          created_by: user?.id,
          duration: project.duration,
        })
        .select();
        
      if (error) {
        console.error('Error creating project:', error);
        toast('Սխալ նախագծի ստեղծման ժամանակ');
        
        setProjects((prevProjects) => [project, ...prevProjects]);
        toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը ստեղծվել է լոկալ');
      } else {
        toast('Նախագիծը հաջողությամբ ստեղծվել է');
      }
    } catch (err) {
      console.error('Unexpected error creating project:', err);
      setProjects((prevProjects) => [project, ...prevProjects]);
      toast('Տվյալների բազայի հետ կապի սխալ, նախագիծը ստեղծվել է լոկալ');
    }
    
    setIsCreateDialogOpen(false);
  };

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <ProjectSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        
        {permissions.canCreateProjects && (
          <Button 
            onClick={handleOpenCreateDialog} 
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Նոր նախագիծ
          </Button>
        )}
      </div>

      <ProjectCategories 
        projects={projects}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id}
              project={project}
              onEdit={handleEditInit}
              onImageChange={handleImageChangeInit}
              onDelete={handleDeleteInit}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredProjects.length === 0 && (
        <ProjectEmptyState onAddNewProject={handleOpenCreateDialog} />
      )}

      <ProjectDeleteDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedProject={selectedProject}
        onDelete={handleDelete}
      />

      <ProjectImageDialog 
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        selectedProject={selectedProject}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        onSave={handleChangeImage}
      />

      <ProjectEditDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedProject={selectedProject}
        editedProject={editedProject}
        setEditedProject={setEditedProject}
        onSave={handleSaveEdit}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-y-auto max-h-screen">
          <ProjectCreation onProjectCreated={handleProjectCreated} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;
