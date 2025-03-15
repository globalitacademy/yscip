
import React, { useState, useEffect } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ProjectCreation from './ProjectCreation';
import ProjectList from './projects/ProjectList';
import ProjectFilterSection from './projects/ProjectFilterSection';
import ProjectDialogManager from './projects/ProjectDialogManager';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<ProjectTheme[]>([]);
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
      <ProjectFilterSection 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNewProject={handleOpenCreateDialog}
        projects={projects}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <ProjectList 
        projects={projects}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        isLoading={isLoading}
        onEdit={handleEditInit}
        onImageChange={handleImageChangeInit}
        onDelete={handleDeleteInit}
        onAddNewProject={handleOpenCreateDialog}
      />

      <ProjectDialogManager
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        isImageDialogOpen={isImageDialogOpen}
        setIsImageDialogOpen={setIsImageDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedProject={selectedProject}
        newImageUrl={newImageUrl}
        setNewImageUrl={setNewImageUrl}
        editedProject={editedProject}
        setEditedProject={setEditedProject}
        onDeleteConfirm={handleDelete}
        onImageSave={handleChangeImage}
        onEditSave={handleSaveEdit}
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
