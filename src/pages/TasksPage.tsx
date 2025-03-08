import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import TaskManager from '@/components/TaskManager';
import { v4 as uuidv4 } from 'uuid';

const TasksPage: React.FC = () => {
  // Sample tasks data
  const sampleTasks = [
    {
      id: uuidv4(),
      title: 'Նախագծի նախնական պլանավորում',
      description: 'Մշակել նախագծի նախնական պլան և հիմնական ֆունկցիոնալություն',
      status: 'todo' as const,
      assignedTo: '1', // student ID
      dueDate: '2024-05-15',
      createdBy: '2' // lecturer ID
    },
    {
      id: uuidv4(),
      title: 'Տվյալների բազայի սխեմայի ստեղծում',
      description: 'Մշակել տվյալների բազայի սխեման և կապերը',
      status: 'in-progress' as const,
      assignedTo: '3', // student ID
      dueDate: '2024-05-20',
      createdBy: '2' // lecturer ID
    },
    {
      id: uuidv4(),
      title: 'Օգտագործողի ինտերֆեյսի դիզայն',
      description: 'Ստեղծել հավելվածի օգտագործողի ինտերֆեյսի նախնական դիզայնը',
      status: 'review' as const,
      assignedTo: '4', // student ID
      dueDate: '2024-05-25',
      createdBy: '2' // lecturer ID
    },
    {
      id: uuidv4(),
      title: 'API ինտեգրացիա',
      description: 'Իրականացնել API-ների ինտեգրացիա և տվյալների փոխանակում',
      status: 'done' as const,
      assignedTo: '1', // student ID
      dueDate: '2024-05-10',
      createdBy: '2' // lecturer ID
    }
  ];

  // Handlers for TaskManager
  const handleAddTask = (task: any) => {
    console.log('New task added:', task);
    // In a real app, this would update state or call an API
  };

  const handleUpdateTaskStatus = (taskId: string, status: any) => {
    console.log('Task status updated:', { taskId, status });
    // In a real app, this would update state or call an API
  };

  return (
    <AdminLayout pageTitle="Առաջադրանքների կառավարում">
      <TaskManager 
        tasks={sampleTasks} 
        onAddTask={handleAddTask}
        onUpdateTaskStatus={handleUpdateTaskStatus}
      />
    </AdminLayout>
  );
};

export default TasksPage;
