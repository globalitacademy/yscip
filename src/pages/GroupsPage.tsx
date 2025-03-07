
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GroupManagement from '@/components/GroupManagement';

const GroupsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <GroupManagement />
      </main>
      <Footer />
    </div>
  );
};

export default GroupsPage;
