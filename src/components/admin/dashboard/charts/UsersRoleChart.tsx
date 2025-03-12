
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUsersByRole } from '@/data/userRoles';

const UsersRoleChart: React.FC = () => {
  const userRoleData = [
    { name: 'Ուսանողներ', value: getUsersByRole('student').length, color: '#8884d8' },
    { name: 'Դասախոսներ', value: getUsersByRole('lecturer').length + getUsersByRole('instructor').length, color: '#82ca9d' },
    { name: 'Ղեկավարներ', value: getUsersByRole('supervisor').length + getUsersByRole('project_manager').length, color: '#ffc658' },
    { name: 'Գործատուներ', value: getUsersByRole('employer').length, color: '#ff8042' },
    { name: 'Ադմիններ', value: getUsersByRole('admin').length, color: '#83a6ed' }
  ];

  return (
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
  );
};

export default UsersRoleChart;
