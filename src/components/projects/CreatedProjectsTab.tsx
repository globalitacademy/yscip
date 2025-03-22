
import React, { useState, useEffect } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { projectService } from '@/services/projectService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import { FadeIn } from '@/components/LocalTransitions';
import { supabase } from '@/integrations/supabase/client';

interface CreatedProjectsTabProps {
  userId: string;
}

const CreatedProjectsTab: React.FC<CreatedProjectsTabProps> = ({ userId }) => {
  const [projects, setProjects] = useState<ProjectTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user-created projects from the database
  useEffect(() => {
    const loadUserProjects = async () => {
      setIsLoading(true);
      try {
        if (!userId) {
          setProjects([]);
          return;
        }
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('created_by', userId)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching user projects:', error);
          toast.error('Նախագծերի բեռնման ժամանակ սխալ է տեղի ունեցել');
          setProjects([]);
        } else {
          const formattedProjects = data.map(project => projectService.formatDatabaseProject(project));
          setProjects(formattedProjects);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserProjects();
    
    // Subscribe to real-time updates for user projects
    const channel = supabase
      .channel('user-projects-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'projects',
          filter: `created_by=eq.${userId}`
        },
        (payload) => {
          console.log('User project real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newProject = projectService.formatDatabaseProject(payload.new);
            setProjects(prev => [newProject, ...prev]);
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedProject = projectService.formatDatabaseProject(payload.new);
            setProjects(prev => prev.map(p => 
              p.id === updatedProject.id ? updatedProject : p
            ));
          }
          else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setProjects(prev => prev.filter(p => p.id !== deletedId));
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Իմ ստեղծած նախագծերը</h2>
        <Button onClick={() => navigate('/admin/projects')}>
          <Plus className="mr-2 h-4 w-4" /> Ավելացնել նախագիծ
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center p-10 bg-muted rounded-lg">
          <p className="text-muted-foreground">Դուք դեռ չեք ստեղծել ոչ մի նախագիծ</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/admin/projects')}
          >
            <Plus className="mr-2 h-4 w-4" /> Ստեղծել նախագիծ
          </Button>
        </div>
      ) : (
        <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
            />
          ))}
        </FadeIn>
      )}
    </div>
  );
};

export default CreatedProjectsTab;
