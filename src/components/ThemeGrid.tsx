
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Tag, GraduationCap, Layers, ChevronDown } from 'lucide-react';
import { projectThemes } from '@/data/projectThemes';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getProjectImage } from '@/lib/getProjectImage';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeGridProps {
  limit?: number;
  createdProjects?: any[];
}

const ThemeGrid: React.FC<ThemeGridProps> = ({ limit, createdProjects = [] }) => {
  const [displayLimit, setDisplayLimit] = useState(limit || 6);
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState([...projectThemes]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  const categories = ["all", ...new Set(projectThemes.map(project => project.category))];
  
  useEffect(() => {
    try {
      const assignmentsData = localStorage.getItem('projectAssignments');
      if (assignmentsData) {
        const parsedAssignments = JSON.parse(assignmentsData);
        setAssignments(parsedAssignments || []);
      }
    } catch (e) {
      console.error('Error loading project assignments:', e);
      setAssignments([]);
    }
  }, []);
  
  useEffect(() => {
    if (user) {
      try {
        const reservedData = localStorage.getItem('reservedProjects');
        if (reservedData) {
          const reservations = JSON.parse(reservedData);
          const userReservations = user.role === 'student' 
            ? reservations.filter((res: any) => res.userId === user.id)
            : reservations;
          
          setReservedProjects(userReservations);
        }
      } catch (e) {
        console.error('Error loading reserved projects:', e);
      }
    }
  }, [user]);
  
  useEffect(() => {
    if (createdProjects && createdProjects.length > 0) {
      const formattedCreatedProjects = createdProjects.map(project => ({
        ...project,
        id: project.id || Date.now() + Math.random(),
        complexity: project.complexity || 'Միջին',
        techStack: project.techStack || [],
        steps: project.steps || [],
        category: project.category || 'Այլ',
      }));
      
      const mergedProjects = [...projectThemes];
      
      formattedCreatedProjects.forEach(newProject => {
        const existingIndex = mergedProjects.findIndex(p => p.id === newProject.id);
        if (existingIndex >= 0) {
          mergedProjects[existingIndex] = newProject;
        } else {
          mergedProjects.push(newProject);
        }
      });
      
      setAllProjects(mergedProjects);
    }
  }, [createdProjects]);
  
  const getFilteredProjects = () => {
    if (!user) return allProjects;
    
    if (user.role === 'student') {
      const reservedIds = reservedProjects
        .filter(r => r.userId === user.id)
        .map(r => Number(r.projectId));
        
      const assignedIds = assignments
        .filter((a: any) => a.studentId === user.id)
        .map((a: any) => Number(a.projectId));
      
      const userProjectIds = [...new Set([...reservedIds, ...assignedIds])];
      
      if (userProjectIds.length > 0) {
        return allProjects.filter(p => userProjectIds.includes(Number(p.id)));
      }
      
      return allProjects;
    } 
    else if (user.role === 'instructor') {
      const instructorProjects = allProjects.filter(p => 
        (p.createdBy && p.createdBy === user.id) || 
        (user.assignedProjects && user.assignedProjects.includes(Number(p.id)))
      );
      
      const assignedByInstructor = assignments
        .filter((a: any) => a.assignedBy === user.id)
        .map((a: any) => Number(a.projectId));
      
      const combinedProjectIds = [...new Set([
        ...instructorProjects.map(p => Number(p.id)),
        ...assignedByInstructor
      ])];
      
      return allProjects.filter(p => combinedProjectIds.includes(Number(p.id)));
    }
    else if (user.role === 'supervisor') {
      if (!user.supervisedStudents || user.supervisedStudents.length === 0) {
        return allProjects;
      }
      
      const studentProjectIds = assignments
        .filter((a: any) => user.supervisedStudents?.includes(a.studentId))
        .map((a: any) => Number(a.projectId));
      
      const supervisorProjects = allProjects.filter(p => 
        (p.createdBy && p.createdBy === user.id) || studentProjectIds.includes(Number(p.id))
      );
      
      return supervisorProjects.length > 0 ? supervisorProjects : allProjects;
    }
    
    return allProjects;
  };
  
  const filteredProjects = getFilteredProjects();
  
  const categoryFilteredProjects = activeCategory === "all" 
    ? filteredProjects 
    : filteredProjects.filter(project => project.category === activeCategory);
  
  const themes = categoryFilteredProjects.slice(0, displayLimit);
  
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, categoryFilteredProjects.length));
  };
  
  const hasMore = displayLimit < categoryFilteredProjects.length;
  
  return (
    <div className="mt-6 sm:mt-12 text-left" id="themes-section">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Ծրագրերի թեմաներն ըստ կատեգորիաների</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Select
            defaultValue="all"
            onValueChange={(value) => {
              setActiveCategory(value);
              setDisplayLimit(limit || 6);
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px] bg-background text-sm">
              <SelectValue placeholder="Ընտրեք կատեգորիան" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all" className="flex items-center gap-2 text-sm">
                <Layers size={14} className="opacity-80" />
                <span>Բոլորը</span>
              </SelectItem>
              {categories.filter(cat => cat !== "all").map((category) => (
                <SelectItem key={category} value={category} className="text-sm">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-muted flex items-center gap-1 text-xs">
              <Tag size={12} />
              {categoryFilteredProjects.length} նախագիծ
            </Badge>
            
            {user && (
              <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1 text-xs">
                {user.role === 'student' ? (
                  <>
                    <GraduationCap size={12} />
                    Ուսանող {user.course && user.group ? `(${user.course}-րդ կուրս, ${user.group})` : ''}
                  </>
                ) : user.role === 'instructor' ? (
                  <>
                    <BookOpen size={12} />
                    Դասախոս
                  </>
                ) : user.role === 'supervisor' ? (
                  <>
                    <Users size={12} />
                    Ղեկավար
                  </>
                ) : (
                  'Ադմինիստրատոր'
                )}
              </Badge>
            )}
            
            {user && user.role === 'student' && (
              <Badge variant="secondary" className="text-xs">
                {reservedProjects.filter(r => r.userId === user.id).length} ամրագրված նախագիծ
              </Badge>
            )}
          </div>
        </div>

        <FadeIn className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-10">
          {themes.map((theme) => (
            <ProjectCard
              key={theme.id}
              project={theme}
            />
          ))}
        </FadeIn>
        
        {themes.length === 0 && (
          <div className="text-center p-6 sm:p-10 bg-muted rounded-lg">
            <p className="text-muted-foreground text-sm sm:text-base">Այս կատեգորիայում ծրագրեր չկան</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
          {hasMore && (
            <Button onClick={loadMore} variant="outline" size="default" className="w-full sm:w-auto text-sm">
              Տեսնել ավելին
            </Button>
          )}
          
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="default" size="default" className="group w-full text-sm">
              Բոլոր թեմաները
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThemeGrid;
