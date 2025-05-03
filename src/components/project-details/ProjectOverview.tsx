import React, { useState, useEffect } from 'react';
import { Clock, Tag, Users, Building, FileText, Calendar, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ProjectTheme } from '@/data/projectThemes';
import { formatDate } from '@/lib/utils';
import ProjectProgressSummary from './ProjectProgressSummary';
import ProjectMembers from '@/components/projects/ProjectMembers';
import { useProject } from '@/contexts/project';
import EditableField from '@/components/common/EditableField';

interface ProjectOverviewProps {
  project: ProjectTheme;
  projectMembers?: { id: string; name: string; role: string; avatar: string; }[];
  organization?: {
    id: string;
    name: string;
    website: string;
    logo: string;
  } | null;
  similarProjects: ProjectTheme[];
  isEditing: boolean;
  onSaveChanges: (updates: Partial<ProjectTheme>) => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  project,
  similarProjects,
  isEditing,
  onSaveChanges
}) => {
  // Get data from context
  const { 
    projectMembers, 
    organization,
    updateOrganization,
    updateProjectMembers 
  } = useProject();
  
  // Local state for edited fields
  const [title, setTitle] = useState(project.title || '');
  const [description, setDescription] = useState(project.description || '');
  const [detailedDescription, setDetailedDescription] = useState(project.detailedDescription || '');
  const [techStack, setTechStack] = useState<string[]>(project.techStack || []);
  const [category, setCategory] = useState(project.category || '');
  const [complexity, setComplexity] = useState(project.complexity || 'Միջին');
  const [duration, setDuration] = useState(project.duration || '');
  const [techInput, setTechInput] = useState('');
  
  // Update local state when project changes
  useEffect(() => {
    setTitle(project.title || '');
    setDescription(project.description || '');
    setDetailedDescription(project.detailedDescription || '');
    setTechStack(project.techStack || []);
    setCategory(project.category || '');
    setComplexity(project.complexity || 'Միջին');
    setDuration(project.duration || '');
  }, [project]);
  
  const handleSaveChanges = () => {
    onSaveChanges({
      title,
      description,
      detailedDescription,
      techStack,
      category,
      complexity,
      duration
    });
  };
  
  const handleAddTech = () => {
    if (techInput && !techStack.includes(techInput)) {
      setTechStack([...techStack, techInput]);
      setTechInput('');
    }
  };
  
  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech));
  };
  
  // Handle organization update
  const handleOrganizationChange = (name: string) => {
    if (organization) {
      updateOrganization({
        ...organization,
        name
      });
    }
  };
  
  // Calculate progress (should ideally come from project data)
  const progress = project.tasks 
    ? (project.tasks.filter(t => ['done', 'completed'].includes(t.status)).length / project.tasks.length) * 100
    : 0;
  
  const completedTasks = project.tasks 
    ? project.tasks.filter(t => ['done', 'completed'].includes(t.status)).length
    : 0;
  
  const totalTasks = project.tasks ? project.tasks.length : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Main content area */}
      <div className="md:col-span-2 space-y-8">
        <section className="bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h2 className="text-2xl font-bold mb-4">Նախագծի նկարագրություն</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Վերնագիր</label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Մուտքագրեք նախագծի վերնագիրը"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Կարճ նկարագրություն</label>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Մուտքագրեք նախագծի համառոտ նկարագրությունը"
                  className="w-full"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Մանրամասն նկարագրություն</label>
                <Textarea 
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  placeholder="Մուտքագրեք նախագծի մանրամասն նկարագրությունը"
                  className="w-full"
                  rows={6}
                />
              </div>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">{description}</p>
              <div className="whitespace-pre-wrap">
                {detailedDescription || "Այս նախագիծը դեռ չունի մանրամասն նկարագրություն։"}
              </div>
            </div>
          )}
        </section>
        
        <section className="bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h2 className="text-2xl font-bold mb-4">Տեխնիկական մանրամասներ</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Կատեգորիա</label>
                  <Input 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Օր.՝ Վեբ, Մոբայլ, AI"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Բարդություն</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Սկսնակ">Սկսնակ</option>
                    <option value="Միջին">Միջին</option>
                    <option value="Առաջադեմ">Առաջադեմ</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Տևողություն</label>
                  <Input 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Օր.՝ 2 շաբաթ, 1 ամիս"
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Տեխնոլոգիաներ</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {tech}
                      <button 
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => handleRemoveTech(tech)}
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Նոր տեխնոլոգիա"
                    className="flex-grow"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTech}>Ավելացնել</Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Պահպանել փոփոխությունները
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Tag className="mt-1 text-muted-foreground" size={18} />
                  <div>
                    <p className="text-sm font-medium">Կատեգորիա</p>
                    <p className="text-sm text-muted-foreground">
                      {category || 'Չնշված'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <FileText className="mt-1 text-muted-foreground" size={18} />
                  <div>
                    <p className="text-sm font-medium">Բարդություն</p>
                    <p className="text-sm text-muted-foreground">
                      {complexity || 'Միջին'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Clock className="mt-1 text-muted-foreground" size={18} />
                  <div>
                    <p className="text-sm font-medium">Տևողություն</p>
                    <p className="text-sm text-muted-foreground">
                      {duration || 'Չնշված'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-2">Օգտագործված տեխնոլոգիաներ</h3>
                <div className="flex flex-wrap gap-1.5">
                  {techStack && techStack.length > 0 ? (
                    techStack.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="px-2 py-1">
                        {tech}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Տեխնոլոգիաներ չեն նշված</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* Project Team Section */}
        <section className="bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h2 className="text-2xl font-bold mb-4">Նախագծի թիմ</h2>
          <ProjectMembers 
            isEditing={isEditing}
            members={projectMembers} 
          />
        </section>
        
        {/* Organization Section */}
        {organization && (
          <section className="bg-card rounded-xl shadow-md p-6 border border-border/30">
            <h2 className="text-2xl font-bold mb-4">Պատվիրատու կազմակերպություն</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img 
                  src={organization.logo || 'https://via.placeholder.com/64'} 
                  alt={organization.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div>
                {isEditing ? (
                  <EditableField 
                    value={organization.name}
                    onChange={handleOrganizationChange}
                    placeholder="Մուտքագրեք կազմակերպության անունը"
                  />
                ) : (
                  <p className="text-lg font-semibold">{organization.name}</p>
                )}
                <a 
                  href={organization.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-600 hover:underline"
                >
                  {organization.website}
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
      
      {/* Sidebar */}
      <div className="space-y-6">
        <section className="bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h3 className="text-xl font-bold mb-4">Նախագծի առաջընթաց</h3>
          <ProjectProgressSummary 
            progress={progress}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
          />
        </section>
        
        <section className="bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h3 className="text-xl font-bold mb-4">Նմանատիպ նախագծեր</h3>
          {similarProjects.length > 0 ? (
            <div className="space-y-4">
              {similarProjects.map((project, index) => (
                <div key={index} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <a href={`/project/${project.id}`} className="block">
                    <h4 className="font-semibold">{project.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Նմանատիպ նախագծեր չեն գտնվել</p>
          )}
        </section>
        
        <section className="bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h3 className="text-xl font-bold mb-4">Նախագծի մասին</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 text-muted-foreground" size={16} />
              <div>
                <p className="text-sm font-medium">Ստեղծվել է</p>
                <p className="text-sm text-muted-foreground">
                  {project.createdAt ? formatDate(project.createdAt) : 'Չնշված'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <GraduationCap className="mt-0.5 text-muted-foreground" size={16} />
              <div>
                <p className="text-sm font-medium">Ուսումնական արդյունքներ</p>
                <ul className="text-sm text-muted-foreground list-disc ml-5">
                  {project.learningOutcomes && project.learningOutcomes.length > 0 ? (
                    project.learningOutcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
                    ))
                  ) : (
                    <li>Ուսումնական արդյունքներ չեն նշված</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectOverview;
