
import React from 'react';
import { useParams } from 'react-router-dom';
import { projectThemes } from '@/data/projectThemes';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image as ImageIcon, 
  List, 
  Check,
  Book,
  User
} from 'lucide-react';
import { SlideUp } from '@/components/LocalTransitions';
import { useToast } from '@/components/ui/use-toast';

const ProjectDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const project = projectThemes.find(p => p.id === Number(id));

  if (!project) {
    return <div>Պրոեկտը չի գտնվել</div>;
  }

  const handleReserve = () => {
    // In a real app, this would make an API call to reserve the project
    toast({
      title: "Պրոեկտն ամրագրված է",
      description: "Դուք հաջողությամբ ամրագրել եք այս պրոեկտը։",
    });
  };

  const placeholderImage = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <SlideUp>
            <div className="space-y-8">
              {/* Header Section */}
              <div className="space-y-4">
                <Badge variant="outline" className={
                  project.complexity === 'Սկսնակ' ? 'bg-green-500/10 text-green-600 border-green-200' :
                  project.complexity === 'Միջին' ? 'bg-amber-500/10 text-amber-600 border-amber-200' :
                  'bg-red-500/10 text-red-600 border-red-200'
                }>
                  {project.complexity}
                </Badge>
                <h1 className="text-4xl font-bold">{project.title}</h1>
                <p className="text-lg text-muted-foreground">{project.description}</p>
              </div>

              {/* Project Image */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                <img 
                  src={placeholderImage}
                  alt={project.title}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Tech Stack Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  <h2 className="text-xl font-semibold">Տեխնոլոգիաներ</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Implementation Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <List size={20} className="text-primary" />
                  <h2 className="text-xl font-semibold">Իրականացման քայլեր</h2>
                </div>
                <div className="space-y-3">
                  {project.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                      <Check size={20} className="text-primary flex-shrink-0 mt-1" />
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Similar Projects */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Book size={20} className="text-primary" />
                  <h2 className="text-xl font-semibold">Նմանատիպ պրոեկտներ</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectThemes
                    .filter(p => p.category === project.category && p.id !== project.id)
                    .slice(0, 2)
                    .map((similarProject) => (
                      <div key={similarProject.id} className="p-4 rounded-lg border bg-card">
                        <h3 className="font-medium mb-2">{similarProject.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {similarProject.description}
                        </p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Reserve Project Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  size="lg" 
                  onClick={handleReserve}
                  className="gap-2"
                >
                  <User size={20} />
                  Ամրագրել պրոեկտը
                </Button>
              </div>
            </div>
          </SlideUp>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
