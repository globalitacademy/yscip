
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const RegistrationChart: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
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
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <BarChart data={stats.registrationsByMonth}>
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
