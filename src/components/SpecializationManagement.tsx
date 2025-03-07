
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface Specialization {
  id: string;
  name: string;
  description: string;
  courses: number;
}

// Mock data
const mockSpecializations: Specialization[] = [
  {
    id: '1',
    name: 'Ծրագրավորում',
    description: 'Ծրագրային ապահովման մշակում տարբեր լեզուներով և պլատֆորմների համար։',
    courses: 5
  },
  {
    id: '2',
    name: 'Տվյալագիտություն',
    description: 'Մեծ տվյալների վերլուծություն, տվյալների մշակում և մեքենայական ուսուցում։',
    courses: 3
  },
  {
    id: '3',
    name: 'Դիզայն',
    description: 'Օգտատիրոջ ինտերֆեյսի, փորձի և գրաֆիկական դիզայն։',
    courses: 2
  }
];

const SpecializationManagement: React.FC = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>(mockSpecializations);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSpecialization, setNewSpecialization] = useState<Partial<Specialization>>({
    name: '',
    description: '',
    courses: 0
  });

  const handleAddSpecialization = () => {
    if (!newSpecialization.name || !newSpecialization.description) {
      toast.error('Լրացրեք բոլոր պարտադիր դաշտերը');
      return;
    }

    const specializationToAdd: Specialization = {
      id: uuidv4(),
      name: newSpecialization.name,
      description: newSpecialization.description,
      courses: 0
    };

    setSpecializations([...specializations, specializationToAdd]);
    setNewSpecialization({
      name: '',
      description: '',
      courses: 0
    });
    setIsAddDialogOpen(false);
    toast.success('Մասնագիտությունը հաջողությամբ ավելացվել է');
  };

  const handleDeleteSpecialization = (id: string) => {
    setSpecializations(specializations.filter(spec => spec.id !== id));
    toast.success('Մասնագիտությունը հաջողությամբ հեռացվել է');
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
                  onClick={() => handleDeleteSpecialization(specialization.id)}
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
    </div>
  );
};

export default SpecializationManagement;
