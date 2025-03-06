
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ThemeGrid from '@/components/ThemeGrid';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Index = () => {
  const { user } = useAuth();
  const [createdProjects, setCreatedProjects] = useState<any[]>([]);
  const [reservedProjects, setReservedProjects] = useState<any[]>([]);
  
  // Load projects from localStorage
  useEffect(() => {
    // Get created projects
    const storedProjects = localStorage.getItem('createdProjects');
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setCreatedProjects(parsedProjects);
        console.log('Loaded created projects:', parsedProjects);
      } catch (e) {
        console.error('Error parsing stored projects:', e);
      }
    }
    
    // Get reserved projects
    const storedReservations = localStorage.getItem('reservedProjects');
    if (storedReservations) {
      try {
        const parsedReservations = JSON.parse(storedReservations);
        setReservedProjects(parsedReservations);
        console.log('Loaded reserved projects:', parsedReservations);
      } catch (e) {
        console.error('Error parsing reserved projects:', e);
      }
    }
  }, []);

  // Display user role toast when logged in
  useEffect(() => {
    if (user) {
      const roleMap: Record<string, string> = {
        'student': 'Ուսանող',
        'instructor': 'Դասախոս',
        'admin': 'Ադմինիստրատոր',
        'supervisor': 'Ղեկավար'
      };
      
      const roleName = roleMap[user.role] || user.role;
      
      toast.success(`Մուտք եք գործել որպես ${roleName}`, {
        duration: 3000,
        position: 'top-right'
      });
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto px-4 pb-16">
          <ThemeGrid 
            createdProjects={createdProjects} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
