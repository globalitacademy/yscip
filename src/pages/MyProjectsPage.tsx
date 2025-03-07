
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectProposal, ProjectProposalStatus } from '@/types/projectProposal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const MyProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectProposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ստուգել օգտատիրոջ ավտենտիֆիկացիան
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      if (!user) return;

      try {
        // Ստանալ նախագծերը Supabase-ից
        let query = supabase
          .from('project_proposals')
          .select('*');
          
        // Եթե օգտատերը գործատու է, ցուցադրել միայն իր նախագծերը
        if (user.role === 'employer') {
          query = query.eq('employer_id', user.id);
        }
        
        // Եթե օգտատերը ուսանող է, ցուցադրել միայն հաստատված նախագծերը
        if (user.role === 'student') {
          query = query.eq('status', 'approved');
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;

        // Մշակում ենք տվյալները՝ փոխակերպելով status դաշտը ProjectProposalStatus տիպի
        const typedData = data.map(item => ({
          ...item,
          status: item.status as ProjectProposalStatus
        }));

        setProjects(typedData);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, isAuthenticated, navigate]);

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
          <h3 className="text-lg font-medium">
            {user?.role === 'employer' 
              ? 'Դուք դեռ չունեք առաջարկված նախագծեր' 
              : 'Հասանելի նախագծեր չեն գտնվել'}
          </h3>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'employer' 
              ? 'Դուք կարող եք առաջարկել նոր նախագիծ, որը հետո կհաստատվի ադմինիստրատորի կողմից:' 
              : 'Ձեր նախագծերը կհայտնվեն այստեղ, երբ հաստատվեն ադմինիստրատորի կողմից:'}
          </p>
          
          {user?.role === 'employer' && (
            <Button 
              className="mt-4" 
              onClick={() => navigate('/project-proposals')}
            >
              Առաջարկել նոր նախագիծ
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  {user?.role === 'employer' && (
                    <Badge project={project} />
                  )}
                </div>
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
                
                {user?.role === 'student' && (
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => {/* Տրամաբանությունը կավելացվի հետագայում */}}
                  >
                    Դիմել նախագծին
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

// Նախագծի կարգավիճակի Badge կոմպոնենտ
const Badge: React.FC<{ project: ProjectProposal }> = ({ project }) => {
  const getStatusColor = () => {
    switch (project.status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStatusText = () => {
    switch (project.status) {
      case 'approved':
        return 'Հաստատված';
      case 'rejected':
        return 'Մերժված';
      default:
        return 'Սպասման մեջ';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
};

export default MyProjectsPage;
