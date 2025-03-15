
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import TaskManager from '@/components/tasks/TaskManager';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUsersByRole, getStudentsByCourseAndGroup, getCourses, getGroups } from '@/data/userRoles';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import TaskForm from '@/components/tasks/TaskForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import SupervisorEmptyState from '@/components/supervisor/SupervisorEmptyState';
import { ClipboardList } from 'lucide-react';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [studentProjects, setStudentProjects] = useState<{id: number, title: string}[]>([]);
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

  return (
    <AdminLayout pageTitle="Առաջադրանքների կառավարում">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ընտրեք ուսանող և նախագիծ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="course">Կուրս</Label>
                <Select value={selectedCourse} onValueChange={handleCourseChange}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Ընտրեք կուրսը" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Խումբ</Label>
                <Select 
                  value={selectedGroup} 
                  onValueChange={handleGroupChange}
                  disabled={!selectedCourse}
                >
                  <SelectTrigger id="group">
                    <SelectValue placeholder="Ընտրեք խումբը" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(group => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="student">Ուսանող</Label>
                <Select 
                  value={selectedStudent} 
                  onValueChange={handleStudentChange}
                  disabled={!selectedGroup}
                >
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Ընտրեք ուսանողին" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Նախագիծ</Label>
                <Select 
                  value={selectedProject} 
                  onValueChange={handleProjectChange}
                  disabled={!selectedStudent || studentProjects.length === 0}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Ընտրեք նախագիծը" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentProjects.map(project => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedProject && (
              <div className="flex justify-end">
                <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Plus size={16} /> Ավելացնել առաջադրանք
                    </Button>
                  </DialogTrigger>
                  <TaskForm 
                    onSubmit={handleAddTask}
                    onClose={() => setShowTaskForm(false)}
                    currentUserId={selectedStudent}
                    students={[...students.filter(s => s.id === selectedStudent)]}
                  />
                </Dialog>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedProject ? (
          <TaskManager 
            tasks={tasks} 
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        ) : (
          <SupervisorEmptyState 
            icon={<ClipboardList className="h-12 w-12" />}
            title="Ընտրեք ուսանող և նախագիծ"
            description="Առաջադրանքները տեսնելու համար նախ ընտրեք կուրսը, խումբը, ուսանողին և նախագիծը։"
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TasksPage;
