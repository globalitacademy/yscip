
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfileProjects from '@/components/portfolio/ProfileProjects';
import ProfileSkills from '@/components/portfolio/ProfileSkills';
import ProfileProgress from '@/components/portfolio/ProfileProgress';
import ProfileCV from '@/components/portfolio/ProfileCV';
import ProfileEditor from '@/components/portfolio/ProfileEditor';
import { Pencil, Settings, ExternalLink } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const PortfolioPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Խնդրում ենք մուտք գործել համակարգ</h2>
            <p className="text-gray-600">Պրոֆիլը դիտելու համար անհրաժեշտ է մուտք գործել համակարգ։</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Add some default bio if not present
  const userBio = user.bio || "Փորձում եմ ամեն օր սովորել ինչ-որ նոր բան և կիսվել իմ գիտելիքներով մյուսների հետ։";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt={user.name} />
                <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
              </Avatar>
              
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600 mt-1">{user.role === 'student' ? 'Ուսանող' : ''}</p>
                
                <div className="mt-3 space-y-1">
                  {user.department && (
                    <p className="text-sm">
                      <span className="font-medium">Ֆակուլտետ:</span> {user.department}
                    </p>
                  )}
                  
                  {user.course && (
                    <p className="text-sm">
                      <span className="font-medium">Կուրս:</span> {user.course}
                    </p>
                  )}
                  
                  {user.group && (
                    <p className="text-sm">
                      <span className="font-medium">Խումբ:</span> {user.group}
                    </p>
                  )}
                  
                  <p className="text-sm">
                    <span className="font-medium">Էլ. փոստ:</span> {user.email}
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600 italic">
                    "{userBio}"
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => setIsProfileEditorOpen(true)}
                >
                  <Pencil size={14} />
                  Խմբագրել
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Settings size={14} />
                      Կարգավորումներ
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Տեսանելիության կարգավորումներ</DropdownMenuItem>
                    <DropdownMenuItem>Ծանուցումների կարգավորումներ</DropdownMenuItem>
                    <DropdownMenuItem>Գաղտնաբառի փոփոխություն</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="profile">Պրոֆիլ</TabsTrigger>
                <TabsTrigger value="projects">Նախագծեր</TabsTrigger>
                <TabsTrigger value="skills">Հմտություններ</TabsTrigger>
                <TabsTrigger value="progress">Առաջադիմություն</TabsTrigger>
                <TabsTrigger value="cv">CV</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="profile" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Վերջին նախագծեր</CardTitle>
                    <CardDescription>Ձեր վերջին կատարած նախագծերը</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium">Դինամիկ վեբ կայք Node.js-ով</h3>
                        <p className="text-sm text-gray-600">MongoDB տվյալների բազայով կայք</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary">Node.js</Badge>
                          <Badge variant="secondary">Express</Badge>
                          <Badge variant="secondary">MongoDB</Badge>
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <h3 className="font-medium">React հավելված</h3>
                        <p className="text-sm text-gray-600">Single Page Application</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary">React</Badge>
                          <Badge variant="secondary">Redux</Badge>
                          <Badge variant="secondary">TypeScript</Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="mt-4 p-0 flex items-center gap-1" 
                      onClick={() => setActiveTab('projects')}
                    >
                      Բոլոր նախագծերը <ExternalLink size={14} />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Հմտություններ</CardTitle>
                    <CardDescription>Ձեր գլխավոր հմտությունները</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Ծրագրավորման լեզուներ</h3>
                        <div className="flex flex-wrap gap-1">
                          <Badge>JavaScript</Badge>
                          <Badge>TypeScript</Badge>
                          <Badge>HTML/CSS</Badge>
                          <Badge>Python</Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Շրջանակներ և գրադարաններ</h3>
                        <div className="flex flex-wrap gap-1">
                          <Badge>React</Badge>
                          <Badge>Node.js</Badge>
                          <Badge>Express</Badge>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Տվյալների բազաներ</h3>
                        <div className="flex flex-wrap gap-1">
                          <Badge>MongoDB</Badge>
                          <Badge>MySQL</Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="mt-4 p-0 flex items-center gap-1" 
                      onClick={() => setActiveTab('skills')}
                    >
                      Բոլոր հմտությունները <ExternalLink size={14} />
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Առաջադիմություն</CardTitle>
                    <CardDescription>Ձեր ընթացիկ առաջադիմությունը</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4 text-center">
                        <h3 className="text-xl font-bold text-primary">5</h3>
                        <p className="text-sm text-gray-600">Ավարտված նախագծեր</p>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <h3 className="text-xl font-bold text-primary">3</h3>
                        <p className="text-sm text-gray-600">Ընթացիկ նախագծեր</p>
                      </div>
                      <div className="border rounded-md p-4 text-center">
                        <h3 className="text-xl font-bold text-primary">4.8</h3>
                        <p className="text-sm text-gray-600">Միջին գնահատական</p>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="mt-4 p-0 flex items-center gap-1" 
                      onClick={() => setActiveTab('progress')}
                    >
                      Մանրամասն <ExternalLink size={14} />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="projects">
              <ProfileProjects />
            </TabsContent>
            
            <TabsContent value="skills">
              <ProfileSkills />
            </TabsContent>
            
            <TabsContent value="progress">
              <ProfileProgress />
            </TabsContent>
            
            <TabsContent value="cv">
              <ProfileCV />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      
      {/* Profile Editor */}
      <ProfileEditor 
        isOpen={isProfileEditorOpen} 
        onClose={() => setIsProfileEditorOpen(false)} 
      />
    </div>
  );
};

export default PortfolioPage;
