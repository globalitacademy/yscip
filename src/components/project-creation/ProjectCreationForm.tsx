
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { ProjectTheme } from '@/data/projectThemes';
import ProjectTechStack from './ProjectTechStack';
import ProjectImplementationSteps from './ProjectImplementationSteps';
import ProjectLearningDetails from './ProjectLearningDetails';
import ProjectFormFooter from './ProjectFormFooter';

interface ProjectCreationFormProps {
  onProjectCreated?: (project: any) => void;
  initialData?: ProjectTheme;
  isEditing?: boolean;
  startStep?: number;
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ 
  onProjectCreated,
  initialData,
  isEditing = false,
  startStep = 1
}) => {
  const [currentStep, setCurrentStep] = useState(startStep);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState('Միջին');
  const [duration, setDuration] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [prerequisites, setPrerequisites] = useState<string[]>([]);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([]);
  const [organizationName, setOrganizationName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const handleNextStep = () => {
    setCurrentStep(prevStep => Math.min(prevStep + 1, 4));
  };
  
  const handlePreviousStep = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDetailedDescription('');
    setCategory('');
    setComplexity('Միջին');
    setDuration('');
    setTechStack([]);
    setSteps([]);
    setPrerequisites([]);
    setLearningOutcomes([]);
    setOrganizationName('');
    setIsPublic(false);
    setImageUrl('');
    setFormErrors({});
    setCurrentStep(1);
  };
  
  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    
    if (!title) {
      errors.title = 'Վերնագիրը պարտադիր է։';
    }
    if (!description) {
      errors.description = 'Նկարագրությունը պարտադիր է։';
    }
    if (!category) {
      errors.category = 'Կատեգորիան պարտադիր է։';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData && isEditing) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDetailedDescription(initialData.detailedDescription || '');
      setCategory(initialData.category || '');
      setComplexity(initialData.complexity || 'Միջին');
      setDuration(initialData.duration || '');
      setTechStack(initialData.techStack || []);
      setSteps(initialData.steps || []);
      setPrerequisites(initialData.prerequisites || []);
      setLearningOutcomes(initialData.learningOutcomes || []);
      setOrganizationName(initialData.organizationName || '');
      setIsPublic(initialData.is_public || false);
      setImageUrl(initialData.image || '');
    }
  }, [initialData, isEditing]);

  // Also update currentStep when startStep changes (for tab navigation)
  useEffect(() => {
    if (startStep) {
      setCurrentStep(startStep);
    }
  }, [startStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const project = {
      id: initialData?.id || Date.now(),
      title,
      description,
      detailedDescription,
      category,
      complexity,
      duration,
      techStack,
      image: imageUrl,
      steps,
      prerequisites,
      learningOutcomes,
      is_public: isPublic,
      organizationName,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: initialData?.createdBy || 'user_id', // Should be replaced with actual user ID
    };
    
    if (onProjectCreated) {
      onProjectCreated(project);
    }
    
    if (!isEditing) {
      // Reset form if not in edit mode
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {currentStep === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Վերնագիր</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Մուտքագրեք նախագծի վերնագիրը"
            />
            {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}
          </div>
          <div>
            <Label htmlFor="description">Համառոտ նկարագրություն</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Մուտքագրեք նախագծի համառոտ նկարագրությունը"
              rows={3}
            />
            {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
          </div>
          <div>
            <Label htmlFor="detailedDescription">Մանրամասն նկարագրություն</Label>
            <Textarea
              id="detailedDescription"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="Մուտքագրեք նախագծի մանրամասն նկարագրությունը"
              rows={6}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organizationName">Կազմակերպություն</Label>
              <Input
                type="text"
                id="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Մուտքագրեք կազմակերպության անվանումը"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="is_public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="is_public">Հրապարակային նախագիծ</Label>
            </div>
          </div>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Կատեգորիա</Label>
            <Input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Մուտքագրեք նախագծի կատեգորիան"
            />
            {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
          </div>
          <div>
            <Label htmlFor="complexity">Բարդություն</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger id="complexity">
                <SelectValue placeholder="Ընտրեք բարդությունը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Սկսնակ">Սկսնակ</SelectItem>
                <SelectItem value="Միջին">Միջին</SelectItem>
                <SelectItem value="Առաջադեմ">Առաջադեմ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Տևողություն</Label>
            <Input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Մուտքագրեք նախագծի տևողությունը"
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Նկարի URL</Label>
            <Input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Մուտքագրեք նկարի URL-ը"
            />
            {imageUrl && (
              <div className="mt-2 border p-2 rounded-md">
                <img 
                  src={imageUrl} 
                  alt="Նախագծի նկար" 
                  className="h-32 object-cover rounded-md mx-auto" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
      
      {currentStep === 3 && (
        <div className="space-y-4">
          <ProjectTechStack
            techStack={techStack}
            onTechStackChange={setTechStack}
          />
        </div>
      )}
      
      {currentStep === 4 && (
        <div className="space-y-4">
          <ProjectImplementationSteps
            steps={steps}
            onStepsChange={setSteps}
          />
          
          <ProjectLearningDetails
            prerequisites={prerequisites}
            onPrerequisitesChange={setPrerequisites}
            learningOutcomes={learningOutcomes}
            onLearningOutcomesChange={setLearningOutcomes}
          />
        </div>
      )}
      
      <ProjectFormFooter
        currentStep={currentStep}
        totalSteps={4}
        onPreviousStep={handlePreviousStep}
        onNextStep={handleNextStep}
        isLastStep={currentStep === 4}
        submitButtonText={isEditing ? "Պահպանել փոփոխությունները" : "Ստեղծել նախագիծ"}
      />
    </form>
  );
};

export default ProjectCreationForm;
