
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import TaskManager from '@/components/TaskManager';
import { useAuth } from '@/contexts/AuthContext';
import { createTask, getTasksAssignedToUser, updateTaskStatus } from '@/services/taskService';
import { DBTask } from '@/types/database.types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DBTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await getTasksAssignedToUser(user.id);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Չհաջողվեց ստանալ առաջադրանքները');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Set up real-time subscription for tasks
    const channel = supabase
      .channel('public:tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `assigned_to=eq.${user.id}`
      }, (payload) => {
        console.log('Tasks change received:', payload);
        
        // Refresh tasks when a change is detected
        fetchTasks();
        
        // Show toast for new tasks
        if (payload.eventType === 'INSERT') {
          const newTask = payload.new as DBTask;
          toast.info(`Նոր առաջադրանք: ${newTask.title}`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleAddTask = async (task: Omit<DBTask, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;
    
    try {
      const result = await createTask({
        ...task,
        created_by: user.id
      });
      
      if (result) {
        setTasks(prev => [result, ...prev]);
        toast.success('Առաջադրանքը հաջողությամբ ավելացվեց');
      } else {
        toast.error('Չհաջողվեց ավելացնել առաջադրանքը');
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Տեղի ունեցավ սխալ');
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: DBTask['status']) => {
    try {
      const success = await updateTaskStatus(Number(taskId), status);
      
      if (success) {
        setTasks(prev => 
          prev.map(task => 
            task.id.toString() === taskId ? {...task, status} : task
          )
        );
        toast.success('Առաջադրանքի կարգավիճակը թարմացվեց');
      } else {
        toast.error('Չհաջողվեց թարմացնել առաջադրանքի կարգավիճակը');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Տեղի ունեցավ սխալ');
    }
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Առաջադրանքների կառավարում">
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Առաջադրանքների բեռնում...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Առաջադրանքների կառավարում">
      <TaskManager 
        tasks={tasks} 
        onAddTask={handleAddTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
      />
    </AdminLayout>
  );
};

export default TasksPage;
