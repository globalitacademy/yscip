
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Plus } from 'lucide-react';

const ProgramsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  // Mock programs data
  const programs = [
    {
      id: 1,
      title: 'Տեղեկատվական տեխնոլոգիաներ',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      degree: 'Բակալավր',
      duration: '4 տարի',
      status: 'active',
      students: 120
    },
    {
      id: 2,
      title: 'Ծրագրային ճարտարագիտություն',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      degree: 'Մագիստրատուրա',
      duration: '2 տարի',
      status: 'active',
      students: 45
    },
    {
      id: 3,
      title: 'Արհեստական բանականություն',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      degree: 'Մագիստրատուրա',
      duration: '2 տարի',
      status: 'pending',
      students: 0
    },
    {
      id: 4,
      title: 'Կիբերանվտանգություն',
      department: 'Ինֆորմատիկայի ֆակուլտետ',
      degree: 'Բակալավր',
      duration: '4 տարի',
      status: 'active',
      students: 75
    }
  ];

  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';
    
    switch(status) {
      case 'active':
        return <Badge variant="outline" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200"}>Ակտիվ</Badge>;
      case 'pending':
        return <Badge variant="outline" className={isDark ? "bg-amber-900/60 text-amber-300 border-amber-700" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>Սպասման մեջ</Badge>;
      case 'inactive':
        return <Badge variant="outline" className={isDark ? "bg-gray-900/60 text-gray-300 border-gray-700" : "bg-gray-50 text-gray-700 border-gray-200"}>Ոչ ակտիվ</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const filteredPrograms = programs.filter(program => 
    program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.degree.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';

  return (
    <AdminLayout pageTitle="Ծրագրեր">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Ուսումնական ծրագրեր</CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              Բարձրագույն կրթության ծրագրերի ցանկ
            </CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={16} /> Նոր ծրագիր
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Փնտրել ծրագրեր..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map(program => (
                  <Card key={program.id} className={`overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50 hover:bg-gray-900 border-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{program.title}</CardTitle>
                          <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                            {program.department} • {program.degree}
                          </CardDescription>
                        </div>
                        {getStatusBadge(program.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Տևողություն</span>
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Ուսանողներ</span>
                          <span>{program.students}</span>
                        </div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                          Մանրամասներ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className={`flex flex-col items-center justify-center py-12 text-center rounded-md border col-span-2 ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                  <BookOpen className="h-12 w-12 mb-4 opacity-20" />
                  <h3 className="text-lg font-medium">Ծրագրեր չեն գտնվել</h3>
                  <p className="text-sm mt-1 max-w-sm">
                    Ոչ մի ծրագիր չի համապատասխանում ձեր որոնման պարամետրերին։
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ProgramsPage;
