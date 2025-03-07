
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TaskManager from '@/components/TaskManager';

const TasksPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <TaskManager />
      </main>
      <Footer />
    </div>
  );
};

export default TasksPage;
