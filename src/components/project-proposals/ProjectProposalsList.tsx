
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ProjectProposal, ProjectProposalStatus } from '@/types/projectProposal';

const ProjectProposalsList: React.FC = () => {
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProposals = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('project_proposals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Մշակում ենք տվյալները՝ փոխակերպելով status դաշտը ProjectProposalStatus տիպի
        const typedData = data.map(item => ({
          ...item,
          status: item.status as ProjectProposalStatus
        }));

        setProposals(typedData);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        toast({
          variant: "destructive",
          title: "Սխալ",
          description: "Չհաջողվեց բեռնել նախագծերի առաջարկները",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [user, toast]);

  const getStatusBadge = (status: ProjectProposalStatus) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Հաստատված</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Մերժված</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="text-amber-500 border-amber-500"><Clock className="w-3 h-3 mr-1" /> Սպասման մեջ</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center p-12 bg-muted/40 rounded-lg">
        <h3 className="text-lg font-medium">Դուք դեռ չունեք նախագծերի առաջարկներ</h3>
        <p className="text-muted-foreground mt-1">Ստեղծեք նոր առաջարկ՝ օգտագործելով «Նոր առաջարկ» ներդիրը</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{proposal.title}</CardTitle>
              {getStatusBadge(proposal.status)}
            </div>
            <CardDescription>
              Ներկայացվել է {format(new Date(proposal.created_at), 'dd.MM.yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-500 mb-1">Նկարագրություն</p>
              <p className="text-sm">{proposal.description}</p>
            </div>
            
            {proposal.requirements && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-500 mb-1">Պահանջներ</p>
                <p className="text-sm">{proposal.requirements}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mt-4">
              {proposal.duration && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Տևողություն</p>
                  <p className="text-sm">{proposal.duration}</p>
                </div>
              )}
              
              {proposal.organization && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Կազմակերպություն</p>
                  <p className="text-sm">{proposal.organization}</p>
                </div>
              )}
            </div>
          </CardContent>
          
          {proposal.feedback && (
            <CardFooter className="border-t bg-muted/30 flex flex-col items-start pt-3">
              <p className="text-sm font-medium text-gray-500 mb-1">Արձագանք</p>
              <p className="text-sm">{proposal.feedback}</p>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ProjectProposalsList;
