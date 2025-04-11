
import React, { useState } from 'react';
import { ProjectTheme } from '@/data/projectThemes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, ClockIcon, TargetIcon, BookIcon, UsersIcon, GanttChartIcon, BriefcaseIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import ProjectDetailSection from './ProjectDetailSection';

interface ProjectOverviewProps {
  project: ProjectTheme;
  projectMembers: any[];
  organization: any;
  similarProjects: ProjectTheme[];
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<any>;
  isEditing?: boolean;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  projectMembers,
  organization,
  similarProjects,
  onSaveChanges,
  isEditing = false
}) => {
  const [goal, setGoal] = useState(project.goal || '');
  const [description, setDescription] = useState(project.description || '');
  const [detailedDescription, setDetailedDescription] = useState(project.detailedDescription || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveChanges({
        goal,
        description,
        detailedDescription
      });
    } catch (error) {
      console.error("Error saving project details:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project title & description */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
        
        {isEditing ? (
          <>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4"
              placeholder="Մուտքագրեք նախագծի համառոտ նկարագրությունը"
              rows={3}
            />
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="mb-4"
            >
              {isSaving ? 'Պահպանվում է...' : 'Պահպանել նկարագրությունը'}
            </Button>
          </>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
        )}
      </div>

      {/* Project goal section */}
      <ProjectDetailSection 
        title="Նպատակ" 
        icon={<TargetIcon className="h-5 w-5" />}
        isEditing={isEditing}
      >
        {isEditing ? (
          <Textarea 
            value={goal} 
            onChange={(e) => setGoal(e.target.value)}
            className="mb-4"
            placeholder="Մուտքագրեք նախագծի նպատակը"
            rows={3}
          />
        ) : (
          project.goal && <p className="text-gray-700 dark:text-gray-300">{project.goal}</p>
        )}
      </ProjectDetailSection>
      
      {/* Project detailed description */}
      <ProjectDetailSection 
        title="Մանրամասն նկարագրություն" 
        icon={<BookIcon className="h-5 w-5" />}
        isEditing={isEditing}
      >
        {isEditing ? (
          <Textarea 
            value={detailedDescription} 
            onChange={(e) => setDetailedDescription(e.target.value)}
            className="mb-4"
            placeholder="Մուտքագրեք նախագծի մանրամասն նկարագրությունը"
            rows={6}
          />
        ) : (
          project.detailedDescription && (
            <div className="prose dark:prose-invert max-w-none">
              <p>{project.detailedDescription}</p>
            </div>
          )
        )}
      </ProjectDetailSection>
      
      {/* Project metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              Տևողություն
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.duration || "Չի նշվել"}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <GanttChartIcon className="h-4 w-4 mr-2" />
              Բարդություն
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{project.complexity || "Միջին"}</p>
          </CardContent>
        </Card>
        
        {organization && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                Կազմակերպություն
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{organization.name}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Save changes button */}
      {isEditing && (
        <div className="mt-6">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full md:w-auto"
          >
            {isSaving ? 'Պահպանվում է...' : 'Պահպանել փոփոխությունները'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectOverview;
