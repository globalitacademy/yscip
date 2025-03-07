
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectProposal, ProjectProposalStatus } from '@/types/projectProposal';

const MyProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectProposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('project_proposals')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Մշակում ենք տվյալները՝ փոխակերպելով status դաշտը ProjectProposalStatus տիպի
        const typedData = data.map(item => ({
          ...item,
          status: item.status as ProjectProposalStatus
        }));

        setProjects(typedData);
      } catch (error) {
        console.error('Error fetching approved projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Իմ նախագծերը">
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Իմ նախագծերը">
      {projects.length === 0 ? (
        <div className="text-center p-12 bg-muted/40 rounded-lg">
          <h3 className="text-lg font-medium">Դուք դեռ չունեք հաստատված նախագծեր</h3>
          <p className="text-muted-foreground mt-1">
            Ձեր նախագծերը կհայտնվեն այստեղ, երբ հաստատվեն ադմինիստրատորի կողմից:
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{project.description}</p>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {project.duration && (
                    <div>
                      <p className="font-medium text-gray-500">Տևողություն</p>
                      <p>{project.duration}</p>
                    </div>
                  )}
                  
                  {project.organization && (
                    <div>
                      <p className="font-medium text-gray-500">Կազմակերպություն</p>
                      <p>{project.organization}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default MyProjectsPage;
