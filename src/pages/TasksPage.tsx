import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTasksForProject, getTasksAssignedToUser } from '@/services/taskService';
import { Task } from '@/types/database.types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TaskManager from '@/components/TaskManager';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TasksPage = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        let fetchedTasks: Task[] = [];
        
        if (id) {
          fetchedTasks = await getTasksForProject(Number(id));
        } else if (user) {
          fetchedTasks = await getTasksAssignedToUser(user.id);
        }
        
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Խնդիր առաջացավ առաջադրանքների բեռնման ընթացքում։');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [id, user]);

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const reviewTasks = tasks.filter(task => task.status === 'review');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-semibold mb-6">Առաջադրանքներ</h1>
        
        {isLoading && <p>Բեռնում...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <Tabs defaultValue="todo" className="w-full">
          <TabsList>
            <TabsTrigger value="todo">Անելիք ({todoTasks.length})</TabsTrigger>
            <TabsTrigger value="in-progress">Ընթացքում ({inProgressTasks.length})</TabsTrigger>
            <TabsTrigger value="review">Ստուգման Կարիք Ունեցող ({reviewTasks.length})</TabsTrigger>
            <TabsTrigger value="done">Ավարտված ({doneTasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="todo">
            <Card>
              <CardContent className="p-4">
                <TaskManager tasks={todoTasks} setTasks={setTasks} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="in-progress">
            <Card>
              <CardContent className="p-4">
                <TaskManager tasks={inProgressTasks} setTasks={setTasks} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="review">
            <Card>
              <CardContent className="p-4">
                <TaskManager tasks={reviewTasks} setTasks={setTasks} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="done">
            <Card>
              <CardContent className="p-4">
                <TaskManager tasks={doneTasks} setTasks={setTasks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default TasksPage;
