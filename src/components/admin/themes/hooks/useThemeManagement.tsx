
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

// Define Theme type based on the database schema
export interface Theme {
  id?: string;
  title: string;
  summary: string;
  content?: string;
  image_url?: string;
  banner_image_url?: string;
  category?: string;
  module_id?: number;
  is_published?: boolean;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

type ThemeRow = Database['public']['Tables']['themes']['Row'];
type ThemeInsert = Database['public']['Tables']['themes']['Insert'];
type ThemeUpdate = Database['public']['Tables']['themes']['Update'];

export function useThemeManagement() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) {
        setThemes([]);
        return;
      }
      // Map to Theme interface
      setThemes(
        data.map((row: ThemeRow) => ({
          ...row,
        }))
      );
    } catch (error) {
      toast.error('Error fetching themes', { description: String(error) });
    }
  };

  const handleEditClick = (theme: Theme) => {
    setSelectedTheme({ ...theme });
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
        const updateObj: ThemeUpdate = {
          ...selectedTheme,
          updated_at: new Date().toISOString()
        };
        const { error } = await supabase
          .from('themes')
          .update(updateObj)
          .eq('id', selectedTheme.id);

        if (error) throw error;
        toast.success("Թեման հաջողությամբ թարմացվել է");
      } else {
        // Add new theme
        const userResp = await supabase.auth.getUser();
        const created_by = userResp.data.user?.id;
        const insertObj: ThemeInsert = {
          ...selectedTheme,
          created_by
        };
        const { error } = await supabase
          .from('themes')
          .insert(insertObj);

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
      title: '',
      summary: '',
      content: '',
      is_published: false
    });
    setIsDialogOpen(true);
  };

  return {
    themes,
    isDialogOpen,
    selectedTheme,
    isDeleteDialogOpen,
    setIsDialogOpen,
    setSelectedTheme,
    setIsDeleteDialogOpen,
    fetchThemes,
    handleEditClick,
    handleDeleteClick,
    handleSaveTheme,
    handleDeleteTheme,
    handleAddNewTheme
  };
}
