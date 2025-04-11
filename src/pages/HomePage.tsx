
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ThemeGrid from '@/components/ThemeGrid';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Նախագծերի թեմաներ</h2>
          <ThemeGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
