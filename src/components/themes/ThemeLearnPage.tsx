
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, BookOpen, Clock, Calendar, Video, FileText, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Theme {
  id: string;
  title: string;
  summary: string;
  content?: string;
  image_url?: string;
  banner_image_url?: string;
  category?: string;
  module_id?: number;
  created_at?: string;
  updated_at?: string;
}

const ThemeLearnPage = () => {
  const { id } = useParams<{ id: string }>();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedThemes, setRelatedThemes] = useState<Theme[]>([]);
  const [moduleTitle, setModuleTitle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setIsLoading(true);
        
        // First get the theme
        const { data: themeData, error } = await supabase
          .from('themes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (themeData) {
          // If theme has a module_id, get the module title
          if (themeData.module_id) {
            const { data: moduleData } = await supabase
              .from('educational_modules')
              .select('title')
              .eq('id', themeData.module_id)
              .single();
              
            if (moduleData) {
              setModuleTitle(moduleData.title);
            }
            
            // Get related themes from the same module
            const { data: relatedData } = await supabase
              .from('themes')
              .select('id, title, summary, category, image_url')
              .eq('module_id', themeData.module_id)
              .neq('id', id)
              .limit(3);
              
            if (relatedData) {
              setRelatedThemes(relatedData);
            }
          }
          
          setTheme(themeData);
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchTheme();
    }
  }, [id]);
  
  // Extract YouTube video ID from content if exists
  const extractYouTubeVideoId = (content?: string): string | null => {
    if (!content) return null;
    
    // Match YouTube embed iframe
    const iframeMatch = content.match(/src=["']https:\/\/www\.youtube\.com\/embed\/([^"'&?\/]+)/);
    if (iframeMatch && iframeMatch[1]) return iframeMatch[1];
    
    // Match YouTube URLs
    const urlMatch = content.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^"'&?\/\s]+)/);
    if (urlMatch && urlMatch[1]) return urlMatch[1];
    
    return null;
  };
  
  const videoId = theme?.content ? extractYouTubeVideoId(theme.content) : null;
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!theme) {
    return (
      <div className="container max-w-4xl mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Թեման չի գտնվել</h2>
          <Button asChild>
            <Link to="/themes">Բոլոր թեմաները</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-2">
          <Link to="/themes" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Բոլոր թեմաները
          </Link>
        </Button>
        
        {theme.module_id && moduleTitle && (
          <div className="mb-2">
            <Badge variant="outline" className="flex items-center gap-1 max-w-fit">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              <Link to={`/module/${theme.module_id}`}>{moduleTitle}</Link>
            </Badge>
          </div>
        )}
        
        <h1 className="text-3xl md:text-4xl font-bold">{theme.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          {theme.created_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(theme.created_at), 'dd.MM.yyyy')}</span>
            </div>
          )}
          {theme.category && (
            <Badge variant="secondary">{theme.category}</Badge>
          )}
        </div>
      </div>
      
      {theme.banner_image_url && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={theme.banner_image_url} 
            alt={theme.title} 
            className="w-full h-auto object-cover max-h-80"
          />
        </div>
      )}
      
      <div className="mb-8 font-medium text-lg text-muted-foreground">{theme.summary}</div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Տեքստային Նյութ</span>
          </TabsTrigger>
          {videoId && (
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Տեսադաս</span>
            </TabsTrigger>
          )}
          {theme.image_url && (
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              <span>Նկարներ</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="content" className="prose prose-lg max-w-none">
          {theme.content && (
            <div dangerouslySetInnerHTML={{ __html: theme.content }} />
          )}
        </TabsContent>
        
        {videoId && (
          <TabsContent value="video">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-[450px]"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={theme.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </TabsContent>
        )}
        
        {theme.image_url && (
          <TabsContent value="images">
            <div className="grid grid-cols-1 gap-6">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={theme.image_url} 
                  alt={theme.title} 
                  className="w-full h-auto"
                />
                <div className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    {theme.title} - Ուսումնական գրաֆիկական նյութ
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
      
      {relatedThemes.length > 0 && (
        <div className="mt-12">
          <Separator className="mb-8" />
          <h2 className="text-2xl font-bold mb-6">Նմանատիպ թեմաներ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedThemes.map((relatedTheme) => (
              <Card key={relatedTheme.id} className="overflow-hidden">
                {relatedTheme.image_url && (
                  <div className="h-36 overflow-hidden">
                    <img 
                      src={relatedTheme.image_url} 
                      alt={relatedTheme.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-2">
                    <Link to={`/themes/${relatedTheme.id}`} className="hover:text-primary">
                      {relatedTheme.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedTheme.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeLearnPage;
