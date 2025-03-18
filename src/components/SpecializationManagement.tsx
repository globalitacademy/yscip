
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ConfirmDatabaseAction from './ConfirmDatabaseAction';
import { addSystemNotification } from '@/utils/notificationUtils';

interface Specialization {
  id: string;
  name: string;
  description: string;
  courses: number;
}

const SpecializationManagement: React.FC = () => {
  const { user } = useAuth();
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {});
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmDescription, setConfirmDescription] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState<Partial<Specialization>>({
    name: '',
    description: '',
    courses: 0
  });

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('specializations')
        .select('*')
        .order('name');
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setSpecializations(data as Specialization[]);
      }
    } catch (error) {
      console.error('Error fetching specializations:', error);
      toast.error('Չհաջողվեց բեռնել մասնագիտությունների ցանկը');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to show confirmation dialog
  const showConfirm = (title: string, description: string, action: () => Promise<void>) => {
    setConfirmTitle(title);
    setConfirmDescription(description);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleAddSpecialization = () => {
    if (!newSpecialization.name || !newSpecialization.description) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    showConfirm(
      "Ավելացնել նոր մասնագիտություն",
      `Դուք պատրաստվում եք ավելացնել "${newSpecialization.name}" մասնագիտությունը: Շարունակե՞լ:`,
      async () => {
        setIsConfirming(true);
        try {
          const specializationToAdd: Specialization = {
            id: uuidv4(),
            name: newSpecialization.name!,
            description: newSpecialization.description!,
            courses: newSpecialization.courses || 0
          };

          const { error } = await supabase
            .from('specializations')
            .insert(specializationToAdd);

          if (error) throw error;

          setSpecializations([...specializations, specializationToAdd]);
          
          if (user) {
            await addSystemNotification(
              user.id,
              'Նոր մասնագիտություն է ավելացվել',
              `Ադմինիստրատորը ավելացրել է նոր "${specializationToAdd.name}" մասնագիտությունը`,
              'info'
            );
          }
          
          toast.success('Մասնագիտությունը հաջողությամբ ավելացվել է');
          
          setNewSpecialization({
            name: '',
            description: '',
            courses: 0
          });
          setIsAddDialogOpen(false);
        } catch (error) {
          console.error('Error adding specialization:', error);
          toast.error('Չհաջողվեց ավելացնել մասնագիտությունը');
        } finally {
          setIsConfirming(false);
        }
      }
    );
  };

  const handleDeleteSpecialization = (id: string, name: string) => {
    showConfirm(
      "Ջնջել մասնագիտությունը",
      `Դուք պատրաստվում եք ջնջել "${name}" մասնագիտությունը: Այս գործողությունը հնարավոր չէ հետ շրջել: Շարունակե՞լ:`,
      async () => {
        setIsConfirming(true);
        try {
          const { error } = await supabase
            .from('specializations')
            .delete()
            .eq('id', id);

          if (error) throw error;

          setSpecializations(specializations.filter(spec => spec.id !== id));
          
          if (user) {
            await addSystemNotification(
              user.id,
              'Մասնագիտությունը ջնջվել է',
              `Ադմինիստրատորը ջնջել է "${name}" մասնագիտությունը`,
              'warning'
            );
          }
          
          toast.success('Մասնագիտությունը հաջողությամբ հեռացվել է');
        } catch (error) {
          console.error('Error deleting specialization:', error);
          toast.error('Չհաջողվեց ջնջել մասնագիտությունը');
        } finally {
          setIsConfirming(false);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Մասնագիտությունների կառավարում</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Ավելացնել նոր մասնագիտություն</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Նոր մասնագիտության ավելացում</DialogTitle>
              <DialogDescription>
                Լրացրեք մասնագիտության տվյալները ներքևում: Պատրաստ լինելուց հետո սեղմեք "Ավելացնել" կոճակը:
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Անվանում
                </Label>
                <Input
                  id="name"
                  value={newSpecialization.name}
                  onChange={(e) => setNewSpecialization({ ...newSpecialization, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Նկարագրություն
                </Label>
                <Textarea
                  id="description"
                  value={newSpecialization.description}
                  onChange={(e) => setNewSpecialization({ ...newSpecialization, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddSpecialization}>
                Ավելացնել
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specializations.map((specialization) => (
            <Card key={specialization.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{specialization.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive" 
                    onClick={() => handleDeleteSpecialization(specialization.id, specialization.name)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{specialization.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Կուրսեր:</span>
                    <span>{specialization.courses}</span>
                  </div>
                  <div className="pt-2">
                    <Button size="sm" className="w-full">Դիտել մանրամասները</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDatabaseAction
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmAction}
        title={confirmTitle}
        description={confirmDescription}
        isLoading={isConfirming}
      />
    </div>
  );
};

export default SpecializationManagement;
