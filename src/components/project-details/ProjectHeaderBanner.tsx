
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart, Edit, Copy, Trash2, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { deleteProject, updateProject } from '@/services/projectService';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { useProject } from '@/contexts/ProjectContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProjectHeaderBannerProps {
  title: string;
  description: string;
  complexity: string;
  techStack: string[];
  projectId?: number;
}

const ProjectHeaderBanner: React.FC<ProjectHeaderBannerProps> = ({
  title,
  description,
  complexity,
  techStack,
  projectId
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { handleEditInit } = useProjectManagement();
  const { canEdit, project, setIsEditing, isEditing } = useProject();
  
  // State for inline editing
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedComplexity, setEditedComplexity] = useState(complexity);
  const [editedTechStack, setEditedTechStack] = useState<string>(techStack.join(', '));
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Սկսնակ':
        return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Միջին':
        return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'Առաջադեմ':
        return 'bg-red-500/10 text-red-600 border-red-200';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };
  
  const complexityColor = getComplexityColor(complexity);
  
  const handleToggleEdit = () => {
    if (!isEditing) {
      // Initialize edit state
      setEditedTitle(title);
      setEditedDescription(description);
      setEditedComplexity(complexity);
      setEditedTechStack(techStack.join(', '));
    }
    setIsEditing(!isEditing);
  };
  
  const handleSaveChanges = async () => {
    if (!projectId) {
      toast({
        title: "Սխալ",
        description: "Նախագծի ID-ն բացակայում է։",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const processedTechStack = editedTechStack
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);
      
      const updatedData = {
        title: editedTitle,
        description: editedDescription,
        complexity: editedComplexity,
        techStack: processedTechStack,
        updatedAt: new Date().toISOString(),
      };
      
      const success = await updateProject(projectId, updatedData);
      
      if (success) {
        toast({
          title: "Թարմացում",
          description: "Նախագիծը հաջողությամբ թարմացվել է։",
        });
        setIsEditing(false);
        
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast({
        title: "Սխալ",
        description: "Նախագծի թարմացման ժամանակ սխալ է տեղի ունեցել։",
        variant: "destructive",
      });
    }
  };
  
  const handleCopy = async () => {
    if (!projectId) {
      toast({
        title: "Սխալ",
        description: "Նախագծի ID-ն բացակայում է։",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const newTitle = `${title} (Պատճեն)`;
      const copyData = {
        title: newTitle,
        description,
        complexity,
        techStack,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const success = await updateProject(projectId, copyData);
      
      if (success) {
        toast({
          title: "Պատճենում",
          description: "Նախագիծը հաջողությամբ պատճենվել է։",
        });
      } else {
        throw new Error("Failed to copy project");
      }
    } catch (error) {
      console.error("Error copying project:", error);
      toast({
        title: "Սխալ",
        description: "Նախագծի պատճենման ժամանակ սխալ է տեղի ունեցել։",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async () => {
    if (!projectId) {
      toast({
        title: "Սխալ",
        description: "Նախագծի ID-ն բացակայում է։",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await deleteProject(projectId);
      
      if (success) {
        toast({
          title: "Ջնջում",
          description: "Նախագիծը հաջողությամբ ջնջվել է։",
        });
        
        navigate('/projects');
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Սխալ",
        description: "Նախագծի ջնջման ժամանակ սխալ է տեղի ունեցել։",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Վերադառնալ բոլոր պրոեկտների ցանկին
        </Link>
        
        {canEdit && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSaveChanges}
                  className="hidden sm:flex"
                >
                  <Save size={16} className="mr-2" /> Պահպանել
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleToggleEdit}
                  className="hidden sm:flex"
                >
                  <X size={16} className="mr-2" /> Չեղարկել
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleToggleEdit}
                  className="hidden sm:flex"
                >
                  <Edit size={16} className="mr-2" /> Խմբագրել
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy}
                  className="hidden sm:flex"
                >
                  <Copy size={16} className="mr-2" /> Պատճենել
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="hidden sm:flex"
                >
                  <Trash2 size={16} className="mr-2" /> Ջնջել
                </Button>
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="sm:hidden">
                <Button variant="outline" size="icon">
                  <Edit size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isEditing ? (
                  <>
                    <DropdownMenuItem onClick={handleSaveChanges}>
                      <Save size={16} className="mr-2" /> Պահպանել
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleToggleEdit}>
                      <X size={16} className="mr-2" /> Չեղարկել
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={handleToggleEdit}>
                      <Edit size={16} className="mr-2" /> Խմբագրել
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy}>
                      <Copy size={16} className="mr-2" /> Պատճենել
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 size={16} className="mr-2" /> Ջնջել
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      {isEditing ? (
        <>
          <div className="mb-4">
            <Input 
              value={editedTitle} 
              onChange={(e) => setEditedTitle(e.target.value)} 
              className="text-2xl font-bold mb-2"
              placeholder="Նախագծի վերնագիր"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-muted-foreground flex items-center">
              <BarChart size={16} className="mr-1" />
              Բարդություն:
            </span>
            <Select value={editedComplexity} onValueChange={setEditedComplexity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ընտրել բարդությունը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Սկսնակ">Սկսնակ</SelectItem>
                <SelectItem value="Միջին">Միջին</SelectItem>
                <SelectItem value="Առաջադեմ">Առաջադեմ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea 
            value={editedDescription} 
            onChange={(e) => setEditedDescription(e.target.value)} 
            className="text-lg mb-4"
            placeholder="Նախագծի նկարագրություն"
            rows={4}
          />
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Տեխնոլոգիաներ (բաժանված ստորակետներով)</label>
            <Input 
              value={editedTechStack} 
              onChange={(e) => setEditedTechStack(e.target.value)} 
              className="mb-2"
              placeholder="React, Node.js, MongoDB, ..."
            />
            <p className="text-sm text-muted-foreground">Օրինակ՝ React, TypeScript, Node.js</p>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="text-muted-foreground flex items-center">
              <BarChart size={16} className="mr-1" />
              Բարդություն:
            </span>
            <Badge variant="outline" className={cn("font-medium", complexityColor)}>
              {complexity}
            </Badge>
          </div>
          
          <p className="text-lg text-muted-foreground mb-6">{description}</p>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {techStack.map((tech, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Հաստատեք ջնջումը</AlertDialogTitle>
            <AlertDialogDescription>
              Իսկապե՞ս ցանկանում եք ջնջել այս նախագիծը։ Այս գործողությունը հնարավոր չէ հետադարձել։
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ջնջել
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectHeaderBanner;
