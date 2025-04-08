
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProject } from '@/contexts/ProjectContext';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Briefcase, FileStack, Edit } from 'lucide-react';
import { format } from 'date-fns';
import ProjectTimelineSection from './ProjectTimelineSection';
import ProjectTaskSection from './ProjectTaskSection';
import ProjectTeamSection from './ProjectTeamSection';
import ProjectEditableDetail from './ProjectEditableDetail';
import EditableTechStack from './EditableTechStack';
import ProjectEditorToolbar from './ProjectEditorToolbar';
import ProjectReservationSection from './ProjectReservationSection';

const ProjectDetailsContent: React.FC = () => {
  const {
    project,
    isReserved,
    canEdit,
    startEditing,
    isEditing,
    cancelEditing,
    saveProject,
    updateProjectField,
    isSaving,
    unsavedChanges
  } = useProject();

  if (!project) {
    return <div>Նախագիծը չի գտնվել</div>;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Project Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            {/* Left Column - Main Details */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                {project.detailedDescription ? (
                  <ProjectEditableDetail
                    label="Մանրամասն նկարագրություն"
                    value={project.detailedDescription}
                    onChange={(value) => updateProjectField('detailedDescription', value)}
                    isEditing={isEditing}
                    size="md"
                    multiline
                  />
                ) : (
                  <ProjectEditableDetail
                    label="Նկարագրություն"
                    value={project.description}
                    onChange={(value) => updateProjectField('description', value)}
                    isEditing={isEditing}
                    size="md"
                    multiline
                  />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProjectEditableDetail
                  label="Կատեգորիա"
                  value={project.category}
                  onChange={(value) => updateProjectField('category', value)}
                  isEditing={isEditing}
                  size="sm"
                />
                
                <ProjectEditableDetail
                  label="Բարդություն"
                  value={project.complexity || 'Միջին'}
                  onChange={(value) => updateProjectField('complexity', value)}
                  isEditing={isEditing}
                  size="sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProjectEditableDetail
                  label="Կազմակերպություն"
                  value={project.organizationName || ''}
                  onChange={(value) => updateProjectField('organizationName', value)}
                  isEditing={isEditing}
                  size="sm"
                />
                
                <ProjectEditableDetail
                  label="Տևողություն"
                  value={project.duration || 'Չսահմանված'}
                  onChange={(value) => updateProjectField('duration', value)}
                  isEditing={isEditing}
                  size="sm"
                />
              </div>
              
              <EditableTechStack
                techStack={project.techStack || []}
                onChange={(techStack) => updateProjectField('techStack', techStack)}
                isEditing={isEditing}
              />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> 
                  Ստեղծվել է: {format(new Date(project.createdAt), 'dd.MM.yyyy')}
                </div>
                
                {project.updatedAt && project.updatedAt !== project.createdAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> 
                    Թարմացվել է: {format(new Date(project.updatedAt), 'dd.MM.yyyy')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Project Implementation Steps */}
      {project.steps && project.steps.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Իրականացման քայլեր</h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              {project.steps.map((step, index) => (
                <li key={index} className="text-gray-700">{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
      
      {/* Project Prerequisites and Learning Outcomes */}
      {(project.prerequisites?.length > 0 || project.learningOutcomes?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.prerequisites && project.prerequisites.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Նախապայմաններ</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {project.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="text-gray-700">{prerequisite}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {project.learningOutcomes && project.learningOutcomes.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Ուսումնառության արդյունքներ</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {project.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="text-gray-700">{outcome}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Timeline */}
      <ProjectTimelineSection />
      
      {/* Tasks */}
      <ProjectTaskSection />
      
      {/* Project Team */}
      <ProjectTeamSection />
      
      {/* Project Reservation */}
      {!isReserved && <ProjectReservationSection />}
      
      {/* Editor Toolbar */}
      {isEditing && (
        <ProjectEditorToolbar
          onSave={saveProject}
          onCancel={cancelEditing}
          isSaving={isSaving}
          hasUnsavedChanges={unsavedChanges}
        />
      )}
    </div>
  );
};

export default ProjectDetailsContent;
