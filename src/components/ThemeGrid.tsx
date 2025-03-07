import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [displayLimit, setDisplayLimit] = useState(limit || 6);
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState([...projectThemes]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  const categories = ["all", ...new Set(projectThemes.map(project => project.category))];
  
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      if (event.detail && event.detail.category) {
        setActiveCategory(event.detail.category);
        setDisplayLimit(limit || 6);
      }
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
    
    window.addEventListener('categoryChanged', handleCategoryChange as EventListener);
    
    return () => {
      window.removeEventListener('categoryChanged', handleCategoryChange as EventListener);
    };
  }, [limit, categories]);
  
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
    <div id="themes-section" className="mt-12 text-left">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ծրագրերի թեմաներն ըստ կատեգորիաների</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Select
            value={activeCategory}
            onValueChange={(value) => {
              setActiveCategory(value);
              setDisplayLimit(limit || 6);
              
              const url = new URL(window.location.href);
              if (value === 'all') {
                url.searchParams.delete('category');
              } else {
                url.searchParams.set('category', value);
              }
              window.history.pushState({}, '', url);
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px] bg-background">
              <SelectValue placeholder="Ընտրեք կատեգորիան" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all" className="flex items-center gap-2">
                <Layers size={14} className="opacity-80" />
                <span>Բոլորը</span>
              </SelectItem>
              {categories.filter(cat => cat !== "all").map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-muted flex items-center gap-1">
              <Tag size={14} />
              {categoryFilteredProjects.length} նախագիծ
            </Badge>
            
            {user && (
              <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1">
                {user.role === 'student' ? (
                  <>
                    <GraduationCap size={14} />
                    Ուսանող {user.course && user.group ? `(${user.course}-րդ կուրս, ${user.group})` : ''}
                  </>
                ) : user.role === 'instructor' ? (
                  <>
                    <BookOpen size={14} />
                    Դասախոս
                  </>
                ) : user.role === 'supervisor' ? (
                  <>
                    <Users size={14} />
                    Ղեկավար
                  </>
                ) : (
                  'Ադմինիստրատոր'
                )}
              </Badge>
            )}
            
            {user && user.role === 'student' && (
              <Badge variant="secondary">
                {reservedProjects.filter(r => r.userId === user.id).length} ամրագրված նախագիծ
              </Badge>
            )}
          </div>
        </div>

        <FadeIn className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {themes.map((theme) => (
            <ProjectCard
              key={theme.id}
              project={theme}
            />
          ))}
        </FadeIn>
        
        {themes.length === 0 && (
          <div className="text-center p-10 bg-muted rounded-lg">
            <p className="text-muted-foreground">Այս կատեգորիայում ծրագրեր չկան</p>
          </div>
        )}
        
        <div className="flex justify-center space-x-4 mt-8">
          {hasMore && (
            <Button onClick={loadMore} variant="outline" size="lg">
              Տեսնել ավելին
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeGrid;
