
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderKanban, GraduationCap, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboardStats';

const StatCards: React.FC = () => {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Օգտատերեր</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-1">
              <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.userCount.toLocaleString()}</div>
              {stats.newUsersLastWeek > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsersLastWeek} նոր այս շաբաթ
                </p>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/users')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Նախագծեր</CardTitle>
          <FolderKanban className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-1">
              <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.projectCount.toLocaleString()}</div>
              {stats.newProjectsLastMonth > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{stats.newProjectsLastMonth} նոր այս ամիս
                </p>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/admin-projects')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Դասընթացներ</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-1">
              <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.courseCount.toLocaleString()}</div>
              {stats.newCoursesLastMonth > 0 && (
                <p className="text-xs text-muted-foreground">
                  +{stats.newCoursesLastMonth} նոր այս ամիս
                </p>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/courses')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Կազմակերպություններ</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-1">
              <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats.usersByRole
                  .find(role => role.name === "Գործատուներ")?.value || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Գրանցված գործատուներ
              </p>
            </>
          )}
        </CardContent>
        <CardFooter className="p-2">
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/organizations')}>
            Դիտել բոլորը
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StatCards;
