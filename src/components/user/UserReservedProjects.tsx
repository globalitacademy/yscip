
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Clock } from 'lucide-react';

interface UserReservedProjectsProps {
  userReservedProjectDetails: any[];
}

const UserReservedProjects: React.FC<UserReservedProjectsProps> = ({ 
  userReservedProjectDetails 
}) => {
  if (!userReservedProjectDetails.length) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-left">Իմ Ամրագրված Նախագծերը</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userReservedProjectDetails.map((rp) => (
          <Card key={rp.projectId} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{rp.project?.title || rp.projectTitle}</h3>
              <Badge variant="outline" className="bg-green-100 text-green-700">
                <Check size={14} className="mr-1" /> Ամրագրված
              </Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {rp.project?.techStack?.map((tech: string, i: number) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} />
                <span>Ամրագրվել է {new Date(rp.timestamp).toLocaleDateString('hy-AM')}</span>
              </div>
              <Link to={`/project/${rp.projectId}`} className="text-primary text-sm font-medium">
                Դիտել մանրամասներ
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserReservedProjects;
