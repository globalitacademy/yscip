
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';

interface Theme {
  id: string;
  title: string;
  summary: string;
  image_url?: string;
  category?: string;
  module_id?: number;
  module_title?: string;
}

const ThemesPage: React.FC = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true);
      try {
        let query = (supabase
          .from('themes') as any)
          .select('*')
          .eq('is_published', true);
          
        if (debouncedSearchQuery) {
          query = query.ilike('title', `%${debouncedSearchQuery}%`);
        }
        
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
          
        const { data, error } = await query.order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Fetch module titles for themes with module_id
        const themesWithModules = await Promise.all(data.map(async (theme: Theme) => {
          if (theme.module_id) {
            const { data: moduleData } = await (supabase
              .from('educational_modules') as any)
              .select('title')
              .eq('id', theme.module_id)
              .single();
              
            if (moduleData) {
              return { ...theme, module_title: moduleData.title };
            }
          }
          return theme;
        }));
        
        setThemes(themesWithModules);
        
        // Get unique categories
        const uniqueCategories = [...new Set(data.map((t: Theme) => t.category).filter(Boolean))];
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThemes();
  }, [debouncedSearchQuery, selectedCategory]);
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Ուսումնական թեմաների գրադարան</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ուսումնասիրեք բազմազան թեմաներն ըստ ձեր հետաքրքրությունների և ծրագրավորման ոլորտի
          </p>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Որոնել թեմաներ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              Բոլորը
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : themes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Թեմաներ չեն գտնվել</h3>
            <p className="text-muted-foreground">Փորձեք փոխել որոնման տերմինները կամ զտիչները</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.map((theme) => (
              <Card key={theme.id} className="overflow-hidden flex flex-col">
                {theme.image_url && (
                  <div className="h-48">
                    <img 
                      src={theme.image_url} 
                      alt={theme.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-5 flex-grow">
                  {theme.category && (
                    <div className="mb-2 flex items-center">
                      <Tag className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{theme.category}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{theme.title}</h3>
                  <p className="text-muted-foreground line-clamp-3 mb-3">{theme.summary}</p>
                  {theme.module_title && (
                    <div className="flex items-center mt-auto">
                      <BookOpen className="h-4 w-4 mr-1.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{theme.module_title}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-muted/30 px-5 py-3">
                  <Link 
                    to={`/theme/${theme.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    Կարդալ թեման
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemesPage;
