
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const ProgrammingResources: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { theme } = useTheme();
  
  const resources = {
    beginner: [
      {
        title: "HTML և CSS հիմունքներ",
        description: "Վեբ կայքերի կառուցման հիմնարար գիտելիքներ և օրինակներ սկսնակների համար",
        tags: ["HTML", "CSS", "Սկսնակ"],
        link: "#",
        type: "tutorial"
      },
      {
        title: "JavaScript սկսնակների համար",
        description: "Ինտերակտիվ JavaScript դասընթաց՝ ինտերակտիվ վարժություններով և օրինակներով",
        tags: ["JavaScript", "Սկսնակ"],
        link: "#",
        type: "course"
      },
      {
        title: "Python ծրագրավորման լեզու",
        description: "Python լեզվի հիմնական տարրերը, կառուցվածքները և գործնական կիրառությունները",
        tags: ["Python", "Սկսնակ"],
        link: "#",
        type: "tutorial"
      },
      {
        title: "Ալգորիթմներ և տվյալների կառուցվածքներ",
        description: "Ալգորիթմների և տվյալների կառուցվածքների ներածություն սկսնակների համար",
        tags: ["Ալգորիթմներ", "Սկսնակ"],
        link: "#",
        type: "ebook"
      }
    ],
    intermediate: [
      {
        title: "React.js հիմունքներ",
        description: "React.js գրադարանի հիմունքները և SPA հավելվածների կառուցումը",
        tags: ["React", "JavaScript", "Միջին"],
        link: "#",
        type: "course"
      },
      {
        title: "Node.js և Express.js",
        description: "Բեքենդ հավելվածների մշակում Node.js և Express ֆրեյմվորկի միջոցով",
        tags: ["Node.js", "Express.js", "Միջին"],
        link: "#",
        type: "tutorial"
      },
      {
        title: "SQL և Տվյալների բազաներ",
        description: "Տվյալների բազաների հիմունքներ և SQL հարցումների կազմում",
        tags: ["SQL", "Տվյալների բազաներ", "Միջին"],
        link: "#",
        type: "course"
      },
      {
        title: "Git և GitHub",
        description: "Կոդի տարբերակների կառավարման համակարգի հիմունքներ",
        tags: ["Git", "GitHub", "Միջին"],
        link: "#",
        type: "tutorial"
      }
    ],
    advanced: [
      {
        title: "Ճարտարապետական մոտեցումներ",
        description: "Ծրագրավորման ճարտարապետական մոտեցումներ և դիզայն պատերններ",
        tags: ["Ճարտարապետություն", "Design Patterns", "Առաջադեմ"],
        link: "#",
        type: "ebook"
      },
      {
        title: "Microservices համակարգեր",
        description: "Microservices-ների մշակում և կառավարում",
        tags: ["Microservices", "DevOps", "Առաջադեմ"],
        link: "#",
        type: "course"
      },
      {
        title: "Մեքենայական ուսուցում",
        description: "Մեքենայական ուսուցման հիմունքներ և ալգորիթմներ",
        tags: ["ML", "Python", "Առաջադեմ"],
        link: "#",
        type: "tutorial"
      },
      {
        title: "Բլոկչեյն տեխնոլոգիաներ",
        description: "Բլոկչեյն տեխնոլոգիաների հիմունքներ և սմարթ կոնտրակտների մշակում",
        tags: ["Blockchain", "Ethereum", "Առաջադեմ"],
        link: "#",
        type: "course"
      }
    ]
  };

  // Function to render badge color based on type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "tutorial":
        return "default";
      case "course":
        return "secondary";
      case "ebook":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Ծրագրավորման ռեսուրսներ</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          Այս բաժնում մենք հավաքել ենք արժեքավոր ուսումնական նյութեր և ռեսուրսներ, որոնք օգնում են յուրացնել ծրագրավորում և տեխնոլոգիաներ տարբեր մակարդակներում։ 
          Ռեսուրսները դասակարգված են ըստ բարդության աստիճանի և թեմաների։
        </p>
        
        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="beginner">Սկսնակ</TabsTrigger>
            <TabsTrigger value="intermediate">Միջին</TabsTrigger>
            <TabsTrigger value="advanced">Առաջադեմ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beginner">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.beginner.map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <Badge variant={getBadgeVariant(resource.type)} className="mb-2 self-start">
                      {resource.type === "tutorial" ? "Ուսումնական նյութ" : 
                       resource.type === "course" ? "Դասընթաց" : "Էլ․ գիրք"}
                    </Badge>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{resource.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-secondary/30">{tag}</Badge>
                      ))}
                    </div>
                    <a 
                      href={resource.link} 
                      className="inline-flex items-center text-primary hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Դիտել ռեսուրսը <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="intermediate">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.intermediate.map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <Badge variant={getBadgeVariant(resource.type)} className="mb-2 self-start">
                      {resource.type === "tutorial" ? "Ուսումնական նյութ" : 
                       resource.type === "course" ? "Դասընթաց" : "Էլ․ գիրք"}
                    </Badge>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{resource.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-secondary/30">{tag}</Badge>
                      ))}
                    </div>
                    <a 
                      href={resource.link} 
                      className="inline-flex items-center text-primary hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Դիտել ռեսուրսը <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="advanced">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.advanced.map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <Badge variant={getBadgeVariant(resource.type)} className="mb-2 self-start">
                      {resource.type === "tutorial" ? "Ուսումնական նյութ" : 
                       resource.type === "course" ? "Դասընթաց" : "Էլ․ գիրք"}
                    </Badge>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{resource.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-secondary/30">{tag}</Badge>
                      ))}
                    </div>
                    <a 
                      href={resource.link} 
                      className="inline-flex items-center text-primary hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Դիտել ռեսուրսը <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProgrammingResources;
