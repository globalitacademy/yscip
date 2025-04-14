
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';

const Categories: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { theme } = useTheme();
  
  const categoryGroups = [
    {
      id: 'programming',
      name: 'Ծրագրավորում',
      categories: [
        { id: 'web', name: 'Վեբ ծրագրավորում', count: 24 },
        { id: 'mobile', name: 'Մոբայլ ծրագրավորում', count: 18 },
        { id: 'desktop', name: 'Դեսքթոփ ծրագրավորում', count: 12 },
        { id: 'ai', name: 'Արհեստական բանականություն', count: 9 },
        { id: 'data', name: 'Տվյալների վերլուծություն', count: 15 },
      ]
    },
    {
      id: 'design',
      name: 'Դիզայն',
      categories: [
        { id: 'ui', name: 'UI դիզայն', count: 14 },
        { id: 'ux', name: 'UX դիզայն', count: 11 },
        { id: 'graphic', name: 'Գրաֆիկական դիզայն', count: 8 },
        { id: '3d', name: '3D մոդելավորում', count: 6 },
      ]
    },
    {
      id: 'business',
      name: 'Բիզնես',
      categories: [
        { id: 'marketing', name: 'Մարքեթինգ', count: 10 },
        { id: 'management', name: 'Կառավարում', count: 7 },
        { id: 'finance', name: 'Ֆինանսներ', count: 5 },
        { id: 'entrepreneurship', name: 'Ձեռնարկատիրություն', count: 9 },
      ]
    }
  ];

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Կատեգորիաներ</h1>
        <p className="text-muted-foreground max-w-2xl mb-8">
          Ուսումնասիրեք մեր դասընթացների և նախագծերի կատեգորիաները՝ գտնելու ձեր հետաքրքրություններին համապատասխանող նյութեր և հնարավորություններ։
        </p>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">Բոլորը</TabsTrigger>
            <TabsTrigger value="programming">Ծրագրավորում</TabsTrigger>
            <TabsTrigger value="design">Դիզայն</TabsTrigger>
            <TabsTrigger value="business">Բիզնես</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8">
            {categoryGroups.map(group => (
              <div key={group.id} className="space-y-4">
                <h2 className="text-2xl font-medium">{group.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.categories.map(category => (
                    <Card key={category.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-medium mb-1">{category.name}</h3>
                        <CardDescription>{category.count} դասընթաց</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          {categoryGroups.map(group => (
            <TabsContent key={group.id} value={group.id} className="space-y-4">
              <h2 className="text-2xl font-medium">{group.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.categories.map(category => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-medium mb-1">{category.name}</h3>
                      <CardDescription>{category.count} դասընթաց</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
