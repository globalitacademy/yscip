
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Theme {
  id: string;
  title: string;
  summary: string;
  image_url?: string;
  category?: string;
  module_id?: number;
  is_published?: boolean;
}

const ThemesPage: React.FC = () => {
  const { data: themes = [], isLoading } = useQuery({
    queryKey: ['themes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Theme[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen pt-16">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-12 px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Բոլոր թեմաները</h1>
            <p className="text-lg text-muted-foreground">
              Ուսումնասիրեք մանրամասն ուսումնական թեմաներ և նյութեր
            </p>
          </div>

          {themes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Թեմաներ դեռ չեն ավելացվել</h3>
              <p className="text-muted-foreground">
                Շուտով այս բաժնում կհասանելի լինեն ուսումնական թեմաներ:
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <Card key={theme.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                  {theme.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={theme.image_url} 
                        alt={theme.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {theme.category && (
                        <Badge variant="secondary" className="text-xs">
                          {theme.category}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">
                      <Link to={`/themes/${theme.id}`} className="hover:text-primary">
                        {theme.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {theme.summary || 'Այս թեմայի մանրամասն նկարագրությունը հասանելի կլինի շուտով:'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to={`/themes/${theme.id}`} className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          Կարդալ
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/themes/${theme.id}/learn`} className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          Ուսանել
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThemesPage;
