import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { educationalModules } from '@/components/educationalCycle/modules';
import { EducationalModule } from '@/components/educationalCycle/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, BookOpen, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';
import ModuleLearning from '@/components/educationalCycle/ModuleLearning';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ModuleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [module, setModule] = useState<EducationalModule | null>(null);
  const [nextModule, setNextModule] = useState<EducationalModule | null>(null);
  const [prevModule, setPrevModule] = useState<EducationalModule | null>(null);
  const [activeTab, setActiveTab] = useState("learn");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    const moduleId = parseInt(id, 10);
    const foundModule = educationalModules.find(m => m.id === moduleId);
    
    if (foundModule) {
      setModule(foundModule);
      
      // Find next and previous modules
      const currentIndex = educationalModules.findIndex(m => m.id === moduleId);
      setNextModule(educationalModules[currentIndex + 1] || null);
      setPrevModule(currentIndex > 0 ? educationalModules[currentIndex - 1] : null);
    } else {
      // Redirect to modules list if module not found
      navigate('/');
    }
  }, [id, navigate]);

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p>Բեռնում...</p>
        </div>
      </div>
    );
  }

  // Status based styling
  const getStatusStyles = () => {
    switch (module.status) {
      case 'completed':
        return {
          accent: 'border-green-500 dark:border-green-600',
          bg: 'bg-green-50 dark:bg-green-900/20',
          icon: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        };
      case 'in-progress':
        return {
          accent: 'border-blue-500 dark:border-blue-600',
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          icon: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        };
      default:
        return {
          accent: 'border-gray-200 dark:border-gray-700',
          bg: 'bg-white dark:bg-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
    }
  };
  
  const styles = getStatusStyles();
  const Icon = module.icon;
  
  const getStatusText = () => {
    switch (module.status) {
      case 'not-started': return 'Չսկսված';
      case 'in-progress': return 'Ընթացքի մեջ';
      case 'completed': return 'Ավարտված';
      default: return module.status;
    }
  };

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <Header />
      
      <main className="flex-grow">
        {/* Module Banner */}
        <div className={cn("py-8 md:py-12", styles.bg)}>
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/#modules')}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Բոլոր մոդուլներ</span>
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("p-3 rounded-full", styles.bg, styles.icon)}>
                    {Icon && <Icon size={24} />}
                  </div>
                  
                  <div>
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", styles.badge)}>
                      {getStatusText()}
                    </span>
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                  {module.title}
                </h1>
                
                {module.description && (
                  <p className="text-muted-foreground max-w-2xl mb-4">
                    {module.description}
                  </p>
                )}
                
                {module.progress !== undefined && (
                  <div className="max-w-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Առաջընթաց</span>
                      <span>{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Module Tabs */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <Tabs 
              defaultValue="learn" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-8">
                <TabsTrigger value="learn">Ուսուցում</TabsTrigger>
                <TabsTrigger value="topics">Թեմաներ</TabsTrigger>
                <TabsTrigger value="resources">Նյութեր</TabsTrigger>
              </TabsList>
              
              <TabsContent value="learn" className="focus-visible:outline-none focus-visible:ring-0">
                <ModuleLearning module={module} />
              </TabsContent>
              
              <TabsContent value="topics" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">Թեմաների ցանկ</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {module.topics?.map((topic, index) => (
                      <SlideUp key={index} delay={`delay-${index % 10 * 50}`}>
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 text-primary">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <span className="text-foreground">{topic}</span>
                        </div>
                      </SlideUp>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources" className="focus-visible:outline-none focus-visible:ring-0">
                <div className="bg-card border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-6">Լրացուցիչ նյութեր</h2>
                  <p className="text-muted-foreground">
                    Այս բաժնում կարող եք գտնել լրացուցիչ նյութեր, որոնք կօգնեն ձեզ ավելի լավ հասկանալ դասընթացի թեմաները։
                  </p>
                  <div className="mt-6 bg-muted/50 p-5 rounded-md text-center">
                    <p className="text-muted-foreground">Այս մոդուլի համար լրացուցիչ նյութերը դեռ հասանելի չեն</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Other Modules */}
        <div className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Մյուս մոդուլներ</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prevModule && (
                <FadeIn delay="delay-100">
                  <div 
                    className="bg-card border rounded-lg p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/module/${prevModule.id}`)}
                  >
                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary">
                      <ChevronLeft className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Նախորդ մոդուլ</p>
                      <h3 className="font-medium">{prevModule.title}</h3>
                    </div>
                  </div>
                </FadeIn>
              )}
              
              {nextModule && (
                <FadeIn delay="delay-200">
                  <div 
                    className="bg-card border rounded-lg p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/module/${nextModule.id}`)}
                  >
                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Հաջորդ մոդուլ</p>
                      <h3 className="font-medium">{nextModule.title}</h3>
                    </div>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ModuleDetailPage;
