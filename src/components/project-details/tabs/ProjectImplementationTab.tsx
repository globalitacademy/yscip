
import React, { useState } from 'react';
import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import ProjectTaskList from '@/components/project-details/ProjectTaskList';
import ProjectDetailSection from '../ProjectDetailSection';

interface ProjectImplementationTabProps {
  project?: ProjectTheme;
  timeline?: TimelineEvent[];
  tasks?: Task[];
  projectStatus?: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  isEditing: boolean;
  addTimelineEvent?: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent?: (eventId: string) => void;
  addTask?: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus?: (taskId: string, status: Task['status']) => void;
  submitProject?: (feedback: string) => void;
  approveProject?: (feedback: string) => void;
  rejectProject?: (feedback: string) => void;
  onSaveChanges: (updates: Partial<ProjectTheme>) => Promise<void>;
}

const ProjectImplementationTab: React.FC<ProjectImplementationTabProps> = ({ 
  project = {} as ProjectTheme, 
  tasks = [],
  isEditing,
  addTask,
  updateTaskStatus,
  onSaveChanges
}) => {
  const [steps, setSteps] = useState<{ step: string; description: string }[]>(
    project.implementationSteps || []
  );
  
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  const [requirements, setRequirements] = useState<string[]>(
    project.requirements || []
  );
  const [newRequirement, setNewRequirement] = useState('');

  const handleAddStep = () => {
    if (!newStepTitle) return;
    
    const updatedSteps = [...steps, { 
      step: newStepTitle,
      description: newStepDescription
    }];
    
    setSteps(updatedSteps);
    setNewStepTitle('');
    setNewStepDescription('');
    
    // Save immediately
    onSaveChanges({
      implementationSteps: updatedSteps
    } as Partial<ProjectTheme>);
  };

  const handleRemoveStep = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
    
    // Save immediately
    onSaveChanges({
      implementationSteps: updatedSteps
    } as Partial<ProjectTheme>);
  };

  const handleAddRequirement = () => {
    if (!newRequirement) return;
    
    const updatedRequirements = [...requirements, newRequirement];
    setRequirements(updatedRequirements);
    setNewRequirement('');
    
    // Save immediately
    onSaveChanges({
      requirements: updatedRequirements
    } as Partial<ProjectTheme>);
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = [...requirements];
    updatedRequirements.splice(index, 1);
    setRequirements(updatedRequirements);
    
    // Save immediately
    onSaveChanges({
      requirements: updatedRequirements
    } as Partial<ProjectTheme>);
  };

  return (
    <div>
      <Tabs defaultValue="implementation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="implementation">Իրականացման քայլեր</TabsTrigger>
          <TabsTrigger value="requirements">Պահանջներ</TabsTrigger>
          <TabsTrigger value="tasks">Առաջադրանքներ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="implementation" className="space-y-4">
          <ProjectDetailSection 
            title="Իրականացման քայլեր" 
            isEditing={isEditing}
          >
            {steps && steps.length > 0 ? (
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={`step-${index}`} className="relative border-l-2 border-primary pl-4 pb-6">
                    <div className="absolute -left-[9px] top-0 bg-background p-1">
                      <div className="h-4 w-4 rounded-full bg-primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{step.step}</h4>
                        {isEditing && (
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStep(index)}
                            className="h-7 text-destructive hover:text-destructive"
                          >
                            Հեռացնել
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Այս նախագծի համար չկան սահմանված իրականացման քայլեր</p>
            )}
            
            {isEditing && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <h4 className="font-medium">Ավելացնել նոր քայլ</h4>
                <div className="space-y-2">
                  <Input 
                    placeholder="Քայլի վերնագիր" 
                    value={newStepTitle}
                    onChange={(e) => setNewStepTitle(e.target.value)}
                  />
                  <Textarea 
                    placeholder="Քայլի նկարագրություն" 
                    value={newStepDescription}
                    onChange={(e) => setNewStepDescription(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={handleAddStep} disabled={!newStepTitle}>
                    Ավելացնել քայլ
                  </Button>
                </div>
              </div>
            )}
          </ProjectDetailSection>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-4">
          <ProjectDetailSection 
            title="Տեխնիկական պահանջներ" 
            isEditing={isEditing}
          >
            {requirements && requirements.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {requirements.map((req, index) => (
                  <li key={`req-${index}`} className="flex justify-between items-start">
                    <span>{req}</span>
                    {isEditing && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveRequirement(index)}
                        className="h-7 text-destructive hover:text-destructive ml-2"
                      >
                        Հեռացնել
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Այս նախագծի համար չկան սահմանված տեխնիկական պահանջներ</p>
            )}
            
            {isEditing && (
              <div className="mt-6 space-y-4 border-t pt-4">
                <h4 className="font-medium">Ավելացնել նոր պահանջ</h4>
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Պահանջ" 
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddRequirement} disabled={!newRequirement}>
                    Ավելացնել
                  </Button>
                </div>
              </div>
            )}
          </ProjectDetailSection>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <ProjectTaskList 
            tasks={tasks} 
            isEditing={isEditing}
            onAddTask={addTask || (() => {})}
            onUpdateTaskStatus={updateTaskStatus || (() => {})}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectImplementationTab;
