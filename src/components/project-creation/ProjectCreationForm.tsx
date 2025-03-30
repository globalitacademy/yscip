
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { ProjectTheme } from '@/data/projectThemes';
import ProjectBasicInfo from './ProjectBasicInfo';
import ProjectTechStack from './ProjectTechStack';
import ProjectImplementationSteps from './ProjectImplementationSteps';
import ProjectLearningDetails from './ProjectLearningDetails';
import ProjectFormFooter from './ProjectFormFooter';
import { v4 as uuidv4 } from 'uuid';

interface ProjectCreationFormProps {
  onProjectCreated?: (project: ProjectTheme) => void;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ onProjectCreated }) => {
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    category: '',
    complexity: 'Սկսնակ' as 'Սկսնակ' | 'Միջին' | 'Առաջադեմ',
    duration: '',
    techStack: [] as string[], // Ensure this is initialized as an empty array
    steps: [] as string[],
    prerequisites: [] as string[],
    learningOutcomes: [] as string[],
    image: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleCreateProject = (): boolean => {
    if (!newProject.title || !newProject.description || !newProject.category || newProject.techStack.length === 0) {
      toast.error("Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը");
      return false;
    }

    setIsSubmitting(true);

    try {
      // Even if not authenticated, allow project creation with a warning
      if (!isAuthenticated || !user) {
        toast.warning("Դուք մուտք չեք գործել համակարգ, նախագիծը կստեղծվի բայց չի հրապարակվի");
      }
      
      const projectId = Date.now();
      const userId = user?.id || 'local-user';
      const currentTime = new Date().toISOString();
    
      // Ensure image has a default value if not provided
      const imageUrl = newProject.image || previewImage || 
        `https://source.unsplash.com/random/800x600/?${encodeURIComponent(newProject.category)}`;
      
      const project: ProjectTheme = {
        ...newProject,
        id: projectId,
        createdBy: userId,
        createdAt: currentTime,
        updatedAt: currentTime,
        image: imageUrl,
        techStack: newProject.techStack || [] // Ensure techStack is provided and defaults to empty array
      };

      // Save project to localStorage as backup
      const storedProjects = localStorage.getItem('local_projects');
      let projects = storedProjects ? JSON.parse(storedProjects) : [];
      projects.push(project);
      localStorage.setItem('local_projects', JSON.stringify(projects));
      
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

      toast.success("Նոր պրոեկտը հաջողությամբ ստեղծվել է։");
      
      return true;
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Սխալ է տեղի ունեցել նախագիծը ստեղծելիս։");
      return false;
    } finally {
      setIsSubmitting(false);
    }
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
      <ProjectFormFooter 
        onSubmit={handleCreateProject} 
        isDisabled={isSubmitting}
      />
    </Card>
  );
};

export default ProjectCreationForm;
