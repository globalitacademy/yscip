
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const UsersRoleChart: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
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
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter out entries with zero values
  const filteredUsersByRole = stats.usersByRole.filter(entry => entry.value > 0);

  if (filteredUsersByRole.length === 0) {
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
          <div className="h-[250px] md:h-[300px] flex items-center justify-center text-muted-foreground">
            Տվյալներ չկան
          </div>
        </CardContent>
      </Card>
    );
  }

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
                data={filteredUsersByRole}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {filteredUsersByRole.map((entry, index) => (
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
