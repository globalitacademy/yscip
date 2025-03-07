import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, BookOpen, Building, User, UserCog, Briefcase, GraduationCap, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers, getUsersByRole } from '@/data/userRoles';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock data for charts
  const userRoleData = [
    { name: 'Ուսանողներ', value: getUsersByRole('student').length, color: '#8884d8' },
    { name: 'Դասախոսներ', value: getUsersByRole('lecturer').length + getUsersByRole('instructor').length, color: '#82ca9d' },
    { name: 'Ղեկավարներ', value: getUsersByRole('supervisor').length + getUsersByRole('project_manager').length, color: '#ffc658' },
    { name: 'Գործատուներ', value: getUsersByRole('employer').length, color: '#ff8042' },
    { name: 'Ադմիններ', value: getUsersByRole('admin').length, color: '#83a6ed' }
  ];

  const registrationData = [
    { name: 'Հունվար', count: 12 },
    { name: 'Փետրվար', count: 19 },
    { name: 'Մարտ', count: 25 },
    { name: 'Ապրիլ', count: 32 },
    { name: 'Մայիս', count: 48 },
    { name: 'Հունիս', count: 30 }
  ];

  const projectsData = [
    { name: 'Ընթացքում', value: 14, color: '#82ca9d' },
    { name: 'Ավարտված', value: 22, color: '#8884d8' },
    { name: 'Սպասման մեջ', value: 8, color: '#ffc658' }
  ];
  
  // Recent activity mock data
  const recentActivity = [
    { id: 1, user: 'Արման Գրիգորյան', action: 'գրանցվել է որպես ուսանող', time: '10 րոպե առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arman' },
    { id: 2, user: 'Նարե Հարությունյան', action: 'ավելացրել է նոր նախագիծ', time: '32 րոպե առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nare' },
    { id: 3, user: 'Վահե Սարգսյան', action: 'թարմացրել է իր պրոֆիլը', time: '1 ժամ առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vahe' },
    { id: 4, user: 'Անի Մկրտչյան', action: 'միացել է «ՎԵԲ ծրագրավորում» կուրսին', time: '3 ժամ առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ani' },
    { id: 5, user: 'Համլետ Պողոսյան', action: 'հաստատել է ուսանողի նախագիծը', time: '5 ժամ առաջ', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hamlet' }
  ];

  // Notifications mock data
  const notifications = [
    { id: 1, title: 'Նոր գրանցման դիմում', message: '3 նոր գրանցման դիմում սպասում է հաստատման', time: '15 րոպե առաջ', type: 'warning' },
    { id: 2, title: 'Համակարգի թարմացում', message: 'Պլանային թարմացում է նախատեսված այսօր 23:00-ին', time: '1 ժամ առաջ', type: 'info' },
    { id: 3, title: 'Ուշադրություն', message: '5 ուսանողներ սպասում են նախագծի հաստատման', time: '3 ժամ առաջ', type: 'alert' }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Ադմինիստրատորի վահանակ</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/users')} className="text-xs md:text-sm">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Օգտատերեր</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/organizations')} className="text-xs md:text-sm">
            <Building className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Կազմակերպություններ</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/courses/manage')} className="text-xs md:text-sm">
            <BookOpen className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Կուրսեր</span>
          </Button>
          <Button variant="outline" onClick={() => navigate('/specializations')} className="text-xs md:text-sm">
            <GraduationCap className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Մասնագիտություններ</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Օգտատերեր
            </CardTitle>
            <CardDescription>Ընդհանուր օգտատերերի քանակ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockUsers.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              +5 վերջին շաբաթում
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              Կուրսեր
            </CardTitle>
            <CardDescription>Ընդհանուր կուրսերի քանակ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="text-xs text-muted-foreground mt-1">
              +2 վերջին ամսում
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-amber-500" />
              Նախագծեր
            </CardTitle>
            <CardDescription>Ընդհանուր նախագծերի քանակ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">44</div>
            <div className="text-xs text-muted-foreground mt-1">
              +8 վերջին ամսում
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stats" className="mb-6">
        <TabsList className="mb-4 w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="stats">Վիճակագրություն</TabsTrigger>
          <TabsTrigger value="activity">Գործողություններ</TabsTrigger>
          <TabsTrigger value="notifications">Ծանուցումներ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <User className="h-5 w-5 text-purple-500" />
                  Օգտատերերն ըստ դերի
                </CardTitle>
                <CardDescription>Գրանցված օգտատերերի բաշխումն ըստ դերերի</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Գրանցումների դինամիկա
                </CardTitle>
                <CardDescription>Օգտատերերի գրանցումների քանակն ըստ ամիսների</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Գրանցված օգտատերեր" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  Նախագծերն ըստ կարգավիճակի
                </CardTitle>
                <CardDescription>Նախագծերի բաշխումն ըստ կարգավիճակի</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={projectsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <UserCog className="h-5 w-5 text-amber-500" />
                  Համակարգի կարգավիճակ
                </CardTitle>
                <CardDescription>Համակարգի հիմնական ցուցանիշները</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Համակարգի բեռնվածություն</span>
                    <span className="text-green-500 font-semibold">Նորմալ (32%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Վերջին պահուստավորում</span>
                    <span className="text-gray-600">2 ժամ առաջ</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Պլանային թարմացում</span>
                    <span className="text-amber-500">Այսօր 23:00</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Ակտիվ սեսիաներ</span>
                    <span className="text-gray-600">145</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Միջին արձագանքի ժամանակ</span>
                    <span className="text-green-500">210ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Activity className="h-5 w-5 text-blue-500" />
                Վերջին գործողություններ
              </CardTitle>
              <CardDescription>Օգտատերերի վերջին գործողությունները համակարգում</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">Դիտել բոլոր գործողությունները</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <Bell className="h-5 w-5 text-amber-500" />
                Համակարգային ծանուցումներ
              </CardTitle>
              <CardDescription>Կարևոր ծանուցումներ համակարգի մասին</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-lg ${
                      notification.type === 'warning' ? 'border-amber-200 bg-amber-50' : 
                      notification.type === 'alert' ? 'border-red-200 bg-red-50' : 
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm mt-1">{notification.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline">Դիտել բոլոր ծանուցումները</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
