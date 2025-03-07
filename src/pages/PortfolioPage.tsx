
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PortfolioPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Ուսանողի պորտֆոլիո</h2>
          <p className="text-gray-600">Այս էջը դեռ մշակման փուլում է։ Շուտով այստեղ կարող եք դիտել և կառավարել Ձեր պորտֆոլիոն։</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
