
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Briefcase } from 'lucide-react';
import { mockUsers } from '@/data/userRoles';

const AdminDashboardSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Օգտատերեր
          </CardTitle>
          <CardDescription>Ընդհանուր օգտատերերի քանակ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{mockUsers.length}</div>
          <div className="text-xs text-muted-foreground mt-1">
            +5 վերջին շաբաթում
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            Կուրսեր
          </CardTitle>
          <CardDescription>Ընդհանուր կուրսերի քանակ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">12</div>
          <div className="text-xs text-muted-foreground mt-1">
            +2 վերջին ամսում
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-amber-500" />
            Նախագծեր
          </CardTitle>
          <CardDescription>Ընդհանուր նախագծերի քանակ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">44</div>
          <div className="text-xs text-muted-foreground mt-1">
            +8 վերջին ամսում
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardSummary;
