
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Users, BookOpen, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";

interface Program {
  id: string;
  title: string;
  description: string;
  department: string;
  duration: string;
  students: number;
  courses: number;
  status: 'active' | 'pending' | 'archived';
  coordinator: string;
}

const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'Ինֆորմատիկա և կիրառական մաթեմատիկա',
    description: 'Ուսումնական ծրագիր, որը կենտրոնանում է ինֆորմատիկայի և մաթեմատիկայի տեսական և գործնական կիրառությունների վրա',
    department: 'Մաթեմատիկայի և ինֆորմատիկայի ֆակուլտետ',
    duration: '4 տարի',
    students: 120,
    courses: 24,
    status: 'active',
    coordinator: 'Արմեն Սարգսյան'
  },
  {
    id: '2',
    title: 'Տեղեկատվական համակարգեր',
    description: 'Ծրագիր, որը ներառում է տեղեկատվական համակարգերի մշակման և կառավարման դասընթացներ',
    department: 'Ինֆորմատիկայի ֆակուլտետ',
    duration: '4 տարի',
    students: 85,
    courses: 22,
    status: 'active',
    coordinator: 'Գևորգ Հակոբյան'
  },
  {
    id: '3',
    title: 'Ծրագրային ճարտարագիտություն',
    description: 'Ծրագրի մշակման և ճարտարագիտության ուսումնական ծրագիր, որը կենտրոնանում է մեծ համակարգերի մշակման վրա',
    department: 'Համակարգչային գիտությունների ֆակուլտետ',
    duration: '4 տարի',
    students: 95,
    courses: 26,
    status: 'active',
    coordinator: 'Սոնա Մելքոնյան'
  },
  {
    id: '4',
    title: 'Տվյալների գիտություն',
    description: 'Ուսումնական ծրագիր, որը կենտրոնանում է տվյալների վերլուծության և մեքենայական ուսուցման վրա',
    department: 'Մաթեմատիկայի և ինֆորմատիկայի ֆակուլտետ',
    duration: '2 տարի',
    students: 45,
    courses: 16,
    status: 'pending',
    coordinator: 'Լևոն Պետրոսյան'
  }
];

const LecturerProgramsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProgramDetails, setNewProgramDetails] = useState({
    title: '',
    description: '',
    department: '',
    duration: '',
  });

  // Filter programs based on search term and status
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Ակտիվ</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Սպասման մեջ</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">Արխիվացված</Badge>;
      default:
        return null;
    }
  };

  const handleCreateProgram = () => {
    if (!newProgramDetails.title || !newProgramDetails.description || !newProgramDetails.department || !newProgramDetails.duration) {
      toast.error("Լրացրեք բոլոր պարտադիր դաշտերը");
      return;
    }

    const newProgram: Program = {
      id: (programs.length + 1).toString(),
      title: newProgramDetails.title,
      description: newProgramDetails.description,
      department: newProgramDetails.department,
      duration: newProgramDetails.duration,
      students: 0,
      courses: 0,
      status: 'pending',
      coordinator: 'Դուք'
    };

    setPrograms([...programs, newProgram]);
    setIsDialogOpen(false);
    setNewProgramDetails({
      title: '',
      description: '',
      department: '',
      duration: '',
    });

    toast.success("Ծրագիրը ստեղծված է", {
      description: "Ծրագիրը հաջողությամբ ստեղծվել է և ուղարկվել է հաստատման",
    });
  };

  const handleViewProgramDetails = (program: Program) => {
    setSelectedProgram(program);
    // This would normally navigate to a detailed view or open a modal
    toast.info("Ծրագրի մանրամասներ", {
      description: `"${program.title}" ծրագրի մանրամասն տեսքը բացված է։`,
    });
  };

  return (
    <AdminLayout pageTitle="Ուսումնական ծրագրեր">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Փնտրել ծրագրեր..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Բոլոր կարգավիճակները" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Բոլորը</SelectItem>
              <SelectItem value="active">Ակտիվ</SelectItem>
              <SelectItem value="pending">Սպասման մեջ</SelectItem>
              <SelectItem value="archived">Արխիվացված</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-2">
                <Plus className="mr-2 h-4 w-4" />
                Նոր ծրագիր
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Ստեղծել նոր ուսումնական ծրագիր</DialogTitle>
                <DialogDescription>
                  Լրացրեք ձևը նոր ուսումնական ծրագիր առաջարկելու համար։ Հաստատումից հետո այն կհայտնվի ակտիվ ծրագրերի ցանկում։
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right font-medium">
                    Անվանում
                  </label>
                  <Input
                    id="title"
                    value={newProgramDetails.title}
                    onChange={(e) => setNewProgramDetails({...newProgramDetails, title: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="department" className="text-right font-medium">
                    Ֆակուլտետ
                  </label>
                  <Input
                    id="department"
                    value={newProgramDetails.department}
                    onChange={(e) => setNewProgramDetails({...newProgramDetails, department: e.target.value})}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="duration" className="text-right font-medium">
                    Տևողություն
                  </label>
                  <Input
                    id="duration"
                    value={newProgramDetails.duration}
                    onChange={(e) => setNewProgramDetails({...newProgramDetails, duration: e.target.value})}
                    className="col-span-3"
                    placeholder="Օրինակ՝ 4 տարի"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <label htmlFor="description" className="text-right font-medium mt-2">
                    Նկարագրություն
                  </label>
                  <Textarea
                    id="description"
                    value={newProgramDetails.description}
                    onChange={(e) => setNewProgramDetails({...newProgramDetails, description: e.target.value})}
                    className="col-span-3"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateProgram}>Ստեղծել ծրագիր</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">Ծրագրեր չեն գտնվել</p>
          </div>
        ) : (
          filteredPrograms.map(program => (
            <Card key={program.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{program.title}</CardTitle>
                  {getStatusBadge(program.status)}
                </div>
                <CardDescription className="line-clamp-2 mt-1">
                  {program.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ֆակուլտետ:</span>
                    <span className="ml-1">{program.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Տևողություն:</span>
                    <span className="ml-1">{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Ուսանողներ:</span>
                    <span className="ml-1">{program.students}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Դասընթացներ:</span>
                    <span className="ml-1">{program.courses}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex flex-col space-y-2">
                <div className="text-sm text-muted-foreground w-full">
                  Համակարգող: {program.coordinator}
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewProgramDetails(program)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Դիտել մանրամասները
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default LecturerProgramsPage;
