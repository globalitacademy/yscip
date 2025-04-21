
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Theme } from '@/components/admin/themes/hooks/useThemeManagement';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { SlideUp, FadeIn } from '@/components/LocalTransitions';

const ThemesPage: React.FC = () => {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        // Mock data fetching - in a real app, this would be an API call
        const mockThemes: Theme[] = [
          {
            id: 1,
            title: 'Ալգորիթմների հիմունքներ',
            summary: 'Տվյալների կառուցվածքներ և ալգորիթմներ։ Հիմնական հասկացությունները։',
            content: '<p>Ալգորիթմները համակարգչային գիտության հիմքն են կազմում...</p>',
            category: 'Ալգորիթմներ',
            image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            is_published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            title: 'Տվյալների կառուցվածքներ',
            summary: 'Տվյալների կառուցվածքների ներածություն և տեսակներ',
            content: '<p>Տվյալների կառուցվածքները կարևոր են ծրագրավորման մեջ...</p>',
            category: 'Ալգորիթմներ',
            image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80',
            is_published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            title: 'Օբյեկտ կողմնորոշված ծրագրավորում',
            summary: 'ՕԿԾ հիմնական սկզբունքներն ու կիրառությունները',
            content: '<p>Օբյեկտ կողմնորոշված ծրագրավորումը ծրագրավորման մոտեցում է...</p>',
            category: 'Ծրագրավորում',
            image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            is_published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: 4,
            title: 'Ցանցային տեխնոլոգիաներ',
            summary: 'Համակարգչային ցանցերի կառուցվածքն ու հիմնական արձանագրությունները',
            content: '<p>Համակարգչային ցանցերի բազային գիտելիքներ...</p>',
            category: 'Ցանցային տեխնոլոգիաներ',
            image_url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            is_published: true,
            created_at: new Date().toISOString(),
          },
          {
            id: 5,
            title: 'Վեբ կայքերի նախագծում',
            summary: 'HTML, CSS և JavaScript-ի հիմունքներ',
            content: '<p>Վեբ կայքերի պատրաստման տեխնոլոգիաներ...</p>',
            category: 'Վեբ',
            image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
            is_published: true,
            created_at: new Date().toISOString(),
          },
        ];

        setThemes(mockThemes);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(mockThemes.map(theme => theme.category))).filter(Boolean) as string[];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching themes:', error);
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         theme.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? theme.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-primary/10 py-12">
          <div className="container mx-auto px-4 text-center">
            <FadeIn>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Ուսումնական թեմաներ</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Հետաքրքիր և մանրամասն բացատրություններ ծրագրավորման, ալգորիթմների, 
                և տեղեկատվական տեխնոլոգիաների տարբեր թեմաների վերաբերյալ
              </p>
            </FadeIn>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  type="search"
                  placeholder="Որոնել թեմաներ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Themes list */}
        <div className="py-12 px-4">
          <div className="container mx-auto">
            {/* Categories filter */}
            <div className="mb-8 flex flex-wrap gap-2">
              <Button 
                variant={selectedCategory === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                Բոլորը
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="h-96">
                    <CardContent className="p-0">
                      <div className="w-full h-48 bg-muted animate-pulse" />
                      <div className="p-4">
                        <div className="h-6 w-3/4 bg-muted animate-pulse mb-4" />
                        <div className="h-4 bg-muted animate-pulse mb-2" />
                        <div className="h-4 w-2/3 bg-muted animate-pulse mb-4" />
                        <div className="h-8 w-1/4 bg-muted animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredThemes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThemes.map((theme, index) => (
                  <SlideUp key={theme.id} delay={`delay-${index % 10 * 50}`}>
                    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/theme/${theme.id}`)}>
                      <div className="relative">
                        {theme.image_url && (
                          <div 
                            className="h-48 bg-cover bg-center"
                            style={{ backgroundImage: `url(${theme.image_url})` }}
                          />
                        )}
                        {theme.category && (
                          <Badge className="absolute top-4 right-4">
                            {theme.category}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-6 flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-2">{theme.title}</h3>
                        {theme.summary && <p className="text-muted-foreground mb-4">{theme.summary}</p>}
                        <div className="mt-auto">
                          <Button variant="outline" className="mt-4">
                            Կարդալ ավելին
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </SlideUp>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">Թեմաներ չեն գտնվել</h3>
                <p className="text-muted-foreground">Փորձեք փոխել որոնման պարամետրերը</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ThemesPage;
