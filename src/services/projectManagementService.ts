import { ProjectTheme, Task, TimelineEvent } from '@/data/projectThemes';
import { projectThemes } from '@/data/projectThemes';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to map database project to ProjectTheme
const mapDbProjectToProjectTheme = (dbProject: any): ProjectTheme => {
  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    category: dbProject.category,
    image: dbProject.image,
    techStack: dbProject.tech_stack || [],
    difficulty: dbProject.difficulty || 'medium',
    duration: dbProject.duration || '',
    createdBy: dbProject.created_by,
    is_public: dbProject.is_public,
    organizationName: dbProject.organization_name,
    goal: dbProject.goal,
    resources: dbProject.resources || [],
    links: dbProject.links || [],
    detailedDescription: dbProject.detailed_description,
    requirements: dbProject.requirements || [],
    steps: dbProject.steps || [],
    prerequisites: dbProject.prerequisites || [],
    learningOutcomes: dbProject.learning_outcomes || [],
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at,
    complexity: dbProject.complexity || 'Միջին'
  };
};

// Helper function to map timeline events
const mapDbTimelineEventsToTimelineEvents = (dbEvents: any[]): TimelineEvent[] => {
  return dbEvents.map(event => ({
    id: String(event.id),
    title: event.title,
    date: event.date,
    isCompleted: event.completed,
    description: event.description
  }));
};

// Helper function to map tasks
const mapDbTasksToTasks = (dbTasks: any[]): Task[] => {
  return dbTasks.map(task => ({
    id: String(task.id),
    title: task.title,
    description: task.description,
    assignedTo: task.assigned_to,
    status: task.status as Task['status'],
    createdAt: task.created_at,
    completedAt: task.completed_at
  }));
};

/**
 * Get all projects
 */
export const getAllProjects = async (): Promise<ProjectTheme[]> => {
  try {
    // If Supabase is available, try to get projects from the database
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Map database results to ProjectTheme objects
      if (data) {
        return data.map(dbProject => mapDbProjectToProjectTheme(dbProject));
      }
    }
    
    // Fallback to local data
    return projectThemes;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback to local data
    return projectThemes;
  }
};

/**
 * Get a project by ID
 */
export const getProjectById = async (id: number): Promise<ProjectTheme | null> => {
  try {
    // If Supabase is available, try to get the project from the database
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*, timeline_events(*), tasks(*)')
        .eq('id', id)
        .single();
      
      if (error) {
        // If not found in database, try to find in local data
        const localProject = projectThemes.find(p => p.id === id);
        if (localProject) return localProject;
        throw error;
      }
      
      if (data) {
        const project = mapDbProjectToProjectTheme(data);
        
        // Add timeline events and tasks if available
        if (data.timeline_events) {
          project.timeline = mapDbTimelineEventsToTimelineEvents(data.timeline_events);
        }
        
        if (data.tasks) {
          project.tasks = mapDbTasksToTasks(data.tasks);
        }
        
        return project;
      }
    }
    
    // Fallback to local data
    return projectThemes.find(p => p.id === id) || null;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    // Fallback to local data
    return projectThemes.find(p => p.id === id) || null;
  }
};

/**
 * Create a new project
 */
export const createProject = async (project: Partial<ProjectTheme>, userId?: string): Promise<ProjectTheme> => {
  try {
    const newProject = {
      ...project,
      id: Math.max(0, ...projectThemes.map(p => p.id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId || 'user_id',
      techStack: project.techStack || [],
      is_public: project.is_public || false,
      difficulty: project.difficulty || 'medium'
    } as ProjectTheme;
    
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.title,
          description: newProject.description,
          category: newProject.category,
          image: newProject.image,
          tech_stack: newProject.techStack,
          difficulty: newProject.difficulty,
          created_by: newProject.createdBy,
          is_public: newProject.is_public,
          organization_name: newProject.organizationName,
          goal: newProject.goal,
          resources: newProject.resources,
          links: newProject.links,
          detailed_description: newProject.detailedDescription,
          requirements: newProject.requirements,
          steps: newProject.steps,
          prerequisites: newProject.prerequisites,
          learning_outcomes: newProject.learningOutcomes,
          complexity: newProject.complexity,
          duration: newProject.duration
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
        return {
          ...newProject,
          id: data.id
        };
      }
    }
    
    // Fallback to local implementation
    projectThemes.push(newProject);
    toast.success('Նախագիծը հաջողությամբ ստեղծվել է');
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    toast.error('Սխալ նախագծի ստեղծման ժամանակ');
    throw error;
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (projectId: number, updates: Partial<ProjectTheme>): Promise<ProjectTheme> => {
  try {
    // Find the project in local data first
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    // Update the project in local data
    const updatedProject = {
      ...projectThemes[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    if (supabase) {
      // Create a database-friendly object with snake_case keys
      const dbUpdates: any = {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        image: updates.image,
        tech_stack: updates.techStack,
        difficulty: updates.difficulty,
        is_public: updates.is_public,
        organization_name: updates.organizationName,
        goal: updates.goal,
        resources: updates.resources,
        links: updates.links,
        detailed_description: updates.detailedDescription,
        requirements: updates.requirements,
        steps: updates.steps,
        prerequisites: updates.prerequisites,
        learning_outcomes: updates.learningOutcomes,
        complexity: updates.complexity,
        duration: updates.duration,
        updated_at: new Date().toISOString()
      };
      
      // Remove undefined values
      Object.keys(dbUpdates).forEach(key => {
        if (dbUpdates[key] === undefined) {
          delete dbUpdates[key];
        }
      });
      
      const { error } = await supabase
        .from('projects')
        .update(dbUpdates)
        .eq('id', projectId);
      
      if (error) throw error;
    }
    
    // Update local data
    projectThemes[projectIndex] = updatedProject;
    toast.success('Նախագիծը հաջողությամբ թարմացվել է');
    return updatedProject;
  } catch (error) {
    console.error(`Error updating project with ID ${projectId}:`, error);
    toast.error('Սխալ նախագծի թարմացման ժամանակ');
    throw error;
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId: number): Promise<boolean> => {
  try {
    if (supabase) {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
    }
    
    // Always update local data
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    if (projectIndex !== -1) {
      projectThemes.splice(projectIndex, 1);
    }
    
    toast.success('Նախագիծը հաջողությամբ ջնջվել է');
    return true;
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    toast.error('Սխալ նախագծի ջնջման ժամանակ');
    return false;
  }
};

/**
 * Add a timeline event to a project
 */
export const addTimelineEvent = async (projectId: number, event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> => {
  try {
    const newEvent = {
      ...event,
      id: uuidv4()
    };
    
    if (supabase) {
      const { data, error } = await supabase
        .from('timeline_events')
        .insert({
          project_id: projectId,
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          completed: newEvent.isCompleted
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        return {
          id: String(data.id),
          title: data.title,
          description: data.description,
          date: data.date,
          isCompleted: data.completed
        };
      }
    }
    
    // Fallback to local implementation
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    if (!projectThemes[projectIndex].timeline) {
      projectThemes[projectIndex].timeline = [];
    }
    
    projectThemes[projectIndex].timeline!.push(newEvent);
    return newEvent;
  } catch (error) {
    console.error(`Error adding timeline event to project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Complete a timeline event
 */
export const completeTimelineEvent = async (projectId: number, eventId: string): Promise<TimelineEvent> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('timeline_events')
        .update({ completed: true })
        .eq('id', eventId)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        return {
          id: String(data.id),
          title: data.title,
          description: data.description,
          date: data.date,
          isCompleted: data.completed
        };
      }
    }
    
    // Fallback to local implementation
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    if (!projectThemes[projectIndex].timeline) {
      throw new Error(`Project with ID ${projectId} has no timeline`);
    }
    
    const eventIndex = projectThemes[projectIndex].timeline!.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error(`Event with ID ${eventId} not found in project ${projectId}`);
    }
    
    projectThemes[projectIndex].timeline![eventIndex].isCompleted = true;
    return projectThemes[projectIndex].timeline![eventIndex];
  } catch (error) {
    console.error(`Error completing timeline event ${eventId} in project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Add a task to a project
 */
export const addTask = async (projectId: number, task: Omit<Task, 'id'>): Promise<Task> => {
  try {
    const newTask = {
      ...task,
      id: uuidv4()
    };
    
    if (supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          project_id: projectId,
          title: newTask.title,
          description: newTask.description,
          assigned_to: newTask.assignedTo,
          status: newTask.status
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        return {
          id: String(data.id),
          title: data.title,
          description: data.description,
          assignedTo: data.assigned_to,
          status: data.status as Task['status']
        };
      }
    }
    
    // Fallback to local implementation
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    if (!projectThemes[projectIndex].tasks) {
      projectThemes[projectIndex].tasks = [];
    }
    
    projectThemes[projectIndex].tasks!.push(newTask);
    return newTask;
  } catch (error) {
    console.error(`Error adding task to project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Update a task status
 */
export const updateTaskStatus = async (projectId: number, taskId: string, status: Task['status']): Promise<Task> => {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        return {
          id: String(data.id),
          title: data.title,
          description: data.description,
          assignedTo: data.assigned_to,
          status: data.status as Task['status']
        };
      }
    }
    
    // Fallback to local implementation
    const projectIndex = projectThemes.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error(`Project with ID ${projectId} not found`);
    }
    
    if (!projectThemes[projectIndex].tasks) {
      throw new Error(`Project with ID ${projectId} has no tasks`);
    }
    
    const taskIndex = projectThemes[projectIndex].tasks!.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found in project ${projectId}`);
    }
    
    projectThemes[projectIndex].tasks![taskIndex].status = status;
    return projectThemes[projectIndex].tasks![taskIndex];
  } catch (error) {
    console.error(`Error updating task ${taskId} status in project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Change project status
 */
export const changeProjectStatus = async (
  projectId: number,
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected',
  feedback?: string
): Promise<boolean> => {
  try {
    if (supabase) {
      const { error } = await supabase
        .from('project_assignments')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('project_id', projectId);
      
      if (error) throw error;
    }
    
    // No local implementation for project status yet
    await delay(500); // Simulate API delay
    return true;
  } catch (error) {
    console.error(`Error changing project ${projectId} status to ${status}:`, error);
    return false;
  }
};
