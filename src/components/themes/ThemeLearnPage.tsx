
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeHeader from './theme-learn/ThemeHeader';
import ThemeBanner from './theme-learn/ThemeBanner';
import ThemeTabs from './theme-learn/ThemeTabs';
import RelatedThemes from './theme-learn/RelatedThemes';
import { useThemeDetail } from './hooks/useThemeDetail';

const ThemeLearnPage = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    theme, 
    moduleTitle, 
    relatedThemes, 
    activeTab, 
    setActiveTab, 
    isLoading,
    videoId,
    contentHasEmbeddedVideo
  } = useThemeDetail(id);
  
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
        
        <ThemeHeader 
          theme={theme} 
          moduleId={theme.module_id} 
          moduleTitle={moduleTitle} 
        />
      </div>
      
      <ThemeBanner theme={theme} />
      
      <div className="mb-8 font-medium text-lg text-muted-foreground">{theme.summary}</div>
      
      <ThemeTabs 
        theme={theme} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        videoId={videoId}
        contentHasEmbeddedVideo={contentHasEmbeddedVideo}
      />
      
      {relatedThemes.length > 0 && (
        <RelatedThemes relatedThemes={relatedThemes} />
      )}
    </div>
  );
};

export default ThemeLearnPage;
