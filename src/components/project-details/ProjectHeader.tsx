
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, BookOpen, User, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProjectTheme } from '@/data/projectThemes';
import { FadeIn } from '@/components/LocalTransitions';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

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
  onReserveProject: () => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  projectStatus,
  isReserved,
  imageUrl,
  projectMembers,
  organization,
  progressPercentage,
  onReserveProject,
}) => {
  const complexityColor = {
    Սկսնակ: 'bg-green-500/10 text-green-600 border-green-200',
    Միջին: 'bg-amber-500/10 text-amber-600 border-amber-200',
    Առաջադեմ: 'bg-red-500/10 text-red-600 border-red-200',
  }[project.complexity];

  // Project deadline
  const deadline = project.duration ? new Date() : null;
  if (deadline) {
    deadline.setDate(deadline.getDate() + 30); // Mock deadline 30 days from now
  }

  return (
    <FadeIn>
      <Link to="/" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={16} className="mr-1" /> Վերադառնալ բոլոր պրոեկտների ցանկին
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <Badge variant="outline" className={cn("font-medium mb-3", complexityColor)}>
            {project.complexity}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {project.techStack.map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
          
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
              <span>{project.category}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User size={16} className="text-muted-foreground" />
              <span>Ղեկավար: {projectMembers[0].name}</span>
            </div>
            {organization && (
              <div className="flex items-center gap-2 text-sm">
                <Building size={16} className="text-muted-foreground" />
                <span>Կազմակերպություն: {organization.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-muted-foreground" />
              <span>Կարգավիճակ: {
                projectStatus === 'not_submitted' ? 'Չներկայացված' :
                projectStatus === 'pending' ? 'Ներկայացված' :
                projectStatus === 'approved' ? 'Հաստատված' : 'Մերժված'
              }</span>
            </div>
          </div>
          
          {!isReserved ? (
            <Button onClick={onReserveProject} size="lg" className="mt-2">
              Ամրագրել այս պրոեկտը
            </Button>
          ) : (
            <div className="space-y-3">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                <CheckCircle size={14} className="mr-1" /> Այս պրոեկտն ամրագրված է
              </Badge>
              
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Պրոեկտի առաջադիմություն</span>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 w-full" />
              </div>
            </div>
          )}
        </div>
        
        <div className="rounded-lg overflow-hidden border border-border h-64 md:h-auto">
          <img 
            src={imageUrl} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </FadeIn>
  );
};

export default ProjectHeader;
