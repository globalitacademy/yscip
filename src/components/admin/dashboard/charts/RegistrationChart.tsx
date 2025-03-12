
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RegistrationChart: React.FC = () => {
  const registrationData = [
    { name: 'Հունվար', count: 12 },
    { name: 'Փետրվար', count: 19 },
    { name: 'Մարտ', count: 25 },
    { name: 'Ապրիլ', count: 32 },
    { name: 'Մայիս', count: 48 },
    { name: 'Հունիս', count: 30 }
  ];

  return (
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
  );
};

export default RegistrationChart;
