
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ProjectProposal {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  duration?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  employerId: string;
  employerName: string;
  organization?: string;
  feedback?: string;
}

const ProjectProposalsList: React.FC = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  
  useEffect(() => {
    // Load proposals from localStorage
    const savedProposals = JSON.parse(localStorage.getItem('projectProposals') || '[]');
    // Filter proposals for the current employer
    if (user?.role === 'employer') {
      setProposals(savedProposals.filter((p: ProjectProposal) => p.employerId === user.id));
    }
  }, [user]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Սպասում է
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Հաստատված
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" /> Մերժված
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hy-AM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (proposals.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="pt-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Դեռևս նախագծի առաջարկներ չկան</p>
          <p className="text-muted-foreground mt-2">
            Օգտագործեք ձևաթուղթը՝ նոր նախագիծ առաջարկելու համար
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div>
              <CardTitle>{proposal.title}</CardTitle>
              <CardDescription>Ուղարկվել է {formatDate(proposal.createdAt)}</CardDescription>
            </div>
            {getStatusBadge(proposal.status)}
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Նկարագրություն</p>
              <p className="text-sm">{proposal.description}</p>
            </div>
            
            {proposal.requirements && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Տեխնիկական պահանջներ</p>
                <p className="text-sm">{proposal.requirements}</p>
              </div>
            )}
            
            {proposal.duration && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Տևողություն</p>
                <p className="text-sm">{proposal.duration}</p>
              </div>
            )}
            
            {proposal.feedback && (
              <div className="bg-muted p-3 rounded-md mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Հետադարձ կապ</p>
                <p className="text-sm">{proposal.feedback}</p>
              </div>
            )}
          </CardContent>
          
          {proposal.status === 'approved' && (
            <CardFooter>
              <Button className="w-full">Դիտել նախագիծը</Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ProjectProposalsList;
