
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderKanban, GraduationCap, Building, BookOpen, CheckSquare, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useAuth } from '@/contexts/AuthContext';

const StatCards: React.FC = () => {
  const navigate = useNavigate();
  const {
    stats,
    loading
  } = useDashboardStats();
  
  const { user } = useAuth();
  
  // Early return if no user
  if (!user) return null;
  
  // Render cards based on user role
  const renderCards = () => {
    switch (user.role) {
      case 'admin':
        return (
          <>
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
                <CardTitle className="text-sm font-medium">Կուրսեր</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
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
                      {stats.usersByRole.find(role => role.name === "Գործատուներ")?.value || 0}
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
          </>
        );
      
      case 'lecturer':
      case 'instructor':
      case 'supervisor':
      case 'project_manager':
        return (
          <>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ուսանողներ</CardTitle>
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
                    <div className="text-2xl font-bold">
                      {stats.usersByRole.find(role => role.name === "Ուսանողներ")?.value || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ընդհանուր ուսանողներ
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/supervised-students')}>
                  Դիտել ուսանողներին
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
                    <p className="text-xs text-muted-foreground">
                      Ընդհանուր նախագծեր
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/student-projects')}>
                  Դիտել նախագծերը
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Կուրսեր</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
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
                    <p className="text-xs text-muted-foreground">
                      Ընդհանուր դասընթացներ
                    </p>
                  </>
                )}
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/courses')}>
                  Դիտել դասընթացները
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Հանձնարարություններ</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Ընթացիկ հանձնարարություններ
                </p>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/tasks')}>
                  Դիտել հանձնարարությունները
                </Button>
              </CardFooter>
            </Card>
          </>
        );
      
      case 'employer':
        return (
          <>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Իմ նախագծերը</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Ակտիվ նախագծեր
                </p>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/projects')}>
                  Դիտել նախագծերը
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Առաջարկված նախագծեր</CardTitle>
                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Սպասող նախագծեր
                </p>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/project-proposals')}>
                  Դիտել առաջարկները
                </Button>
              </CardFooter>
            </Card>
          </>
        );
      
      case 'student':
        return (
          <>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Իմ նախագծերը</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Ակտիվ նախագծեր
                </p>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/my-projects')}>
                  Դիտել նախագծերը
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Հանձնարարություններ</CardTitle>
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Ընթացիկ հանձնարարություններ
                </p>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/tasks')}>
                  Դիտել հանձնարարությունները
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ուսումնառություն</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Ընթացիկ դասընթացներ
                </p>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/courses')}>
                  Դիտել դասընթացները
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Պորտֆոլիո</CardTitle>
                <Layers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">
                  Պորտֆոլիոյի լրացվածություն
                </p>
              </CardContent>
              <CardFooter className="p-2">
                <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/admin/portfolio')}>
                  Պորտֆոլիո
                </Button>
              </CardFooter>
            </Card>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {renderCards()}
    </div>
  );
};

export default StatCards;
