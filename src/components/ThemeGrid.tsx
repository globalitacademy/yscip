
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Tag, GraduationCap } from 'lucide-react';
import { projectThemes } from '@/data/projectThemes';
import ProjectCard from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/LocalTransitions';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  
  // Extract unique categories from projects
  const categories = ["all", ...new Set(projectThemes.map(project => project.category))];
  
  // Load reserved projects
  useEffect(() => {
    if (user) {
      try {
        const reservedData = localStorage.getItem('reservedProjects');
        if (reservedData) {
          const reservations = JSON.parse(reservedData);
          // Filter reservations for the current user
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
  
  // Merge projectThemes with createdProjects when component mounts or createdProjects changes
  useEffect(() => {
    if (createdProjects && createdProjects.length > 0) {
      // Convert project themes to ensure consistent format
      const formattedCreatedProjects = createdProjects.map(project => ({
        ...project,
        id: project.id || Date.now() + Math.random(), // Ensure unique ID
        complexity: project.complexity || 'Միջին',
        techStack: project.techStack || [],
        steps: project.steps || [],
        category: project.category || 'Այլ',
      }));
      
      // Merge arrays, avoiding duplicates by ID
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
  
  // Get assigned projects data
  const getProjectAssignments = () => {
    try {
      const assignmentsData = localStorage.getItem('projectAssignments');
      if (assignmentsData) {
        return JSON.parse(assignmentsData) || [];
      }
    } catch (e) {
      console.error('Error loading project assignments:', e);
    }
    return [];
  };
  
  // Filter projects based on user role and permissions
  const getFilteredProjects = () => {
    if (!user) return allProjects;
    
    const assignments = getProjectAssignments();
    
    if (user.role === 'student') {
      // Students see assigned projects and their reservations
      const reservedIds = reservedProjects.map(r => r.projectId);
      const assignedIds = assignments
        .filter((a: any) => a.studentId === user.id)
        .map((a: any) => a.projectId);
      
      const userProjectIds = [...reservedIds, ...assignedIds];
      return allProjects.filter(p => userProjectIds.includes(p.id));
    } 
    else if (user.role === 'instructor') {
      // Instructors see assigned projects and created projects
      const instructorProjects = allProjects.filter(p => 
        (p.createdBy && p.createdBy === user.id) || 
        (user.assignedProjects && user.assignedProjects.includes(p.id))
      );
      
      // Also show projects assigned to students by this instructor
      const assignedByInstructor = assignments
        .filter((a: any) => a.assignedBy === user.id)
        .map((a: any) => a.projectId);
      
      return instructorProjects.concat(
        allProjects.filter(p => assignedByInstructor.includes(p.id) && !instructorProjects.some(ip => ip.id === p.id))
      );
    }
    else if (user.role === 'supervisor') {
      // Supervisors see projects for their supervised students
      if (!user.supervisedStudents || user.supervisedStudents.length === 0) {
        return allProjects;
      }
      
      const studentProjectIds = assignments
        .filter((a: any) => user.supervisedStudents?.includes(a.studentId))
        .map((a: any) => a.projectId);
      
      return allProjects.filter(p => 
        (p.createdBy && p.createdBy === user.id) || studentProjectIds.includes(p.id)
      );
    }
    
    // Admins see all projects
    return allProjects;
  };
  
  const filteredProjects = getFilteredProjects();
  
  // Filter projects by category
  const categoryFilteredProjects = activeCategory === "all" 
    ? filteredProjects 
    : filteredProjects.filter(project => project.category === activeCategory);
  
  const themes = categoryFilteredProjects.slice(0, displayLimit);
  
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, categoryFilteredProjects.length));
  };
  
  const hasMore = displayLimit < categoryFilteredProjects.length;
  
  return (
    <div className="mt-12 text-left">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Ծրագրերի թեմաներն ըստ կատեգորիաների</h2>
        <Tabs defaultValue="all">
          <div className="overflow-x-auto pb-2">
            <TabsList className="mb-6 h-auto p-1">
              {categories.map((category) => (
                <TabsTrigger 
                  key={category}
                  value={category} 
                  onClick={() => {
                    setActiveCategory(category);
                    setDisplayLimit(limit || 6);
                  }}
                  className={`px-4 py-2 ${activeCategory === category ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {category === "all" ? "Բոլորը" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        
          <div className="flex flex-wrap items-center gap-2 mb-4">
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
                {reservedProjects.length} ամրագրված նախագիծ
              </Badge>
            )}
          </div>
        </Tabs>
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
        
        <Link to="/">
          <Button variant="default" size="lg" className="group">
            Բոլոր թեմաները
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ThemeGrid;
