
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Define Theme type based on the database schema
export interface Theme {
  id: string;
  title: string;
  summary: string;
  content?: string;
  image_url?: string;
  banner_image_url?: string;
  category?: string;
  module_id?: number;
  is_published?: boolean;
  created_at?: string;
  video_url?: string;
}

export function useThemeManagement() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [modules, setModules] = useState<{id: number; title: string}[]>([]);
  const [contentType, setContentType] = useState<'text' | 'video' | 'both'>('text');

  const fetchModules = async () => {
    try {
      // Get modules for dropdown selection
      const { data, error } = await supabase
        .from('educational_modules')
        .select('id, title')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchThemes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      toast.error('Error fetching themes', { description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch both themes and modules on component mount
  useEffect(() => {
    fetchThemes();
    fetchModules();
  }, []);

  const handleEditClick = (theme: Theme) => {
    setSelectedTheme({...theme});
    // Determine content type based on theme data
    if (theme.content && theme.video_url) {
      setContentType('both');
    } else if (theme.video_url) {
      setContentType('video');
    } else {
      setContentType('text');
    }
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveTheme = async () => {
    if (!selectedTheme) return;

    try {
      if (selectedTheme.id) {
        // Update existing theme
        const { error } = await supabase
          .from('themes')
          .update({
            ...selectedTheme,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTheme.id);

        if (error) throw error;
        toast.success("Թեման հաջողությամբ թարմացվել է");
      } else {
        // Add new theme
        const { error } = await supabase
          .from('themes')
          .insert({
            ...selectedTheme,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });

        if (error) throw error;
        toast.success("Նոր թեման ավելացվել է");
      }

      await fetchThemes();
      setIsDialogOpen(false);
      setSelectedTheme(null);
    } catch (error) {
      toast.error('Սխալ թեման պահպանելիս', { description: String(error) });
    }
  };

  const handleDeleteTheme = async () => {
    if (!selectedTheme?.id) return;

    try {
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', selectedTheme.id);

      if (error) throw error;

      toast.success("Թեման հաջողությամբ հեռացվել է");
      await fetchThemes();
      setIsDeleteDialogOpen(false);
      setSelectedTheme(null);
    } catch (error) {
      toast.error('Սխալ թեման ջնջելիս', { description: String(error) });
    }
  };

  const handleAddNewTheme = () => {
    setSelectedTheme({
      id: '',
      title: '',
      summary: '',
      content: '',
      is_published: false
    });
    setContentType('text');
    setIsDialogOpen(true);
  };

  // Function to handle embedded YouTube videos
  const embedYouTubeVideo = (url: string): string => {
    // Extract video ID from YouTube URL
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\s]+)/);
    if (match && match[1]) {
      const videoId = match[1];
      // Return the video content as HTML
      return `<div class="aspect-w-16 aspect-h-9 my-8">
        <iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoId}" 
         frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
         allowfullscreen></iframe>
      </div>`;
    }
    return '';
  };

  return {
    themes,
    isLoading,
    isDialogOpen,
    selectedTheme,
    isDeleteDialogOpen,
    modules,
    contentType,
    setContentType,
    setIsDialogOpen,
    setSelectedTheme,
    setIsDeleteDialogOpen,
    fetchThemes,
    fetchModules,
    handleEditClick,
    handleDeleteClick,
    handleSaveTheme,
    handleDeleteTheme,
    handleAddNewTheme,
    embedYouTubeVideo
  };
}
