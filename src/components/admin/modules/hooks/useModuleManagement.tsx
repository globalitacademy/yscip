
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { EducationalModule } from '@/components/educationalCycle';

export function useModuleManagement() {
  const [modules, setModules] = useState<EducationalModule[]>([
    { id: 1, title: "Ալգորիթմների տարրերի կիրառում", icon: Plus, status: 'completed', progress: 100 },
    { id: 2, title: "Ծրագրավորման հիմունքներ", icon: Plus, status: 'completed', progress: 100 },
    { id: 3, title: "Օբյեկտ կողմնորոշված ծրագրավորում", icon: Plus, status: 'in-progress', progress: 75 },
    { id: 4, title: "Համակարգչային ցանցեր", icon: Plus, status: 'in-progress', progress: 40 },
    { id: 5, title: "Ստատրիկ վեբ կայքերի նախագծում", icon: Plus, status: 'not-started', progress: 0 },
    { id: 6, title: "Ջավասկրիպտի կիրառումը", icon: Plus, status: 'not-started', progress: 0 },
    { id: 7, title: "Ռելյացիոն տվյալների բազաների նախագծում", icon: Plus, status: 'not-started', progress: 0 },
    { id: 8, title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում", icon: Plus, status: 'not-started', progress: 0 },
    { id: 9, title: "Դինաﬕկ վեբ կայքերի նախագծում", icon: Plus, status: 'not-started', progress: 0 },
    { id: 10, title: "Վեկտորային գրաֆիկա", icon: Plus, status: 'not-started', progress: 0 },
    { id: 11, title: "Կետային գրաֆիկա", icon: Plus, status: 'not-started', progress: 0 },
    { id: 12, title: "Գրաֆիկական ինտերֆեյսի ծրագրավորում", icon: Plus, status: 'not-started', progress: 0 },
    { id: 13, title: "Տեղեկատվության անվտանգություն", icon: Plus, status: 'not-started', progress: 0 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<EducationalModule | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
      id: 0, // Temporary ID
      title: "",
      icon: Plus,
      status: 'not-started',
      progress: 0
    });
    setIsDialogOpen(true);
  };

  return {
    modules,
    isDialogOpen,
    selectedModule,
    isDeleteDialogOpen,
    setIsDialogOpen,
    setSelectedModule,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleDeleteClick,
    handleSaveModule,
    handleDeleteModule,
    handleAddNewModule
  };
}
