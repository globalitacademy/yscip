
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { EducationalModule } from '@/components/educationalCycle';

export function useModuleManagement() {
  const [modules, setModules] = useState<EducationalModule[]>([
    { id: 1, title: "Ալգորիթմների տարրերի կիրառում", icon: Plus, status: 'completed', progress: 100, 
      description: "Ծրագրավորման հիմնական ալգորիթմներ և տրամաբանություն", 
      topics: ["Ցիկլեր", "Պայմաններ", "Զանգվածներ", "Հաշվարկներ"] },
    { id: 2, title: "Ծրագրավորման հիմունքներ", icon: Plus, status: 'completed', progress: 100, 
      description: "Ծրագրավորման հիմունքների ուսումնասիրում",
      topics: ["Փոփոխականներ", "Ֆունկցիաներ", "Օբյեկտներ", "Տվյալների տիպեր"] },
    { id: 3, title: "Օբյեկտ կողմնորոշված ծրագրավորում", icon: Plus, status: 'in-progress', progress: 75, 
      description: "Օբյեկտ կողմնորոշված ծրագրավորման հիմունքներ",
      topics: ["Կլասսներ", "Ժառանգականություն", "Պոլիմորֆիզմ", "Ինկապսուլյացիա"] },
    { id: 4, title: "Համակարգչային ցանցեր", icon: Plus, status: 'in-progress', progress: 40, 
      description: "Ցանցային տեխնոլոգիաների ուսումնասիրում",
      topics: ["TCP/IP", "HTTP", "DNS", "Firewall"] },
    { id: 5, title: "Ստատրիկ վեբ կայքերի նախագծում", icon: Plus, status: 'not-started', progress: 0, 
      description: "Ստատիկ վեբ կայքերի մշակում",
      topics: ["HTML", "CSS", "Responsive Design", "SEO Basics"] },
    { id: 6, title: "Ջավասկրիպտի կիրառումը", icon: Plus, status: 'not-started', progress: 0, 
      description: "JavaScript ծրագրավորման լեզվի հիմունքներ",
      topics: ["Syntax", "DOM Manipulation", "Events", "Async/Await"] },
    { id: 7, title: "Ռելյացիոն տվյալների բազաների նախագծում", icon: Plus, status: 'not-started', progress: 0, 
      description: "Ռելյացիոն տվյալների բազաների ուսումնասիրում",
      topics: ["SQL", "Database Design", "Normalization", "Indexing"] },
    { id: 8, title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում", icon: Plus, status: 'not-started', progress: 0, 
      description: "NoSQL տվյալների բազաների ուսումնասիրում",
      topics: ["MongoDB", "Document Stores", "Key-Value Stores", "Graph Databases"] },
    { id: 9, title: "Դինաﬕկ վեբ կայքերի նախագծում", icon: Plus, status: 'not-started', progress: 0, 
      description: "Դինամիկ վեբ կայքերի մշակում",
      topics: ["React", "State Management", "API Integration", "Authentication"] },
    { id: 10, title: "Վեկտորային գրաֆիկա", icon: Plus, status: 'not-started', progress: 0, 
      description: "Վեկտորային գրաֆիկայի հիմունքներ",
      topics: ["SVG", "Illustrator Basics", "Path Manipulation", "Vector Design"] },
    { id: 11, title: "Կետային գրաֆիկա", icon: Plus, status: 'not-started', progress: 0, 
      description: "Կետային գրաֆիկայի հիմունքներ",
      topics: ["Photoshop Basics", "Image Manipulation", "Pixel Art", "Digital Painting"] },
    { id: 12, title: "Գրաֆիկական ինտերֆեյսի ծրագրավորում", icon: Plus, status: 'not-started', progress: 0, 
      description: "UI/UX նախագծման հիմունքներ",
      topics: ["UI Components", "Wireframing", "Prototyping", "User Testing"] },
    { id: 13, title: "Տեղեկատվության անվտանգություն", icon: Plus, status: 'not-started', progress: 0, 
      description: "Կիբերանվտանգության հիմունքներ",
      topics: ["Encryption", "Authentication", "Authorization", "Security Best Practices"] },
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
      description: "",
      status: 'not-started',
      progress: 0,
      topics: []
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
