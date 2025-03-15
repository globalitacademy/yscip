
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getCourses, getGroups, getStudentsByCourseAndGroup } from '@/data/userRoles';

interface ProjectTask {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignedTo: string;
  dueDate: string;
  createdBy: string;
  assignedToUser: {
    name: string;
    avatar: string;
  };
}

interface Project {
  id: number;
  title: string;
}

export function useTasksPageLogic() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [studentProjects, setStudentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Get courses, groups, and students data
  const courses = getCourses();
  const groups = selectedCourse ? getGroups(selectedCourse) : [];
  const students = selectedCourse && selectedGroup 
    ? getStudentsByCourseAndGroup(selectedCourse, selectedGroup) 
    : [];

  // Fetch student projects
  const fetchStudentProjects = async (studentId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_assignments')
        .select('project_id, projects(id, title)')
        .eq('student_id', studentId)
        .eq('status', 'approved');

      if (error) throw error;

      if (data && data.length > 0) {
        const projects = data.map(item => ({
          id: item.projects.id,
          title: item.projects.title
        }));
        setStudentProjects(projects);
        setSelectedProject('');
      } else {
        setStudentProjects([]);
        setSelectedProject('');
        toast({
          title: "Նախագծեր չեն գտնվել",
          description: "Այս ուսանողը դեռ չունի հաստատված նախագծեր։",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching student projects:", error);
      toast({
        title: "Սխալ",
        description: "Նախագծերը ստանալու ընթացքում սխալ է տեղի ունեցել։",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch project tasks
  const fetchProjectTasks = async (projectId: string) => {
    setLoading(true);
    try {
      const projectIdNumber = parseInt(projectId, 10);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*, users!tasks_assigned_to_fkey(name, avatar)')
        .eq('project_id', projectIdNumber);

      if (error) throw error;

      if (data) {
        const formattedTasks: ProjectTask[] = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status as 'todo' | 'in-progress' | 'review' | 'done',
          assignedTo: task.assigned_to,
          dueDate: task.due_date,
          createdBy: task.created_by,
          assignedToUser: task.users
        }));
        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      toast({
        title: "Սխալ",
        description: "Առաջադրանքները ստանալու ընթացքում սխալ է տեղի ունեցել։",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle course change
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedGroup('');
    setSelectedStudent('');
    setSelectedProject('');
    setTasks([]);
  };

  // Handle group change
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedStudent('');
    setSelectedProject('');
    setTasks([]);
  };

  // Handle student change
  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    setSelectedProject('');
    setTasks([]);
    if (value) {
      fetchStudentProjects(value);
    }
  };

  // Handle project change
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    if (value) {
      fetchProjectTasks(value);
    } else {
      setTasks([]);
    }
  };

  // Add new task
  const handleAddTask = async (task: any) => {
    try {
      const projectIdNumber = parseInt(selectedProject, 10);
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          status: task.status,
          assigned_to: task.assignedTo,
          due_date: task.dueDate,
          created_by: task.createdBy,
          project_id: projectIdNumber
        })
        .select();

      if (error) throw error;

      if (data) {
        toast({
          title: "Առաջադրանքն ավելացված է",
          description: "Նոր առաջադրանքը հաջողությամբ ավելացվեց։",
        });
        fetchProjectTasks(selectedProject);
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Սխալ",
        description: "Առաջադրանքի ավելացման ընթացքում սխալ է տեղի ունեցել։",
        variant: "destructive"
      });
    }
    setShowTaskForm(false);
  };

  // Update task status
  const handleUpdateTaskStatus = async (taskId: number, status: 'todo' | 'in-progress' | 'review' | 'done') => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Առաջադրանքի կարգավիճակը թարմացված է",
        description: "Առաջադրանքի կարգավիճակը հաջողությամբ փոխվեց։",
      });
      
      // Update local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, status } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Սխալ",
        description: "Առաջադրանքի կարգավիճակի թարմացման ընթացքում սխալ է տեղի ունեցել։",
        variant: "destructive"
      });
    }
  };

  return {
    tasks,
    selectedCourse,
    selectedGroup,
    selectedStudent,
    selectedProject,
    showTaskForm,
    setShowTaskForm,
    studentProjects,
    loading,
    courses,
    groups,
    students,
    handleCourseChange,
    handleGroupChange,
    handleStudentChange,
    handleProjectChange,
    handleAddTask,
    handleUpdateTaskStatus
  };
}
