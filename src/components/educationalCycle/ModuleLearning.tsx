
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EducationalModule } from './types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { CheckCircle, Clock, ChevronRight, Book, Video, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface ModuleLearningProps {
  module: EducationalModule;
}

interface Theme {
  id: string;
  title: string;
  summary: string;
  image_url?: string;
  banner_image_url?: string;
  category?: string;
  module_id?: number;
  is_published?: boolean;
  content?: string;
  video_url?: string;
}

const ModuleLearning: React.FC<ModuleLearningProps> = ({ module }) => {
  const { title, description, topics, status, progress = 0 } = module;
  const Icon = module.icon;
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchThemes = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const moduleId = parseInt(id);
        if (isNaN(moduleId)) {
          console.error('Invalid module id:', id);
          return;
        }
        
        const { data, error } = await supabase
          .from('themes')
          .select('*')
          .eq('module_id', moduleId)
          .eq('is_published', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setThemes(data || []);
      } catch (error) {
        console.error('Error fetching themes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThemes();
  }, [id]);

  // Status based styling
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          accent: 'border-green-500 dark:border-green-600',
          bg: 'bg-green-50 dark:bg-green-900/20',
          icon: 'text-green-600 dark:text-green-400'
        };
      case 'in-progress':
        return {
          accent: 'border-blue-500 dark:border-blue-600',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          icon: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          accent: 'border-gray-200 dark:border-gray-700',
          bg: 'bg-white dark:bg-gray-800',
          icon: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const styles = getStatusStyles();
  
  // Calculate estimated time to complete (very rough estimate)
  const estimatedTime = topics ? Math.ceil(topics.length * 1.5) : 10; // 1.5 hours per topic as a rough estimate
  
  // Determine if a theme has video content
  const hasVideo = (content?: string, videoUrl?: string): boolean => {
    if (videoUrl) return true;
    if (!content) return false;
    return content.includes('youtube.com/embed') || content.includes('youtube.com/watch') || content.includes('youtu.be/');
  };
  
  return (
    <div className="space-y-8">
      {/* Module Overview */}
      <Card className={`border ${styles.accent}`}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={cn("p-3 rounded-full", styles.bg, styles.icon)}>
                {Icon && <Icon size={24} />}
              </div>
              <CardTitle>{title}</CardTitle>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>~{estimatedTime} ժամ</span>
            </div>
          </div>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Առաջընթաց</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button>Սկսել ուսուցումը</Button>
              <Button variant="outline">Թեստավորում</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Module Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ուսումնական նյութեր</CardTitle>
          <CardDescription>
            Այս մոդուլը բաղկացած է {topics?.length || 0} թեմաներից՝ տեսական և գործնական նյութերով
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {topics?.map((topic, index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 border rounded-lg flex items-start gap-3 transition-all",
                  "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                )}
              >
                <div className="mt-0.5 text-primary">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Թեմա {index + 1}</h3>
                  <p className="text-muted-foreground">{topic}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Theme Learning Resources */}
      {themes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Թեմաների գրադարան</CardTitle>
            <CardDescription>
              Ուսումնասիրեք այս մոդուլին առնչվող մանրամասն նյութերը
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => (
                <Card key={theme.id} className="overflow-hidden group">
                  {theme.image_url && (
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={theme.image_url} 
                        alt={theme.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {theme.content && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Book className="h-3 w-3" />
                            <span>Տեքստ</span>
                          </Badge>
                        )}
                        {hasVideo(theme.content, theme.video_url) && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            <span>Վիդեո</span>
                          </Badge>
                        )}
                        {theme.image_url && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            <span>Նկար</span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      <Link to={`/themes/${theme.id}`} className="hover:text-primary">
                        {theme.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {theme.summary}
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link to={`/themes/${theme.id}`} className="flex items-center gap-1">
                        Ուսումնասիրել
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Button variant="outline" asChild>
              <Link to="/themes">Բոլոր թեմաները</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ModuleLearning;
