
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Briefcase } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const StatCards: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-36 bg-gray-200 rounded mt-1"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
          <div className="text-3xl font-bold">{stats.userCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            +{stats.newUsersLastWeek} վերջին շաբաթում
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
          <div className="text-3xl font-bold">{stats.courseCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            +{stats.newCoursesLastMonth} վերջին ամսում
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
          <div className="text-3xl font-bold">{stats.projectCount}</div>
          <div className="text-xs text-muted-foreground mt-1">
            +{stats.newProjectsLastMonth} վերջին ամսում
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
