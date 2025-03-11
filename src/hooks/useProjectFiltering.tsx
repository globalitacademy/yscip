
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseProjectFilteringProps {
  initialProjects: any[];
  limit?: number;
  createdProjects?: any[];
}

const useProjectFiltering = ({
  initialProjects,
  limit = 6,
  createdProjects = []
}: UseProjectFilteringProps) => {
  const [displayLimit, setDisplayLimit] = useState(limit);
  const { user } = useAuth();
  const [allProjects, setAllProjects] = useState([...initialProjects]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  const categories = ["all", ...new Set(initialProjects.map(project => project.category))];
  
  // Load assignments
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
  
  // Load reserved projects
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
  
  // Merge created projects
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
      
      const mergedProjects = [...initialProjects];
      
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
  }, [createdProjects, initialProjects]);
  
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
  
  // Filter by category
  const categoryFilteredProjects = activeCategory === "all" 
    ? filteredProjects 
    : filteredProjects.filter(project => project.category === activeCategory);
  
  // Get projects to display based on limit
  const displayedProjects = categoryFilteredProjects.slice(0, displayLimit);
  
  // Load more handler
  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + 6, categoryFilteredProjects.length));
  };
  
  const hasMore = displayLimit < categoryFilteredProjects.length;

  // Get the count of reserved projects for the current user
  const userReservedProjectsCount = user?.role === 'student' 
    ? reservedProjects.filter(r => r.userId === user.id).length 
    : 0;

  return {
    displayedProjects,
    categories,
    activeCategory,
    setActiveCategory,
    hasMore,
    loadMore,
    displayLimit,
    setDisplayLimit,
    limit,
    categoryFilteredProjects,
    userReservedProjectsCount
  };
};

export default useProjectFiltering;
