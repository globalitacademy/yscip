
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ThemeGrid from '@/components/ThemeGrid';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ThemeGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
