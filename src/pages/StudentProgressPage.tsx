
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Filter,
  FileText,
  Calendar,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';

const StudentProgressPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  
  if (!user || (user.role !== 'supervisor' && user.role !== 'project_manager')) {
    return <Navigate to="/login" />;
  }

  // Mock student data
  const students = [
    {
      id: 's1',
      name: 'Արամ Պողոսյան',
      avatar: '',
      email: 'aram.poghosyan@example.com',
      group: 'ՏՏ-301',
      year: 3,
      project: 'Արհեստական բանականությամբ հիմնված առողջապահական համակարգ',
      progress: 65,
      dueDate: '2024-06-15',
      completedTasks: 8,
      totalTasks: 12,
      lastActivity: '2024-05-07'
    },
    {
      id: 's2',
      name: 'Մարիամ Սարգսյան',
      avatar: '',
      email: 'mariam.sargsyan@example.com',
      group: 'ՏՏ-302',
      year: 3,
      project: 'Խելացի տան ավտոմատացման համակարգ',
      progress: 42,
      dueDate: '2024-07-10',
      completedTasks: 5,
      totalTasks: 15,
      lastActivity: '2024-05-08'
    },
    {
      id: 's3',
      name: 'Դավիթ Մարտիրոսյան',
      avatar: '',
      email: 'davit.martirosyan@example.com',
      group: 'ՏՏ-301',
      year: 3,
      project: 'Կիբերանվտանգության ռիսկերի վերլուծության գործիք',
      progress: 90,
      dueDate: '2024-06-01',
      completedTasks: 9,
      totalTasks: 10,
      lastActivity: '2024-05-05'
    },
    {
      id: 's4',
      name: 'Անի Հակոբյան',
      avatar: '',
      email: 'ani.hakobyan@example.com',
      group: 'ՏՏ-302',
      year: 3,
      project: 'Բլոկչեյն հիմքով ապահով փաստաթղթերի համակարգ',
      progress: 30,
      dueDate: '2024-07-20',
      completedTasks: 3,
      totalTasks: 14,
      lastActivity: '2024-05-03'
    }
  ];

  // Mock student milestones
  const studentMilestones: Record<string, Array<{title: string, date: string, status: string, description: string}>> = {
    's1': [
      {
        title: 'Նախագծի առաջարկ',
        date: '2024-04-01',
        status: 'completed',
        description: 'Նախագծի առաջարկը հաստատվել է։'
      },
      {
        title: 'Տվյալների մոդելի մշակում',
        date: '2024-04-15',
        status: 'completed',
        description: 'Տվյալների մոդելը մշակվել և հաստատվել է։'
      },
      {
        title: 'Պրոտոտիպ',
        date: '2024-05-01',
        status: 'completed',
        description: 'Պրոտոտիպը հաջողությամբ ներկայացվել է։'
      },
      {
        title: 'Ալգորիթմի մշակում',
        date: '2024-05-15',
        status: 'in_progress',
        description: 'Ալգորիթմի մշակման աշխատանքներն ընթացքի մեջ են։'
      },
      {
        title: 'Վերջնական տեստավորում',
        date: '2024-06-01',
        status: 'pending',
        description: 'Վերջնական տեստավորումը դեռ չի սկսվել։'
      }
    ],
    's2': [
      {
        title: 'Նախագծի առաջարկ',
        date: '2024-04-05',
        status: 'completed',
        description: 'Նախագծի առաջարկը հաստատվել է։'
      },
      {
        title: 'Համակարգի ճարտարապետություն',
        date: '2024-04-20',
        status: 'completed',
        description: 'Համակարգի ճարտարապետությունը մշակվել է։'
      },
      {
        title: 'Պրոտոտիպ',
        date: '2024-05-10',
        status: 'in_progress',
        description: 'Պրոտոտիպի մշակման աշխատանքներն ընթացքի մեջ են։'
      },
      {
        title: 'Ինտեգրում',
        date: '2024-06-15',
        status: 'pending',
        description: 'Ինտեգրման աշխատանքները դեռ չեն սկսվել։'
      }
    ],
    's3': [
      {
        title: 'Նախագծի առաջարկ',
        date: '2024-03-15',
        status: 'completed',
        description: 'Նախագծի առաջարկը հաստատվել է։'
      },
      {
        title: 'Անվտանգության միջոցառումներ',
        date: '2024-04-01',
        status: 'completed',
        description: 'Անվտանգության միջոցառումները մշակվել են։'
      },
      {
        title: 'Թեստային դեպքեր',
        date: '2024-04-15',
        status: 'completed',
        description: 'Թեստային դեպքերը մշակվել են։'
      },
      {
        title: 'Համակարգի իրականացում',
        date: '2024-05-01',
        status: 'completed',
        description: 'Համակարգը հաջողությամբ իրականացվել է։'
      },
      {
        title: 'Վերջնական հաշվետվություն',
        date: '2024-05-15',
        status: 'in_progress',
        description: 'Վերջնական հաշվետվության մշակման աշխատանքներն ընթացքի մեջ են։'
      }
    ],
    's4': [
      {
        title: 'Նախագծի առաջարկ',
        date: '2024-04-10',
        status: 'completed',
        description: 'Նախագծի առաջարկը հաստատվել է։'
      },
      {
        title: 'Բլոկչեյն մոդելի մշակում',
        date: '2024-05-01',
        status: 'in_progress',
        description: 'Բլոկչեյն մոդելի մշակման աշխատանքներն ընթացքի մեջ են։'
      },
      {
        title: 'Պրոտոտիպի մշակում',
        date: '2024-06-01',
        status: 'pending',
        description: 'Պրոտոտիպի մշակումը դեռ չի սկսվել։'
      }
    ]
  };

  // Available groups for filtering
  const groups = [
    { value: 'all', label: 'Բոլոր խմբերը' },
    { value: 'ՏՏ-301', label: 'ՏՏ-301' },
    { value: 'ՏՏ-302', label: 'ՏՏ-302' }
  ];

  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';
    
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className={isDark ? "bg-green-900/60 text-green-300 border-green-700" : "bg-green-50 text-green-700 border-green-200"}>Ավարտված</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className={isDark ? "bg-blue-900/60 text-blue-300 border-blue-700" : "bg-blue-50 text-blue-700 border-blue-200"}>Ընթացքի մեջ</Badge>;
      case 'pending':
        return <Badge variant="outline" className={isDark ? "bg-amber-900/60 text-amber-300 border-amber-700" : "bg-yellow-50 text-yellow-700 border-yellow-200"}>Սպասվող</Badge>;
      default:
        return <Badge variant="outline">Անորոշ</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    const isDark = theme === 'dark';
    
    if (progress < 30) {
      return isDark ? 'bg-red-600' : 'bg-red-500';
    } else if (progress < 70) {
      return isDark ? 'bg-amber-500' : 'bg-amber-500';
    } else {
      return isDark ? 'bg-green-500' : 'bg-green-500';
    }
  };

  const filteredStudents = students.filter(student => {
    // Filter by group
    if (groupFilter !== 'all' && student.group !== groupFilter) {
      return false;
    }
    
    // Filter by search term
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.project.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const toggleExpandStudent = (studentId: string) => {
    if (expandedStudent === studentId) {
      setExpandedStudent(null);
    } else {
      setExpandedStudent(studentId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hy-AM');
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('');
  };

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tableHeaderClass = theme === 'dark' ? 'bg-gray-900 text-gray-300' : '';
  const tableRowClass = theme === 'dark' ? 'hover:bg-gray-900/30 border-gray-700' : 'hover:bg-gray-100';
  const selectTriggerClass = theme === 'dark' ? 'bg-gray-900 border-gray-700' : '';
  const selectContentClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';

  return (
    <AdminLayout pageTitle="Ուսանողների առաջադիմություն">
      <Card className={`animate-fade-in ${cardClass}`}>
        <CardHeader>
          <CardTitle>Ուսանողների առաջադիմություն</CardTitle>
          <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
            Հետևեք ուսանողների նախագծերի առաջընթացին
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Փնտրել ուսանողների..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger className={`w-[180px] ${selectTriggerClass}`}>
                    <SelectValue placeholder="Ընտրել խումբը" />
                  </SelectTrigger>
                  <SelectContent className={selectContentClass}>
                    {groups.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {filteredStudents.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader className={tableHeaderClass}>
                    <TableRow className={theme === 'dark' ? 'border-gray-700' : ''}>
                      <TableHead>Ուսանող</TableHead>
                      <TableHead>Նախագիծ</TableHead>
                      <TableHead>Խումբ</TableHead>
                      <TableHead>Առաջընթաց</TableHead>
                      <TableHead>Հանձնարարություններ</TableHead>
                      <TableHead>Վերջնաժամկետ</TableHead>
                      <TableHead>Վերջին ակտիվություն</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <React.Fragment key={student.id}>
                        <TableRow 
                          className={`${tableRowClass} ${expandedStudent === student.id ? (theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50') : ''}`}
                          onClick={() => toggleExpandStudent(student.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={student.avatar} alt={student.name} />
                                <AvatarFallback className={theme === 'dark' ? 'bg-gray-700 text-gray-200' : ''}>
                                  {getInitials(student.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-xs text-muted-foreground">{student.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{student.project}</TableCell>
                          <TableCell>{`${student.group} (${student.year}-րդ կուրս)`}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={student.progress} 
                                max={100} 
                                className={`h-2 w-[60px] ${theme === 'dark' ? 'bg-gray-700' : ''}`}
                                indicatorClassName={getProgressColor(student.progress)}
                              />
                              <div className="text-sm font-medium">{student.progress}%</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {`${student.completedTasks}/${student.totalTasks}`}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(student.dueDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(student.lastActivity)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={theme === 'dark' ? 'hover:bg-gray-700' : ''}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandStudent(student.id);
                              }}
                            >
                              {expandedStudent === student.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded details row */}
                        {expandedStudent === student.id && (
                          <TableRow className={theme === 'dark' ? 'border-gray-700 bg-gray-900/30' : 'bg-gray-50/50'}>
                            <TableCell colSpan={8} className="p-0">
                              <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900/20' : ''}`}>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4" />
                                  Նախագծի փուլեր և առաջընթացը
                                </h4>
                                
                                <div className="space-y-4">
                                  {/* Timeline/milestones */}
                                  <div className="relative ml-3">
                                    {studentMilestones[student.id]?.map((milestone, idx) => (
                                      <div key={idx} className="mb-6 relative">
                                        {/* Line connecting milestones */}
                                        {idx < studentMilestones[student.id].length - 1 && (
                                          <div className={`absolute top-3 left-[9px] h-full w-0.5 ${
                                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                          }`}></div>
                                        )}
                                        
                                        {/* Milestone dot */}
                                        <div className={`absolute top-1 left-[-12px] h-5 w-5 rounded-full border-2 ${
                                          milestone.status === 'completed' 
                                            ? (theme === 'dark' ? 'bg-green-500 border-green-700' : 'bg-green-500 border-green-600')
                                            : milestone.status === 'in_progress'
                                              ? (theme === 'dark' ? 'bg-blue-500 border-blue-700' : 'bg-blue-500 border-blue-600')
                                              : (theme === 'dark' ? 'bg-gray-600 border-gray-700' : 'bg-gray-300 border-gray-400')
                                        }`}></div>
                                        
                                        {/* Milestone content */}
                                        <div className={`pl-6 ${idx === studentMilestones[student.id].length - 1 ? 'pb-0' : 'pb-2'}`}>
                                          <div className="flex flex-wrap justify-between gap-2">
                                            <div className="font-medium">{milestone.title}</div>
                                            <div className="flex items-center gap-2">
                                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                <span>{formatDate(milestone.date)}</span>
                                              </div>
                                              {getStatusBadge(milestone.status)}
                                            </div>
                                          </div>
                                          <div className="text-sm text-muted-foreground mt-1">
                                            {milestone.description}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <div className="flex justify-end">
                                    <Button variant="outline" size="sm" className={theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : ''}>
                                      <Eye className="h-4 w-4 mr-1" /> Դիտել ամբողջ նախագիծը
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center py-12 text-center rounded-md border ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-muted-foreground'}`}>
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">Ուսանողներ չեն գտնվել</h3>
                <p className="text-sm mt-1 max-w-sm">
                  Ոչ մի ուսանող չի համապատասխանում ձեր որոնման պարամետրերին։
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default StudentProgressPage;
