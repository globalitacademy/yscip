
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Theme } from '@/components/admin/themes/hooks/useThemeManagement';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, Tag, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { SlideUp, FadeIn } from '@/components/LocalTransitions';

const ThemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedThemes, setRelatedThemes] = useState<Theme[]>([]);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setLoading(true);
        // Mock data fetching - in a real app, this would be an API call
        // This is demo data while we don't have a real API
        setTheme({
          id: parseInt(id || '0'),
          title: 'Ալգորիթմների հիմունքներ',
          summary: 'Տվյալների կառուցվածքներ և ալգորիթմներ։ Հիմնական հասկացությունները։',
          content: `<h2>Ալգորիթմների ներածություն</h2>
          <p>Ալգորիթմը քայլերի հաջորդականություն է, որը սահմանված է խնդրի լուծման համար։ Ալգորիթմները կարևոր են համակարգչային գիտության մեջ, քանի որ դրանք հիմք են ծառայում շատ ծրագրերի համար։</p>
          <h3>Ալգորիթմների բարդությունը</h3>
          <p>Ալգորիթմի բարդությունը չափվում է՝ հաշվի առնելով երկու հիմնական ռեսուրս՝</p>
          <ul>
            <li>Ժամանակի բարդություն՝ գնահատում է ալգորիթմի կատարման ժամանակը</li>
            <li>Տարածության բարդություն՝ գնահատում է ալգորիթմի կողմից օգտագործվող հիշողությունը</li>
          </ul>
          <h2>Հիմնական ալգորիթմների կատեգորիաներ</h2>
          <ol>
            <li>Որոնման ալգորիթմներ - Գծային որոնում, երկուական որոնում</li>
            <li>Տեսակավորման ալգորիթմներ - Bubble Sort, Quick Sort, Merge Sort</li>
            <li>Գրաֆային ալգորիթմներ - Լայնության որոնում (BFS), Խորության որոնում (DFS)</li>
            <li>Դինամիկ ծրագրավորում - Optimality ենթակառուցվածք օգտագործող խնդիրներ</li>
          </ol>
          <blockquote>
            «Ալգորիթմները համակարգչային գիտության սիրտն են։ Ամեն ինչ սկսվում է ալգորիթմից»։
          </blockquote>`,
          category: 'Ալգորիթմներ',
          image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
          is_published: true,
          created_at: new Date().toISOString(),
        });
        
        // Mock related themes
        setRelatedThemes([
          {
            id: 1,
            title: 'Տվյալների կառուցվածքներ',
            summary: 'Տվյալների կառուցվածքների ներածություն և տեսակներ',
            content: '',
            category: 'Ալգորիթմներ',
            image_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80',
            is_published: true,
          },
          {
            id: 2,
            title: 'Ալգորիթմների վերլուծություն',
            summary: 'Ալգորիթմների ժամանակի և հիշողության բարդության վերլուծություն',
            content: '',
            category: 'Ալգորիթմներ',
            image_url: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            is_published: true,
          },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching theme:', error);
        setLoading(false);
      }
    };

    fetchTheme();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Բեռնում...</p>
        </div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Թեման չի գտնվել</h2>
          <Button onClick={() => navigate('/themes')}>Վերադառնալ թեմաների էջ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header />
      
      <main className="flex-grow">
        {/* Theme Banner */}
        <div className="relative">
          {theme.image_url && (
            <div className="absolute inset-0 z-0">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${theme.image_url})`,
                }}
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>
          )}
          
          <div className="relative z-10 container mx-auto px-4 py-16">
            <div className="mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/themes')}
                className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Բոլոր թեմաները</span>
              </Button>
            </div>
            
            <SlideUp>
              <div className="max-w-4xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                  {theme.title}
                </h1>
                
                {theme.summary && (
                  <p className="text-xl text-white/90 mb-6 max-w-3xl">
                    {theme.summary}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-white/80">
                  {theme.created_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(theme.created_at).toLocaleDateString('hy-AM')}</span>
                    </div>
                  )}
                  
                  {theme.category && (
                    <div className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      <Badge variant="secondary" className="bg-primary/20">
                        {theme.category}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </SlideUp>
          </div>
        </div>
        
        {/* Theme Content */}
        <div className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <FadeIn>
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: theme.content || '' }} />
              </article>
            </FadeIn>
            
            <Separator className="my-12" />
            
            {/* Related Themes */}
            {relatedThemes.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  Նմանատիպ թեմաներ
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedThemes.map((relTheme, index) => (
                    <SlideUp key={relTheme.id} delay={`delay-${index * 100}`}>
                      <div 
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/theme/${relTheme.id}`)}
                      >
                        {relTheme.image_url && (
                          <div 
                            className="h-40 bg-cover bg-center"
                            style={{ backgroundImage: `url(${relTheme.image_url})` }}
                          />
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">{relTheme.title}</h3>
                          {relTheme.summary && <p className="text-muted-foreground">{relTheme.summary}</p>}
                          {relTheme.category && (
                            <div className="mt-3">
                              <Badge variant="outline">{relTheme.category}</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </SlideUp>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ThemeDetailPage;
