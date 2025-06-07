
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Նախագծի մանրամասներ</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Նախագծի ID: {id}</p>
              <p>Այս էջը զարգանալու կարիք ունի:</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetailPage;
