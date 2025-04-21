
import { useState } from 'react';
import { Layers } from 'lucide-react';
import { toast } from 'sonner';
import type { EducationalModule } from '@/components/educationalCycle';

export function useModuleManagement() {
  const [modules, setModules] = useState<EducationalModule[]>([
    { id: 1, title: "Ալգորիթմների տարրերի կիրառում", icon: Layers, status: 'completed', progress: 100, description: "Ծանոթացում ալգորիթմների հետ, որոնք տեղեկատվական տեխնոլոգիաների հիմնաքարն են։", topics: [] },
    { id: 2, title: "Ծրագրավորման հիմունքներ", icon: Layers, status: 'completed', progress: 100, description: "Ծրագրավորման հիմնական սկզբունքների ուսումնասիրություն և կիրառում։", topics: [] },
    { id: 3, title: "Օբյեկտ կողմնորոշված ծրագրավորում", icon: Layers, status: 'in-progress', progress: 75, description: "Օբյեկտային մոտեցման կիրառմամբ ծրագրային ապահովման նախագծում։", topics: [] },
    { id: 4, title: "Համակարգչային ցանցեր", icon: Layers, status: 'in-progress', progress: 40, description: "Ցանցային տեխնոլոգիաների և արձանագրությունների ուսումնասիրություն։", topics: [] },
    { id: 5, title: "Ստատրիկ վեբ կայքերի նախագծում", icon: Layers, status: 'not-started', progress: 0, description: "HTML, CSS և JavaScript-ի կիրառմամբ ստատիկ կայքերի ստեղծում։", topics: [] },
    { id: 6, title: "Ջավասկրիպտի կիրառումը", icon: Layers, status: 'not-started', progress: 0, description: "JavaScript լեզվի խորացված ուսումնասիրություն վեբ կայքերում։", topics: [] },
    { id: 7, title: "Ռելյացիոն տվյալների բազաների նախագծում", icon: Layers, status: 'not-started', progress: 0, description: "SQL հարցումների և տվյալների բազաների նախագծման հիմունքներ։", topics: [] },
    { id: 8, title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում", icon: Layers, status: 'not-started', progress: 0, description: "NoSQL տվյալների բազաների ուսումնասիրություն և կիրառում։", topics: [] },
    { id: 9, title: "Դինաﬕկ վեբ կայքերի նախագծում", icon: Layers, status: 'not-started', progress: 0, description: "Վեբ հավելվածների ստեղծում ժամանակակից ֆրեյմվորկներով։", topics: [] },
    { id: 10, title: "Վեկտորային գրաֆիկա", icon: Layers, status: 'not-started', progress: 0, description: "Վեկտորային պատկերների ստեղծում և խմբագրում։", topics: [] },
    { id: 11, title: "Կետային գրաֆիկա", icon: Layers, status: 'not-started', progress: 0, description: "Կետային պատկերների մշակում և խմբագրում։", topics: [] },
    { id: 12, title: "Գրաֆիկական ինտերֆեյսի ծրագրավորում", icon: Layers, status: 'not-started', progress: 0, description: "Աշխատանք գրաֆիկական ինտերֆեյսների հետ և դրանց ստեղծում։", topics: [] },
    { id: 13, title: "Տեղեկատվության անվտանգություն", icon: Layers, status: 'not-started', progress: 0, description: "Տեղեկատվական համակարգերի պաշտպանության մեթոդների ուսումնասիրություն։", topics: [] },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<EducationalModule | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRichTextMode, setIsRichTextMode] = useState(false);
  
  const handleEditClick = (module: EducationalModule) => {
    setSelectedModule({...module});
    setIsDialogOpen(true);
  };
  
  const handleDeleteClick = (module: EducationalModule) => {
    setSelectedModule(module);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSaveModule = () => {
    if (!selectedModule) return;

    if (!selectedModule.title) {
      toast.error("Խնդրում ենք լրացնել մոդուլի վերնագիրը");
      return;
    }
    
    if (selectedModule.id) {
      // Update existing module
      setModules(prevModules => 
        prevModules.map(mod => 
          mod.id === selectedModule.id ? selectedModule : mod
        )
      );
      toast.success("Մոդուլը հաջողությամբ թարմացվել է");
    } else {
      // Add new module
      const newId = modules.length > 0 ? Math.max(...modules.map(m => m.id)) + 1 : 1;
      setModules(prevModules => [...prevModules, {...selectedModule, id: newId}]);
      toast.success("Նոր մոդուլն ավելացվել է");
    }
    
    setIsDialogOpen(false);
    setSelectedModule(null);
  };
  
  const handleDeleteModule = () => {
    if (!selectedModule) return;
    
    setModules(prevModules => prevModules.filter(mod => mod.id !== selectedModule.id));
    toast.success("Մոդուլը հաջողությամբ հեռացվել է");
    setIsDeleteDialogOpen(false);
    setSelectedModule(null);
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
    toggleRichTextMode
  };
}
