
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/AdminLayout';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, FolderGit2, CheckSquare, Layers } from 'lucide-react';

const LecturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user || (user.role !== 'lecturer' && user.role !== 'instructor')) {
    return <Navigate to="/login" />;
  }

  const navigateToPage = (path: string) => {
    navigate(path);
  };

  return (
    <AdminLayout pageTitle="Դասախոսի վահանակ">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Իմ դասընթացները
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Ընդհանուր դասընթացներ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ուսանողներ
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <p className="text-xs text-muted-foreground">
              Ակտիվ ուսանողներ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Նախագծեր
            </CardTitle>
            <FolderGit2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Ուսանողական նախագծեր
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Արագ ուղիներ</CardTitle>
            <CardDescription>Արագ մուտք գործեք հիմնական բաժինները</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between" onClick={() => navigateToPage('/admin/lecturer-student-projects')}>
              Ուսանողների նախագծեր <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => navigateToPage('/admin/lecturer-programs')}>
              Ուսումնական ծրագրեր <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => navigateToPage('/admin/lecturer-courses')}>
              Դասընթացներ <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => navigateToPage('/admin/lecturer-educational-modules')}>
              Ուսումնական մոդուլներ <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between" onClick={() => navigateToPage('/admin/lecturer-tasks')}>
              Հանձնարարություններ <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Առաջիկա հանձնարարություններ</CardTitle>
            <CardDescription>Հաջորդ 7 օրվա հանձնարարությունները</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Ֆունկցիաների իմպլեմենտացիա</p>
                  <p className="text-sm text-muted-foreground">Վերջնաժամկետ՝ 15/05/2025</p>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Սպասվում է
                </Badge>
              </li>
              <li className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">SQL հարցումների վարժություններ</p>
                  <p className="text-sm text-muted-foreground">Վերջնաժամկետ՝ 25/05/2025</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Առաջիկա
                </Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Վերջին ակտիվություններ</CardTitle>
            <CardDescription>Վերջին գործողությունները համակարգում</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 border-b pb-2">
                <div className="bg-blue-100 p-1 rounded-full">
                  <Users className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Նոր ուսանող է միացել</p>
                  <p className="text-xs text-muted-foreground">Մարիամ Պետրոսյանը միացել է "Ծրագրավորման հիմունքներ" դասընթացին</p>
                  <p className="text-xs text-muted-foreground">10 րոպե առաջ</p>
                </div>
              </li>
              <li className="flex items-start gap-2 border-b pb-2">
                <div className="bg-green-100 p-1 rounded-full">
                  <CheckSquare className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">Հանձնարարություն է ավարտվել</p>
                  <p className="text-xs text-muted-foreground">"Տվյալների կառուցվածքների միջանկյալ ստուգում" հանձնարարությունը ավարտվել է</p>
                  <p className="text-xs text-muted-foreground">2 ժամ առաջ</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList>
          <TabsTrigger value="courses">Դասընթացներ</TabsTrigger>
          <TabsTrigger value="students">Ուսանողներ</TabsTrigger>
          <TabsTrigger value="projects">Նախագծեր</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Իմ դասընթացները</CardTitle>
                <CardDescription>Ձեր կողմից դասավանդվող դասընթացները</CardDescription>
              </div>
              <Button onClick={() => navigateToPage('/admin/lecturer-courses')}>
                Տեսնել բոլորը
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-medium">Ծրագրավորման հիմունքներ</h4>
                    <p className="text-sm text-muted-foreground">1-ին կիսամյակ | 32 ուսանող</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ակտիվ
                  </Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-medium">Օբյեկտ կողմնորոշված ծրագրավորում</h4>
                    <p className="text-sm text-muted-foreground">3-րդ կիսամյակ | 25 ուսանող</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ակտիվ
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Տվյալների կառուցվածքներ</h4>
                    <p className="text-sm text-muted-foreground">2-րդ կիսամյակ | 28 ուսանող</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Առաջիկա
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Իմ ուսանողները</CardTitle>
                <CardDescription>Ձեր դասընթացներին գրանցված ուսանողները</CardDescription>
              </div>
              <Button variant="outline">
                Տեսնել բոլորը
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">
                      ԱՀ
                    </div>
                    <div>
                      <p className="font-medium">Արամ Հակոբյան</p>
                      <p className="text-xs text-muted-foreground">Ծրագրավորման հիմունքներ</p>
                    </div>
                  </div>
                  <Badge variant="outline">95%</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">
                      ՄՊ
                    </div>
                    <div>
                      <p className="font-medium">Մարիամ Պետրոսյան</p>
                      <p className="text-xs text-muted-foreground">Ծրագրավորման հիմունքներ</p>
                    </div>
                  </div>
                  <Badge variant="outline">82%</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">
                      ԴՄ
                    </div>
                    <div>
                      <p className="font-medium">Դավիթ Մկրտչյան</p>
                      <p className="text-xs text-muted-foreground">Օբյեկտ կողմնորոշված ծրագրավորում</p>
                    </div>
                  </div>
                  <Badge variant="outline">78%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Ուսանողական նախագծեր</CardTitle>
                <CardDescription>Ձեր ուսանողների նախագծերը</CardDescription>
              </div>
              <Button onClick={() => navigateToPage('/admin/lecturer-student-projects')}>
                Տեսնել բոլորը
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-medium">Կառավարման տեղեկատվական համակարգի մշակում</h4>
                    <p className="text-sm text-muted-foreground">Արամ Հակոբյան | Վերջնաժամկետ՝ 15/06/2025</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Ընթացքի մեջ
                  </Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h4 className="font-medium">Առցանց ուսուցման հարթակի մշակում</h4>
                    <p className="text-sm text-muted-foreground">Մարիամ Պետրոսյան | Վերջնաժամկետ՝ 30/05/2025</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Սպասում է
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Ինտերնետ խանութ վեբ հավելվածի մշակում</h4>
                    <p className="text-sm text-muted-foreground">Դավիթ Մկրտչյան | Վերջնաժամկետ՝ 10/07/2025</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Ավարտված
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default LecturerDashboard;
