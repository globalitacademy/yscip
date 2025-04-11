
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { createProject } from '@/services/projectManagementService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ProjectTheme } from '@/data/projectThemes';
import ProjectBasicInfo from '@/components/project-creation/ProjectBasicInfo';
import ProjectTechStackForm from '@/components/project-creation/ProjectTechStackForm';
import ProjectImplementationDetails from '@/components/project-creation/ProjectImplementationDetails';
import ProjectRequirements from '@/components/project-creation/ProjectRequirements';
import PageTitle from '@/components/common/PageTitle';

const steps = [
  { id: 'basic-info', label: 'Հիմնական տվյալներ' },
  { id: 'tech-stack', label: 'Տեխնոլոգիաներ' },
  { id: 'implementation', label: 'Իրականացում' },
  { id: 'requirements', label: 'Պահանջներ' }
];

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Project data state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState<'Սկսնակ' | 'Միջին' | 'Առաջադեմ'>('Միջին');
  const [duration, setDuration] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [projectImage, setProjectImage] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [goal, setGoal] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [resources, setResources] = useState<{ name: string; url: string }[]>([]);
  const [links, setLinks] = useState<{ name: string; url: string }[]>([]);
  
  const nextStep = () => {
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleSubmit = async () => {
    try {
      if (!title || !description || !category) {
        toast.error('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
        return;
      }
      
      setIsSubmitting(true);
      
      const newProject: Partial<ProjectTheme> = {
        title,
        description,
        detailedDescription,
        category,
        complexity,
        duration,
        techStack,
        image: projectImage,
        organizationName,
        steps,
        prerequisites,
        goal,
        learningOutcomes,
        is_public: isPublic,
        resources,
        links,
      };
      
      // Create project in the database and get the response
      const createdProject = await createProject(newProject, user?.id);
      
      toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
      navigate(`/project/${createdProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Նախագծի ստեղծման ժամանակ սխալ է տեղի ունեցել');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProjectBasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            detailedDescription={detailedDescription}
            setDetailedDescription={setDetailedDescription}
            category={category}
            setCategory={setCategory}
            complexity={complexity}
            setComplexity={setComplexity}
            duration={duration}
            setDuration={setDuration}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            setProjectImage={setProjectImage}
          />
        );
        
      case 1:
        return (
          <ProjectTechStackForm
            techStack={techStack}
            setTechStack={setTechStack}
            goal={goal}
            setGoal={setGoal}
            organizationName={organizationName}
            setOrganizationName={setOrganizationName}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
          />
        );
        
      case 2:
        return (
          <ProjectImplementationDetails
            steps={steps}
            setSteps={setSteps}
            resources={resources}
            setResources={setResources}
            links={links}
            setLinks={setLinks}
          />
        );
        
      case 3:
        return (
          <ProjectRequirements
            prerequisites={prerequisites}
            setPrerequisites={setPrerequisites}
            learningOutcomes={learningOutcomes}
            setLearningOutcomes={setLearningOutcomes}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/projects')}
            className="mb-4 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Վերադառնալ նախագծերի էջ
          </Button>
          
          <PageTitle title="Ստեղծել նոր նախագիծ" />
        </div>
        
        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {['Հիմնական տվյալներ', 'Տեխնոլոգիաներ', 'Իրականացում', 'Պահանջներ'].map((step, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col items-center ${
                  idx <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    idx < currentStep 
                      ? 'bg-primary text-white' 
                      : idx === currentStep 
                        ? 'border-2 border-primary text-primary' 
                        : 'border-2 border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {idx + 1}
                </div>
                <span className="text-sm hidden sm:block">{step}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute h-1 bg-muted w-full"></div>
            <div 
              className="absolute h-1 bg-primary transition-all" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>
        
        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Նախորդ
          </Button>
          
          {currentStep < 3 ? (
            <Button 
              onClick={nextStep}
              disabled={currentStep === 0 && (!title || !description || !category)}
            >
              Հաջորդ <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>Ստեղծվում է...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Ստեղծել նախագիծ
                </>
              )}
            </Button>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectCreatePage;
