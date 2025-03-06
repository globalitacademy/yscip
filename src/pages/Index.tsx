
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ThemeGrid from '@/components/ThemeGrid';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  
  // For demo purposes, retrieve any stored projects from localStorage
  useEffect(() => {
    const storedProjects = localStorage.getItem('createdProjects');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setCreatedProjects(parsedProjects);
      } catch (e) {
        console.error('Error parsing stored projects:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto px-4">
          <ThemeGrid createdProjects={createdProjects} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
