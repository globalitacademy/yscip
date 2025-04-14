
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Clock, BookOpen } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const LearningPaths: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { theme } = useTheme();
  
  const paths = {
    web: [
      {
        title: "Front-end ծրագրավորող",
        description: "Դարձեք Front-end ծրագրավորող՝ սովորելով HTML, CSS, JavaScript և React",
        duration: "6 ամիս",
        level: "Սկսնակից մինչև միջին",
        modules: 12,
        skills: ["HTML5", "CSS3", "JavaScript", "React", "Responsive Design"],
        image: "https://placehold.co/600x200"
      },
      {
        title: "Back-end ծրագրավորող",
        description: "Սովորեք ստեղծել բեքենդ համակարգեր Node.js, Express և MongoDB օգտագործելով",
        duration: "8 ամիս",
        level: "Միջին",
        modules: 15,
        skills: ["Node.js", "Express", "MongoDB", "REST API", "Authentication"],
        image: "https://placehold.co/600x200"
      },
      {
        title: "Full-stack ծրագրավորող",
        description: "Ամբողջական MERN stack տեխնոլոգիաների իմացություն ժամանակակից վեբ հավելվածների համար",
        duration: "12 ամիս",
        level: "Սկսնակից մինչև առաջադեմ",
        modules: 24,
        skills: ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Redux"],
        image: "https://placehold.co/600x200"
      }
    ],
    mobile: [
      {
        title: "Android հավելվածների մշակում",
        description: "Ստեղծեք Android հավելվածներ Kotlin լեզվով և Android Studio միջավայրում",
        duration: "9 ամիս",
        level: "Միջին",
        modules: 18,
        skills: ["Kotlin", "Android SDK", "Material Design", "Room Database", "Retrofit"],
        image: "https://placehold.co/600x200"
      },
      {
        title: "iOS հավելվածների մշակում",
        description: "Սովորեք Swift լեզուն և iOS հավելվածների մշակման հիմունքները",
        duration: "9 ամիս",
        level: "Միջին",
        modules: 16,
        skills: ["Swift", "UIKit", "SwiftUI", "Core Data", "Xcode"],
        image: "https://placehold.co/600x200"
      },
      {
        title: "Cross-Platform հավելվածների մշակում",
        description: "Մեկ կոդով բազմաթիվ պլատֆորմների համար հավելվածների մշակում React Native-ով",
        duration: "7 ամիս",
        level: "Միջին",
        modules: 14,
        skills: ["React Native", "JavaScript", "Redux", "API Integration", "Mobile UI/UX"],
        image: "https://placehold.co/600x200"
      }
    ],
    data: [
      {
        title: "Տվյալների գիտություն",
        description: "Տվյալների վերլուծության և մեքենայական ուսուցման հիմնական գործիքակազմ",
        duration: "10 ամիս",
        level: "Միջինից մինչև առաջադեմ",
        modules: 20,
        skills: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Data Visualization"],
        image: "https://placehold.co/600x200"
      },
      {
        title: "Մեքենայական ուսուցում",
        description: "Մեքենայական ուսուցման ալգորիթմներ և մոդելների ստեղծում",
        duration: "12 ամիս",
        level: "Առաջադեմ",
        modules: 24,
        skills: ["Python", "TensorFlow", "Keras", "ML Algorithms", "Neural Networks"],
        image: "https://placehold.co/600x200"
      },
      {
        title: "Մեծ տվյալների վերլուծություն",
        description: "Մեծ ծավալի տվյալների մշակում և վերլուծություն",
        duration: "8 ամիս",
        level: "Միջինից մինչև առաջադեմ",
        modules: 16,
        skills: ["Hadoop", "Spark", "Big Data Processing", "Data Warehousing"],
        image: "https://placehold.co/600x200"
      }
    ]
  };

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Ուսումնական ուղիներ</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          Մեր ուսումնական ուղիները կառուցված են ՏՏ ոլորտի պահանջարկված մասնագիտությունների համար։ 
          Յուրաքանչյուր ուղի բաղկացած է տրամաբանական հաջորդականությամբ դասավորված մոդուլներից, որոնք ապահովում են անհրաժեշտ գիտելիքների և հմտությունների ձեռքբերումը։
        </p>
        
        <Tabs defaultValue="web" className="w-full">
          <TabsList className="mb-8 justify-center">
            <TabsTrigger value="web">Վեբ ծրագրավորում</TabsTrigger>
            <TabsTrigger value="mobile">Մոբայլ ծրագրավորում</TabsTrigger>
            <TabsTrigger value="data">Տվյալների վերլուծություն</TabsTrigger>
          </TabsList>
          
          {Object.entries(paths).map(([key, pathsList]) => (
            <TabsContent key={key} value={key} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pathsList.map((path, index) => (
                  <Card key={index} className="overflow-hidden flex flex-col">
                    <div className="h-36 overflow-hidden">
                      <img 
                        src={path.image} 
                        alt={path.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 space-y-4 flex-grow">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{path.duration}</span>
                        <BookOpen className="h-4 w-4 text-muted-foreground ml-3" />
                        <span className="text-sm">{path.modules} մոդուլ</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Մակարդակ։</p>
                        <Badge variant="outline">{path.level}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Հմտություններ՝</p>
                        <div className="flex flex-wrap gap-1">
                          {path.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="bg-secondary/30">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Դիտել ուղին</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h2 className="text-xl font-medium mb-4">Ինչու՞ ընտրել այս ուղին</h2>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Մանրակրկիտ մշակված ուսումնական պլան՝ իրական աշխատանքային պահանջների հիման վրա</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Գործնական առաջադրանքներ և նախագծեր յուրաքանչյուր փուլում</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Անհատական մենթորություն և աջակցություն ամբողջ ուսումնառության ընթացքում</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Պորտֆոլիո՝ կազմված իրական նախագծերից</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Աջակցություն աշխատանքի տեղավորման հարցում դասընթացի ավարտից հետո</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default LearningPaths;
