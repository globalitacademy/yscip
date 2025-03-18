
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { EducationalModule } from '../../educationalCycle/ModulesInfographic';
import { Progress } from '@/components/ui/progress';

const ModuleManagement: React.FC = () => {
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'not-started':
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Ավարտված է';
      case 'in-progress':
        return 'Ընթացքի մեջ է';
      case 'not-started':
      default:
        return 'Չսկսված';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ուսումնական մոդուլների կառավարում</h1>
        <Button onClick={handleAddNewModule}>
          <Plus className="mr-2 h-4 w-4" /> Ավելացնել մոդուլ
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ուսումնական մոդուլներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="pb-2 text-left font-medium">ID</th>
                  <th className="pb-2 text-left font-medium">Անվանում</th>
                  <th className="pb-2 text-left font-medium">Կարգավիճակ</th>
                  <th className="pb-2 text-left font-medium">Առաջընթաց</th>
                  <th className="pb-2 text-right font-medium">Գործողություններ</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id} className="border-b hover:bg-muted/50">
                    <td className="py-3">{module.id}</td>
                    <td className="py-3">{module.title}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(module.status || 'not-started')}
                        <span>{getStatusLabel(module.status || 'not-started')}</span>
                      </div>
                    </td>
                    <td className="py-3 w-[200px]">
                      <div className="flex items-center gap-3">
                        <Progress value={module.progress || 0} className="h-2 flex-grow" />
                        <span className="text-xs whitespace-nowrap">{module.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(module)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(module)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit/Create Module Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedModule?.id ? 'Խմբագրել մոդուլը' : 'Ավելացնել նոր մոդուլ'}
            </DialogTitle>
            <DialogDescription>
              {selectedModule?.id 
                ? 'Փոփոխեք մոդուլի տվյալները ստորև' 
                : 'Լրացրեք նոր մոդուլի տվյալները'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Անվանում</Label>
              <Input 
                id="title" 
                value={selectedModule?.title || ''} 
                onChange={(e) => setSelectedModule(prev => prev ? {...prev, title: e.target.value} : null)} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Նկարագրություն</Label>
              <Textarea 
                id="description" 
                value={selectedModule?.description || ''} 
                onChange={(e) => setSelectedModule(prev => prev ? {...prev, description: e.target.value} : null)} 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Կարգավիճակ</Label>
              <Select 
                value={selectedModule?.status || 'not-started'} 
                onValueChange={(value) => setSelectedModule(prev => prev ? {...prev, status: value as 'not-started' | 'in-progress' | 'completed'} : null)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Ընտրեք կարգավիճակը" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Չսկսված</SelectItem>
                  <SelectItem value="in-progress">Ընթացքի մեջ է</SelectItem>
                  <SelectItem value="completed">Ավարտված է</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="progress">Առաջընթաց (%)</Label>
              <Input 
                id="progress" 
                type="number" 
                min="0" 
                max="100" 
                value={selectedModule?.progress || 0} 
                onChange={(e) => setSelectedModule(prev => prev ? {...prev, progress: parseInt(e.target.value, 10)} : null)} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Չեղարկել</Button>
            <Button onClick={handleSaveModule}>Պահպանել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Հեռացնել մոդուլը</DialogTitle>
            <DialogDescription>
              Դուք իսկապե՞ս ցանկանում եք հեռացնել "{selectedModule?.title}" մոդուլը։ Այս գործողությունը անդառնալի է։
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Չեղարկել</Button>
            <Button variant="destructive" onClick={handleDeleteModule}>Հեռացնել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleManagement;
