
import React from 'react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const StatsTab: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Օգտատերերի բաշխում</CardTitle>
            <CardDescription>Օգտատերերի բաշխում ըստ դերերի</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Նախագծերի կարգավիճակներ</CardTitle>
            <CardDescription>Նախագծերի բաշխում ըստ կարգավիճակների</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter out entries with zero values
  const filteredUsersByRole = stats.usersByRole.filter(entry => entry.value > 0);
  const filteredProjectsByStatus = stats.projectsByStatus.filter(entry => entry.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Օգտատերերի բաշխում</CardTitle>
          <CardDescription>Օգտատերերի բաշխում ըստ դերերի</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsersByRole.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Տվյալներ չկան
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredUsersByRole}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Նախագծերի կարգավիճակներ</CardTitle>
          <CardDescription>Նախագծերի բաշխում ըստ կարգավիճակների</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProjectsByStatus.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Տվյալներ չկան
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredProjectsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {filteredProjectsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsTab;
