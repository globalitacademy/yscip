
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Download, Code, Award, PlusCircle } from 'lucide-react';

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  
  if (!user || user.role !== 'student') {
    return <Navigate to="/login" />;
  }

  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : '';
  const tabsListClass = theme === 'dark' ? 'bg-gray-700' : '';
  const tabsTriggerClass = theme === 'dark' ? 'data-[state=active]:bg-gray-800 data-[state=active]:text-gray-100' : '';
  const buttonClass = theme === 'dark' ? 'hover:bg-gray-700 border-gray-600' : '';
  
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(n => n[0])
      .join('');
  };

  return (
    <AdminLayout pageTitle="Իմ պորտֆոլիոն">
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {/* Անձնական տվյալներ */}
        <Card className={`lg:col-span-1 ${cardClass}`}>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className={theme === 'dark' ? 'bg-gray-700 text-gray-200' : ''}>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
                Ուսանող
              </CardDescription>
              <p className="text-sm mt-1 text-muted-foreground">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mt-2">
              <Button variant="outline" size="sm" className={`flex items-center gap-1 ${buttonClass}`}>
                <Edit className="h-4 w-4" /> Խմբագրել
              </Button>
              <Button variant="outline" size="sm" className={`flex items-center gap-1 ${buttonClass}`}>
                <Download className="h-4 w-4" /> CV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Հիմնական տեղեկատվություն */}
        <Card className={`lg:col-span-2 ${cardClass}`}>
          <CardHeader>
            <CardTitle>Պորտֆոլիո</CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : ''}>
              Ձեր մասնագիտական պրոֆիլը և հմտությունները
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="skills">
              <TabsList className={`mb-4 ${tabsListClass}`}>
                <TabsTrigger value="skills" className={tabsTriggerClass}>Հմտություններ</TabsTrigger>
                <TabsTrigger value="education" className={tabsTriggerClass}>Կրթություն</TabsTrigger>
                <TabsTrigger value="experience" className={tabsTriggerClass}>Փորձ</TabsTrigger>
              </TabsList>

              <TabsContent value="skills">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Հմտություններ</h3>
                    <Button variant="outline" size="sm" className={`flex items-center gap-1 ${buttonClass}`}>
                      <PlusCircle className="h-3 w-3" /> Ավելացնել
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <Code className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                        <span className="font-medium">JavaScript</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                        <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`} style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <Code className={`h-4 w-4 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
                        <span className="font-medium">React</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                        <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'}`} style={{ width: '60%' }}></div>
                      </div>
                    </div>

                    <div className={`p-3 border rounded-lg ${theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <Code className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
                        <span className="font-medium">Node.js</span>
                      </div>
                      <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
                        <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-green-500' : 'bg-green-600'}`} style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="education">
                <div className={`text-center py-8 border rounded-md ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'text-muted-foreground'}`}>
                  Դեռևս չկա ավելացված կրթություն։
                </div>
              </TabsContent>
              
              <TabsContent value="experience">
                <div className={`text-center py-8 border rounded-md ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'text-muted-foreground'}`}>
                  Դեռևս չկա ավելացված աշխատանքային փորձ։
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Նախագծերի բաժին */}
      <div className="mt-6">
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Իմ նախագծերը</CardTitle>
            <Button variant="outline" size="sm" className={buttonClass}>
              <Award className="mr-2 h-4 w-4" /> Դիտել բոլորը
            </Button>
          </CardHeader>
          <CardContent>
            <div className={`text-center py-8 border rounded-md ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'text-muted-foreground'}`}>
              Դեռևս չկան ավարտված նախագծեր։ Ավարտված նախագծերը կհայտնվեն այստեղ։
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default PortfolioPage;
