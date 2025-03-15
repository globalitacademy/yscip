
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { getCourses, getGroups, getStudentsByCourseAndGroup } from '@/data/userRoles';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: string;
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

  // Վերցնում ենք կուրսերի, խմբերի և ուսանողների տվյալները
  const courses = getCourses();
  const groups = selectedCourse ? getGroups(selectedCourse) : [];
  const students = selectedCourse && selectedGroup 
    ? getStudentsByCourseAndGroup(selectedCourse, selectedGroup) 
    : [];

  // Նախագծերի ստացում տվյալ ուսանողի համար
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

  // Առաջադրանքների ստացում ըստ նախագծի
  const fetchProjectTasks = async (projectId: string) => {
    setLoading(true);
    try {
      const projectIdNumber = parseInt(projectId, 10);
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*, users(name, avatar)')
        .eq('project_id', projectIdNumber);

      if (error) throw error;

      if (data) {
        const formattedTasks = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
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

  // Կուրսի փոփոխության մշակում
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedGroup('');
    setSelectedStudent('');
    setSelectedProject('');
    setTasks([]);
  };

  // Խմբի փոփոխության մշակում
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    setSelectedStudent('');
    setSelectedProject('');
    setTasks([]);
  };

  // Ուսանողի փոփոխության մշակում
  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    setSelectedProject('');
    setTasks([]);
    if (value) {
      fetchStudentProjects(value);
    }
  };

  // Նախագծի փոփոխության մշակում
  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    if (value) {
      fetchProjectTasks(value);
    } else {
      setTasks([]);
    }
  };

  // Նոր առաջադրանքի ավելացում
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

  // Առաջադրանքի կարգավիճակի թարմացում
  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
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
      
      // Թարմացնում ենք լոկալ state-ը
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
