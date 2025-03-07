
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProjectSubmissionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Նախագծի տեղադրում</h2>
          <p className="text-gray-600">Այս էջը դեռ մշակման փուլում է։ Շուտով այստեղ կարող եք ներկայացնել Ձեր նախագծերը։</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectSubmissionPage;
