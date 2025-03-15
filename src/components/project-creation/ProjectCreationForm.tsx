
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "@/components/ui/use-toast";
import { ProjectTheme } from '@/data/projectThemes';
import ProjectBasicInfo from './ProjectBasicInfo';
import ProjectTechStack from './ProjectTechStack';
import ProjectImplementationSteps from './ProjectImplementationSteps';
import ProjectLearningDetails from './ProjectLearningDetails';
import ProjectFormFooter from './ProjectFormFooter';

interface ProjectCreationFormProps {
  onProjectCreated?: (project: ProjectTheme) => void;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ onProjectCreated }) => {
  const { user } = useAuth();
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    category: '',
    complexity: 'Սկսնակ' as 'Սկսնակ' | 'Միջին' | 'Առաջադեմ',
    duration: '',
    techStack: [] as string[],
    steps: [] as string[],
    prerequisites: [] as string[],
    learningOutcomes: [] as string[],
    image: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description || !newProject.category || newProject.techStack.length === 0) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը",
        variant: "destructive",
      });
      return;
    }

    const project = {
      ...newProject,
      id: Date.now(),
      createdBy: user?.id,
      createdAt: new Date().toISOString(),
      image: newProject.image || `https://source.unsplash.com/random/800x600/?${encodeURIComponent(newProject.category)}`
    };

    if (onProjectCreated) {
      onProjectCreated(project);
    }

    setNewProject({
      title: '',
      description: '',
      detailedDescription: '',
      category: '',
      complexity: 'Սկսնակ',
      duration: '',
      techStack: [],
      steps: [],
      prerequisites: [],
      learningOutcomes: [],
      image: ''
    });
    setPreviewImage(null);

    toast({
      title: "Պրոեկտը ստեղծված է",
      description: "Նոր պրոեկտը հաջողությամբ ստեղծվել է։",
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Նոր պրոեկտի ստեղծում</CardTitle>
        <CardDescription>Ստեղծեք նոր պրոեկտ ձեր ուսանողների համար</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProjectBasicInfo
          title={newProject.title}
          setTitle={(title) => setNewProject(prev => ({ ...prev, title }))}
          description={newProject.description}
          setDescription={(description) => setNewProject(prev => ({ ...prev, description }))}
          detailedDescription={newProject.detailedDescription}
          setDetailedDescription={(detailedDescription) => setNewProject(prev => ({ ...prev, detailedDescription }))}
          category={newProject.category}
          setCategory={(category) => setNewProject(prev => ({ ...prev, category }))}
          complexity={newProject.complexity}
          setComplexity={(complexity) => setNewProject(prev => ({ ...prev, complexity }))}
          duration={newProject.duration}
          setDuration={(duration) => setNewProject(prev => ({ ...prev, duration }))}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          setProjectImage={(image) => setNewProject(prev => ({ ...prev, image }))}
        />

        <ProjectTechStack
          techStack={newProject.techStack}
          onTechStackChange={(techStack) => setNewProject(prev => ({ ...prev, techStack }))}
        />

        <ProjectImplementationSteps
          steps={newProject.steps}
          onStepsChange={(steps) => setNewProject(prev => ({ ...prev, steps }))}
        />

        <ProjectLearningDetails
          prerequisites={newProject.prerequisites}
          onPrerequisitesChange={(prerequisites) => setNewProject(prev => ({ ...prev, prerequisites }))}
          learningOutcomes={newProject.learningOutcomes}
          onLearningOutcomesChange={(learningOutcomes) => setNewProject(prev => ({ ...prev, learningOutcomes }))}
        />
      </CardContent>
      <ProjectFormFooter onSubmit={handleCreateProject} />
    </Card>
  );
};

export default ProjectCreationForm;
