
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

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
}

export function useThemeManagement() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [modules, setModules] = useState<{id: number; title: string}[]>([]);

  const fetchModules = async () => {
    try {
      // Get modules for dropdown selection
      const { data, error } = await (supabase
        .from('educational_modules') as any)
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
      // Use type assertion to bypass TypeScript limitation
      // This will be fixed once the types are updated
      const { data, error } = await (supabase
        .from('themes') as any)
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
        const { error } = await (supabase
          .from('themes') as any)
          .update({
            ...selectedTheme,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTheme.id);

        if (error) throw error;
        toast.success("Թեման հաջողությամբ թարմացվել է");
      } else {
        // Add new theme
        const { error } = await (supabase
          .from('themes') as any)
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
      const { error } = await (supabase
        .from('themes') as any)
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
    setIsDialogOpen(true);
  };

  return {
    themes,
    isLoading,
    isDialogOpen,
    selectedTheme,
    isDeleteDialogOpen,
    modules,
    setIsDialogOpen,
    setSelectedTheme,
    setIsDeleteDialogOpen,
    fetchThemes,
    fetchModules,
    handleEditClick,
    handleDeleteClick,
    handleSaveTheme,
    handleDeleteTheme,
    handleAddNewTheme
  };
}
