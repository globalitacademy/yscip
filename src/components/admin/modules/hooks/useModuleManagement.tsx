
import { useState, useEffect } from 'react';
import { Layers } from 'lucide-react';
import { toast } from 'sonner';
import type { EducationalModule } from '@/components/educationalCycle';
import { supabase } from '@/integrations/supabase/client';

// Update the EducationalModule type to include content
declare module '@/components/educationalCycle' {
  interface EducationalModule {
    content?: string;
  }
}

export function useModuleManagement() {
  const [modules, setModules] = useState<EducationalModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<EducationalModule | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRichTextMode, setIsRichTextMode] = useState(false);
  
  // Fetch modules from Supabase
  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('educational_modules')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Convert the data to match EducationalModule type
      const formattedModules: EducationalModule[] = data?.map((module: any) => ({
        id: module.id,
        title: module.title,
        icon: Layers, // We'll use a default icon since we can't store React components
        status: module.status || 'not-started',
        progress: module.progress || 0,
        description: module.description || '',
        topics: module.topics || [],
        content: module.content || '',
        display_order: module.display_order || 0
      })) || [];
      
      setModules(formattedModules);
    } catch (error) {
      toast.error('Սխալ մոդուլների բեռնման ժամանակ', { description: String(error) });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);
  
  const handleEditClick = (module: EducationalModule) => {
    setSelectedModule({...module});
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (module: EducationalModule) => {
    setSelectedModule(module);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveModule = async () => {
    if (!selectedModule) return;

    if (!selectedModule.title) {
      toast.error("Խնդրում ենք լրացնել մոդուլի վերնագիրը");
      return;
    }
    
    try {
      // If it's an existing module (has numeric id)
      if (typeof selectedModule.id === 'number') {
        const moduleData = {
          title: selectedModule.title,
          description: selectedModule.description,
          status: selectedModule.status,
          progress: selectedModule.progress,
          topics: selectedModule.topics,
          content: selectedModule.content,
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('educational_modules')
          .update(moduleData)
          .eq('id', selectedModule.id);
        
        if (error) throw error;
        toast.success("Մոդուլը հաջողությամբ թարմացվել է");
      } else {
        // Add new module
        const moduleData = {
          title: selectedModule.title,
          description: selectedModule.description,
          status: selectedModule.status || 'not-started',
          progress: selectedModule.progress || 0,
          topics: selectedModule.topics || [],
          content: selectedModule.content || '',
          display_order: modules.length + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase
          .from('educational_modules')
          .insert(moduleData);
        
        if (error) throw error;
        toast.success("Նոր մոդուլն ավելացվել է");
      }
      
      // Refresh modules list
      await fetchModules();
      setIsDialogOpen(false);
      setSelectedModule(null);
    } catch (error) {
      toast.error('Սխալ մոդուլը պահպանելիս', { description: String(error) });
    }
  };
  
  const handleDeleteModule = async () => {
    if (!selectedModule) return;
    
    try {
      const { error } = await supabase
        .from('educational_modules')
        .delete()
        .eq('id', selectedModule.id);
        
      if (error) throw error;
      
      toast.success("Մոդուլը հաջողությամբ հեռացվել է");
      await fetchModules();
      setIsDeleteDialogOpen(false);
      setSelectedModule(null);
    } catch (error) {
      toast.error('Սխալ մոդուլը հեռացնելիս', { description: String(error) });
    }
  };
  
  const handleAddNewModule = () => {
    setSelectedModule({
      id: 0,
      title: "",
      icon: Layers,
      status: 'not-started',
      progress: 0,
      description: "",
      topics: [],
      content: ""
    });
    setIsDialogOpen(true);
  };

  const toggleRichTextMode = () => {
    setIsRichTextMode(!isRichTextMode);
  };

  return {
    modules,
    isLoading,
    isDialogOpen,
    selectedModule,
    isDeleteDialogOpen,
    isRichTextMode,
    setIsDialogOpen,
    setSelectedModule,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleDeleteClick,
    handleSaveModule,
    handleDeleteModule,
    handleAddNewModule,
    toggleRichTextMode,
    fetchModules
  };
}
