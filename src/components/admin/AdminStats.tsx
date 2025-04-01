
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Հնվ', users: 12, projects: 5, courses: 2 },
  { name: 'Փտվ', users: 19, projects: 7, courses: 3 },
  { name: 'Մրտ', users: 25, projects: 10, courses: 4 },
  { name: 'Ապր', users: 32, projects: 13, courses: 5 },
  { name: 'Մյս', users: 45, projects: 18, courses: 7 },
  { name: 'Հնս', users: 52, projects: 21, courses: 8 },
];

const AdminStats: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Ամսական վիճակագրություն</CardTitle>
        <CardDescription>Համակարգի օգտագործման վիճակագրություն ըստ ամիսների</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" name="Օգտատերեր" fill="#8884d8" />
              <Bar dataKey="projects" name="Նախագծեր" fill="#82ca9d" />
              <Bar dataKey="courses" name="Դասընթացներ" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStats;
