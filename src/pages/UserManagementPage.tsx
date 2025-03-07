
import React from 'react';
import UserManagement from '@/components/UserManagement';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const UserManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <UserManagement />
      </main>
      <Footer />
    </div>
  );
};

export default UserManagementPage;
