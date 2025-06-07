
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Իմ պրոֆիլը</CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="space-y-4">
                  <p><strong>Էլ. հասցե:</strong> {user.email}</p>
                  <p><strong>Դեր:</strong> {user.role}</p>
                  <p>Այս էջը զարգանալու կարիք ունի:</p>
                </div>
              ) : (
                <p>Մուտք գործեք ձեր պրոֆիլը դիտելու համար:</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
