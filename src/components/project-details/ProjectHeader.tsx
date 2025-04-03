
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { ProjectTheme } from '@/data/projectThemes';
import { useProject } from '@/contexts/ProjectContext';
import ProjectHeaderBanner from './ProjectHeaderBanner';
import ProjectMetadata from './ProjectMetadata';
import ProjectProgress from './ProjectProgress';
import ReservationActions from './ReservationActions';
import { formatDate } from '@/lib/utils';
import { getProjectImage } from '@/lib/getProjectImage';

interface ProjectHeaderProps {
  project: ProjectTheme;
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  isReserved: boolean;
  imageUrl: string;
  projectMembers: { id: string; name: string; role: string; avatar: string }[];
  organization: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  progressPercentage: number;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  projectStatus,
  isReserved,
  imageUrl,
  projectMembers,
  organization,
  progressPercentage,
}) => {
  const { 
    openSupervisorDialog, 
    closeSupervisorDialog, 
    showSupervisorDialog, 
    selectedSupervisor, 
    selectSupervisor, 
    reserveProject,
    getReservationStatus
  } = useProject();

  // Safety check to prevent errors
  if (!project) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
        <p className="text-gray-500">Project information unavailable</p>
      </div>
    );
  }

  // Project deadline
  const deadline = project.duration ? new Date() : null;
  if (deadline) {
    deadline.setDate(deadline.getDate() + 30); // Mock deadline 30 days from now
  }
  
  // Get reservation status
  const reservationStatus = getReservationStatus();

  // Find the supervisor from project members
  const supervisor = projectMembers.find(member => member.role === 'ղեկավար')?.name || '';

  // Use the getProjectImage utility for reliable image URLs
  const projectImageUrl = imageUrl || getProjectImage(project);

  return (
    <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <ProjectHeaderBanner project={project} />
          
          <ProjectMetadata 
            deadline={deadline}
            category={project.category}
            supervisor={supervisor}
            organization={organization}
            projectStatus={projectStatus}
          />
          
          {!isReserved ? (
            <ReservationActions
              reservationStatus={reservationStatus}
              openSupervisorDialog={openSupervisorDialog}
              closeSupervisorDialog={closeSupervisorDialog}
              showSupervisorDialog={showSupervisorDialog}
              selectedSupervisor={selectedSupervisor}
              selectSupervisor={selectSupervisor}
              reserveProject={reserveProject}
              projectTitle={project.title}
            />
          ) : (
            <ProjectProgress progressPercentage={progressPercentage} />
          )}
        </div>
        
        <div className="rounded-lg overflow-hidden border border-border h-64 md:h-auto">
          <img 
            src={projectImageUrl} 
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      </div>
    </FadeIn>
  );
};

export default ProjectHeader;
