
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReservationsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Ամրագրումներ</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Այս էջը զարգանալու կարիք ունի:</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReservationsPage;
