
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Filter } from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [modules, setModules] = useState<{id: number, title: string}[]>([]);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  
  // Fetch themes and modules
  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true);
      
      try {
        // Fetch themes
        let query = supabase
          .from('themes')
          .select('*')
          .eq('is_published', true);
          
        // Apply module filter if selected
        if (selectedModule) {
          query = query.eq('module_id', selectedModule);
        }
        
        // Apply search filter if specified
        if (debouncedSearchTerm) {
          query = query.or(`title.ilike.%${debouncedSearchTerm}%,summary.ilike.%${debouncedSearchTerm}%`);
        }
        
        const { data: themesData, error } = await query.order('title');
        
        if (error) throw error;
        
        // Fetch modules for all themes
        const { data: modulesData } = await supabase
          .from('educational_modules')
          .select('id, title');
          
        if (modulesData) {
          setModules(modulesData);
          
          // Map module titles to themes
          const themesWithModuleTitles = themesData?.map(theme => {
            if (theme.module_id) {
              const moduleInfo = modulesData.find(m => m.id === theme.module_id);
              return { ...theme, module_title: moduleInfo?.title };
            }
            return theme;
          });
          
          setThemes(themesWithModuleTitles || []);
        } else {
          setThemes(themesData || []);
        }
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThemes();
  }, [debouncedSearchTerm, selectedModule]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Թեմաների գրադարան</h1>
        <p className="text-muted-foreground">
          Ուսումնասիրեք մեր ուսումնական թեմաները տարբեր մոդուլներից՝ տեխնոլոգիաների, ծրագրավորման և այլ բնագավառներից
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Որոնել թեմաներ..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Module filter */}
        <div className="flex gap-2">
          <Button
            variant={selectedModule === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedModule(null)}
          >
            Բոլորը
          </Button>
          
          {modules.slice(0, 3).map(module => (
            <Button
              key={module.id}
              variant={selectedModule === module.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModule(module.id)}
            >
              {module.title}
            </Button>
          ))}
          
          {modules.length > 3 && (
            <div className="relative">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Ավելին
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : themes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Թեմաներ չեն գտնվել</h3>
          <p className="text-muted-foreground mt-2">Փորձեք փոխել որոնման պարամետրերը</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map(theme => (
            <Card key={theme.id} className="flex flex-col h-full overflow-hidden">
              {theme.image_url && (
                <div className="h-40 overflow-hidden">
                  <img 
                    src={theme.image_url} 
                    alt={theme.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <CardContent className="flex-grow p-5">
                <div className="flex items-center gap-2 mb-2">
                  {theme.module_title && (
                    <Badge variant="outline" className="flex items-center text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {theme.module_title}
                    </Badge>
                  )}
                  {theme.category && (
                    <Badge variant="secondary" className="text-xs">
                      {theme.category}
                    </Badge>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  <Link to={`/themes/${theme.id}`} className="hover:text-primary">
                    {theme.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground line-clamp-3">{theme.summary}</p>
              </CardContent>
              <CardFooter className="pt-0 pb-5 px-5">
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/themes/${theme.id}`}>Կարդալ ավելին</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemesPage;
