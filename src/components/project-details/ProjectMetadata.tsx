
import React from 'react';
import { format } from 'date-fns';
import { Clock, Users, BookOpen, User, Building, AlertCircle } from 'lucide-react';

interface ProjectMetadataProps {
  deadline: Date | null;
  category: string;
  supervisor: string;
  organization: { name: string } | null;
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
}

const ProjectMetadata: React.FC<ProjectMetadataProps> = ({
  deadline,
  category,
  supervisor,
  organization,
  projectStatus
}) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'not_submitted': return 'Չներկայացված';
      case 'pending': return 'Ներկայացված';
      case 'approved': return 'Հաստատված';
      case 'rejected': return 'Մերժված';
      default: return status;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {deadline && (
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-muted-foreground" />
          <span>Վերջնաժամկետ: {format(deadline, 'dd/MM/yyyy')}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm">
        <Users size={16} className="text-muted-foreground" />
        <span>Անհատական նախագիծ</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <BookOpen size={16} className="text-muted-foreground" />
        <span>{category}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <User size={16} className="text-muted-foreground" />
        <span>Ղեկավար: {supervisor}</span>
      </div>
      {organization && (
        <div className="flex items-center gap-2 text-sm">
          <Building size={16} className="text-muted-foreground" />
          <span>Կազմակերպություն: {organization.name}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm">
        <AlertCircle size={16} className="text-muted-foreground" />
        <span>Կարգավիճակ: {getStatusText(projectStatus)}</span>
      </div>
    </div>
  );
};

export default ProjectMetadata;
