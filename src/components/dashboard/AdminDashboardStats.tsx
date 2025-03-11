
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Briefcase, Activity, User, UserCog, GraduationCap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getUsersByRole } from '@/data/userRoles';

const AdminDashboardStats: React.FC = () => {
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

  return (
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
  );
};

export default AdminDashboardStats;
