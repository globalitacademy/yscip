
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { getProjectImage } from '@/lib/getProjectImage';
import { ArrowLeft, Calendar, Clock, Tag, Users } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectHeaderBanner from './ProjectHeaderBanner';

const ProjectHeader: React.FC = () => {
  const navigate = useNavigate();
  const { project, isEditing } = useProject();

  if (!project) return null;
  
  return <ProjectHeaderBanner project={project} isEditing={isEditing || false} />;
};

export default ProjectHeader;
