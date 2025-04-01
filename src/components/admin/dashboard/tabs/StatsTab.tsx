
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const userRoleData = [
  { name: 'Ուսանողներ', value: 64, color: '#8884d8' },
  { name: 'Դասախոսներ', value: 12, color: '#82ca9d' },
  { name: 'Ղեկավարներ', value: 8, color: '#ffc658' },
  { name: 'Գործատուներ', value: 6, color: '#ff8042' },
  { name: 'Ադմիններ', value: 2, color: '#0088fe' },
];

const projectStatusData = [
  { name: 'Ընթացիկ', value: 42, color: '#0088FE' },
  { name: 'Ավարտված', value: 38, color: '#00C49F' },
  { name: 'Չսկսված', value: 20, color: '#FFBB28' },
];

const StatsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Օգտատերերի բաշխում</CardTitle>
          <CardDescription>Օգտատերերի բաշխում ըստ դերերի</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          <CardTitle>Նախագծերի կարգավիճակներ</CardTitle>
          <CardDescription>Նախագծերի բաշխում ըստ կարգավիճակների</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {projectStatusData.map((entry, index) => (
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
    </div>
  );
};

export default StatsTab;
