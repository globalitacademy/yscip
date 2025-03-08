
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProjectCreationProps {
  onProjectCreated?: (project: any) => void;
}

const ProjectCreation: React.FC<ProjectCreationProps> = ({ onProjectCreated }) => {
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
    learningOutcomes: [] as string[]
  });
  const [currentTech, setCurrentTech] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [currentPrereq, setCurrentPrereq] = useState('');
  const [currentOutcome, setCurrentOutcome] = useState('');

  const handleAddTech = () => {
    if (currentTech.trim() && !newProject.techStack.includes(currentTech.trim())) {
      setNewProject(prev => ({
        ...prev,
        techStack: [...prev.techStack, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleAddStep = () => {
    if (currentStep.trim()) {
      setNewProject(prev => ({
        ...prev,
        steps: [...prev.steps, currentStep.trim()]
      }));
      setCurrentStep('');
    }
  };

  const handleRemoveStep = (index: number) => {
    setNewProject(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleAddPrereq = () => {
    if (currentPrereq.trim() && !newProject.prerequisites.includes(currentPrereq.trim())) {
      setNewProject(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, currentPrereq.trim()]
      }));
      setCurrentPrereq('');
    }
  };

  const handleRemovePrereq = (prereq: string) => {
    setNewProject(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prereq)
    }));
  };

  const handleAddOutcome = () => {
    if (currentOutcome.trim() && !newProject.learningOutcomes.includes(currentOutcome.trim())) {
      setNewProject(prev => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, currentOutcome.trim()]
      }));
      setCurrentOutcome('');
    }
  };

  const handleRemoveOutcome = (outcome: string) => {
    setNewProject(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter(o => o !== outcome)
    }));
  };

  const handleCreateProject = () => {
    // Validate required fields
    if (!newProject.title || !newProject.description || !newProject.category || newProject.techStack.length === 0) {
      toast({
        title: "Սխալ",
        description: "Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը",
        variant: "destructive",
      });
      return;
    }

    // Create project object
    const project = {
      ...newProject,
      id: Date.now(),
      createdBy: user?.id,
      createdAt: new Date().toISOString(),
      image: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(newProject.category)}`
    };

    // Call onProjectCreated callback
    if (onProjectCreated) {
      onProjectCreated(project);
    }

    // Reset form
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
      learningOutcomes: []
    });

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
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Պրոեկտի վերնագիր</Label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Մուտքագրեք պրոեկտի վերնագիրը"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Կատեգորիա</Label>
              <Input
                id="category"
                value={newProject.category}
                onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Օրինակ՝ Վեբ ծրագրավորում"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="complexity">Բարդություն</Label>
              <Select
                value={newProject.complexity}
                onValueChange={(value: 'Սկսնակ' | 'Միջին' | 'Առաջադեմ') => 
                  setNewProject(prev => ({ ...prev, complexity: value }))
                }
              >
                <SelectTrigger id="complexity" className="mt-1">
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
                id="duration"
                value={newProject.duration}
                onChange={(e) => setNewProject(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="Օրինակ՝ 6 շաբաթ"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Համառոտ նկարագրություն</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Մուտքագրեք պրոեկտի համառոտ նկարագրությունը"
                className="mt-1 resize-none"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="detailedDescription">Մանրամասն նկարագրություն</Label>
              <Textarea
                id="detailedDescription"
                value={newProject.detailedDescription}
                onChange={(e) => setNewProject(prev => ({ ...prev, detailedDescription: e.target.value }))}
                placeholder="Մուտքագրեք պրոեկտի մանրամասն նկարագրությունը"
                className="mt-1 resize-none"
                rows={6}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="techStack">Տեխնոլոգիաներ</Label>
            <div className="flex mt-1 gap-2">
              <Input
                id="techStack"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                placeholder="Օրինակ՝ React"
                className="flex-grow"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              />
              <Button type="button" onClick={handleAddTech} size="icon">
                <PlusCircle size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newProject.techStack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  {tech}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-secondary/80"
                    onClick={() => handleRemoveTech(tech)}
                  >
                    <X size={10} />
                  </Button>
                </Badge>
              ))}
              {newProject.techStack.length === 0 && (
                <span className="text-sm text-muted-foreground">Դեռևս տեխնոլոգիաներ չկան։ Ավելացրեք առնվազն մեկը։</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="steps">Իրականացման քայլեր</Label>
            <div className="flex mt-1 gap-2">
              <Textarea
                id="steps"
                value={currentStep}
                onChange={(e) => setCurrentStep(e.target.value)}
                placeholder="Նկարագրեք իրականացման քայլը"
                className="flex-grow resize-none"
                rows={2}
              />
              <Button type="button" onClick={handleAddStep} className="h-auto">
                <PlusCircle size={16} />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {newProject.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-2 border border-input rounded-md p-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="flex-grow text-sm">{step}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveStep(index)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
              {newProject.steps.length === 0 && (
                <span className="text-sm text-muted-foreground block p-2">Դեռևս քայլեր չկան։ Ավելացրեք իրականացման քայլերը։</span>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="prerequisites">Նախապայմաններ</Label>
              <div className="flex mt-1 gap-2">
                <Input
                  id="prerequisites"
                  value={currentPrereq}
                  onChange={(e) => setCurrentPrereq(e.target.value)}
                  placeholder="Օրինակ՝ JavaScript հիմունքներ"
                  className="flex-grow"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrereq())}
                />
                <Button type="button" onClick={handleAddPrereq} size="icon">
                  <PlusCircle size={16} />
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {newProject.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <span className="text-sm flex-grow">{prereq}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemovePrereq(prereq)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                {newProject.prerequisites.length === 0 && (
                  <span className="text-sm text-muted-foreground">Դեռևս նախապայմաններ չկան։</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="learningOutcomes">Սովորելու արդյունքներ</Label>
              <div className="flex mt-1 gap-2">
                <Input
                  id="learningOutcomes"
                  value={currentOutcome}
                  onChange={(e) => setCurrentOutcome(e.target.value)}
                  placeholder="Ինչ կսովորի ուսանողը"
                  className="flex-grow"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                />
                <Button type="button" onClick={handleAddOutcome} size="icon">
                  <PlusCircle size={16} />
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {newProject.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <span className="text-sm flex-grow">{outcome}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveOutcome(outcome)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
                {newProject.learningOutcomes.length === 0 && (
                  <span className="text-sm text-muted-foreground">Դեռևս արդյունքներ չկան։</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="default" onClick={handleCreateProject}>
          Ստեղծել պրոեկտը
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCreation;
