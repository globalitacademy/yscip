
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';

// Sample data for the charts
const barData = [
  { name: 'Հնվ', students: 65, projects: 28 },
  { name: 'Փտվ', students: 59, projects: 32 },
  { name: 'Մրտ', students: 80, projects: 41 },
  { name: 'Ապր', students: 81, projects: 45 },
  { name: 'Մյս', students: 56, projects: 36 },
  { name: 'Հնս', students: 55, projects: 30 },
  { name: 'Հլս', students: 40, projects: 25 },
];

const pieData = [
  { name: 'Ուսանողներ', value: 540, color: '#8884d8' },
  { name: 'Դասախոսներ', value: 120, color: '#82ca9d' },
  { name: 'Գործատուներ', value: 85, color: '#ffc658' },
  { name: 'Այլ', value: 40, color: '#ff8042' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const StatsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Նոր օգտատերեր և նախագծեր</CardTitle>
          <CardDescription>Վերջին 7 ամիսների տվյալները</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" name="Նոր ուսանողներ" fill="#8884d8" />
                <Bar dataKey="projects" name="Նոր նախագծեր" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Օգտատերերի բաշխում</CardTitle>
          <CardDescription>Ըստ դերերի</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
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
