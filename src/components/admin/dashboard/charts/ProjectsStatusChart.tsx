
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProjectsStatusChart: React.FC = () => {
  const projectsData = [
    { name: 'Ընթացքում', value: 14, color: '#82ca9d' },
    { name: 'Ավարտված', value: 22, color: '#8884d8' },
    { name: 'Սպասման մեջ', value: 8, color: '#ffc658' }
  ];

  return (
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
  );
};

export default ProjectsStatusChart;
