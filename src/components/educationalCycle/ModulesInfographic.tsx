import React, { useState } from 'react';
import { Code, FileCode, Layers, Globe, Layout, Database, Monitor, PenTool, Image, Smartphone, Shield, Clock, Check, X } from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';

export interface EducationalModule {
  id: number;
  title: string;
  icon: React.ElementType;
  description?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  progress?: number;
  topics?: string[];
}

interface ModuleCardProps {
  module: EducationalModule;
  delay: string;
  showProgress: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, delay, showProgress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const colors = [
    "bg-primary/10 text-primary border-primary/20",
    "bg-blue-100 text-blue-600 border-blue-200",
    "bg-purple-100 text-purple-600 border-purple-200",
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-pink-100 text-pink-600 border-pink-200",
    "bg-indigo-100 text-indigo-600 border-indigo-200",
    "bg-teal-100 text-teal-600 border-teal-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-cyan-100 text-cyan-600 border-cyan-200",
    "bg-rose-100 text-rose-600 border-rose-200",
  ];
  
  const colorClass = colors[(module.id - 1) % colors.length];
  
  const getStatusIcon = () => {
    switch (module.status) {
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'not-started':
      default:
        return <X className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const handleCardClick = () => {
    if (module.topics && module.topics.length > 0) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <SlideUp delay={delay} className="flex flex-col">
      <div 
        className={`flip-card ${isFlipped ? 'flipped' : ''} card-hover`}
        style={{ 
          perspective: '1000px',
          height: '280px' 
        }}
      >
        <div 
          className="flip-card-inner w-full h-full relative transition-transform duration-700 transform-style-preserve-3d"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          <div 
            className={`flip-card-front absolute w-full h-full ${colorClass} rounded-lg p-6 shadow-md flex flex-col items-center cursor-pointer backdrop-blur-sm border-border/40 overflow-hidden`}
            onClick={handleCardClick}
            style={{ 
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl" />
            
            <div className="rounded-full bg-white/80 p-3 mb-4 shadow-sm">
              <module.icon className={`${colorClass.split(' ')[1]} h-7 w-7`} />
            </div>
            <div className="text-sm font-semibold mb-1">{module.id}.</div>
            <h3 className="text-center font-medium mb-2 text-foreground group-hover:text-primary transition-colors duration-300">{module.title}</h3>
            
            {showProgress && module.status && (
              <div className="mt-2 flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-xs">
                  {module.status === 'completed' ? 'Ավարտված է' : 
                   module.status === 'in-progress' ? 'Ընթացքի մեջ է' : 
                   'Չսկսված'}
                </span>
              </div>
            )}
            
            {showProgress && module.progress !== undefined && (
              <div className="w-full mt-3">
                <Progress value={module.progress} className="h-2" />
                <p className="text-xs text-right mt-1">{module.progress}%</p>
              </div>
            )}
            
            {module.topics && module.topics.length > 0 && (
              <div className="mt-auto pt-4">
                <p className="text-xs italic text-muted-foreground">Սեղմեք թեմաները տեսնելու համար</p>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />
          </div>
          
          <div 
            className={`flip-card-back absolute w-full h-full ${colorClass} rounded-lg p-4 shadow-md flex flex-col cursor-pointer overflow-hidden border-border/40`}
            onClick={handleCardClick}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-t-xl" />
            
            <h4 className="font-medium mb-2 text-center text-sm">{module.title} - Թեմաներ</h4>
            
            {module.topics && module.topics.length > 0 ? (
              <div className="overflow-y-auto flex-grow pr-1 -mr-2">
                <ul className="space-y-1 text-xs">
                  {module.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="bg-white/80 text-primary rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-tight">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-center italic text-muted-foreground">Թեմաներ չկան</p>
            )}
            
            <div className="mt-auto pt-2 text-center">
              <p className="text-xs italic text-muted-foreground">Սեղմեք քարտը շրջելու համար</p>
            </div>
          </div>
        </div>
      </div>
    </SlideUp>
  );
};

export const ModulesInfographic: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  const educationalModules: EducationalModule[] = [
    { 
      id: 1, 
      title: "Ալգորիթմների տարրերի կիրառում", 
      icon: Code, 
      status: 'completed', 
      progress: 100,
      topics: [
        "Ալգորիթմի սահմանում և հիմնական հատկությունները",
        "Գծային ալգորիթմներ",
        "Պայմանական կառուցվածքներ",
        "Ճյուղավորված ալգորիթմներ",
        "Կոմբինացված պայմաններ",
        "Ընտրության ալգորիթմ (switch-case)",
        "Ցիկլեր, նրանց տեսակները",
        "For ցիկլը և նրա կիրառումը",
        "While և do-while ցիկլեր",
        "Բազմակի ցիկլեր",
        "Ռեկուրսիա և նրա աշխատանքի սկզբունքը",
        "Հանրահաշվական արտահայտություններ",
        "Տրամաբանական արտահայտություններ",
        "Թվաբանական գործողություններ",
        "Մուտքի և ելքի գործողություններ",
        "Փոփոխականներ և տիպեր",
        "Հաստատուններ",
        "Տվյալների փոխակերպում",
        "Ալգորիթմների բարդության գնահատում",
        "Փնտրման ալգորիթմներ",
        "Գծային որոնում",
        "Երկուական որոնում",
        "Տեսակավորման ալգորիթմներ",
        "Ներդրման տեսակավորում",
        "Փուչիկի տեսակավորում",
        "Ընտրության տեսակավորում",
        "Խառնարդի տեսակավորում",
        "Միաձուլման տեսակավորում",
        "Արագ տեսակավորում",
        "Տվյալների կառուցվածքներ, զանգվածներ",
        "Բլոկ-սխեմաներ",
        "Կեղծ կոդի գրելաձև"
      ]
    },
    { 
      id: 2, 
      title: "Ծրագրավորման հիմունքներ", 
      icon: FileCode, 
      status: 'completed', 
      progress: 100,
      topics: [
        "Ծրագրավորման լեզուների պատմություն և դասակարգում",
        "C++ լեզվի հիմնական կառուցվածքը",
        "Փոփոխականներ և տվյալների տիպեր",
        "Տվյալների տիպերի փոխակերպում",
        "Արտահայտություններ և օպերատորներ",
        "Մուտքի և ելքի կազմակերպում",
        "Տրամաբանական օպերատորներ",
        "Պայմանական օպերատորներ (if-else)",
        "Switch-case կառուցվածք",
        "Ցիկլեր (for, while, do-while)",
        "Break և continue հրամաններ",
        "Ֆունկցիաներ և նրանց հայտարարումը",
        "Ֆունկցիաների պարամետրեր և վերադարձվող արժեքներ",
        "Լոկալ և գլոբալ փոփոխականներ",
        "Ռեկուրսիվ ֆունկցիաներ",
        "Միաչափ զանգվածներ",
        "Երկչափ և բազմաչափ զանգվածներ",
        "Տողեր և նրանց մշակումը",
        "Հիշողության դինամիկ բաշխում",
        "Ցուցիչներ (pointers)",
        "Հղումներ (references)",
        "Ֆայլերի հետ աշխատանք",
        "Բինար ֆայլեր",
        "Տեքստային ֆայլեր",
        "Կառուցվածքներ (struct)",
        "Ցուցակներ (list)",
        "Ստեկ (stack)",
        "Հերթ (queue)",
        "Ծառեր (tree)",
        "Հեշ աղյուսակներ",
        "Ալգորիթմական խնդիրների լուծում",
        "Ծրագրի կարգաբերում (debugging)"
      ]
    },
    { 
      id: 3, 
      title: "Օբյեկտ կողմնորոշված ծրագրավորում", 
      icon: Layers, 
      status: 'in-progress', 
      progress: 75,
      topics: [
        "ՕԿԾ հիմնական սկզբունքներ",
        "Դասեր և օբյեկտներ",
        "Կոնստրուկտորներ և դեստրուկտորներ",
        "This ցուցիչ",
        "Static անդամներ",
        "Friend ֆունկցիաներ և դասեր",
        "Ինկապսուլյացիա",
        "Մատչելիության մակարդակներ (public, private, protected)",
        "Ժառանգում և նրա տեսակները",
        "Բազմակի ժառանգում",
        "Վերասահմանված մեթոդներ",
        "Վիրտուալ ֆունկցիաներ",
        "Աբստրակտ դասեր",
        "Պոլիմորֆիզմ",
        "Ինտերֆեյսներ",
        "Օպերատորների վերաբեռնում",
        "Ստանդարտ օպերատորների վերաբեռնում",
        "Ֆունկցիաների վերաբեռնում",
        "Տեմպլեյտ (template) դասեր",
        "Տեմպլեյտ ֆունկցիաներ",
        "Բացառություններ և նրանց մշակումը",
        "try-catch բլոկներ",
        "Սեփական բացառությունների ստեղծում",
        "Հիշողության կառավարում",
        "Խելացի ցուցիչներ (smart pointers)",
        "STL գրադարան",
        "Vector և նրա կիրառումը",
        "Map և unordered_map",
        "Set և unordered_set",
        "Ալգորիթմներ STL-ում",
        "Lambda ֆունկցիաներ",
        "Դիզայն պատերններ"
      ]
    },
    { 
      id: 4, 
      title: "Համակարգչային ցանցեր", 
      icon: Globe, 
      status: 'in-progress', 
      progress: 40,
      topics: [
        "Համակարգչային ցանցերի ներածություն",
        "Ցանցերի տեսակներ (LAN, WAN, MAN)",
        "Տոպոլոգիաներ (աստղային, օղակաձև, ծառ)",
        "OSI մոդելի 7 շերտերը",
        "TCP/IP մոդել",
        "Ֆիզիկական շերտ (Physical Layer)",
        "Կապի միջավայրեր (մալուխներ, անլար)",
        "Տվյալների կապի շերտ (Data Link Layer)",
        "MAC հասցեավորում",
        "Ethernet ստանդարտներ",
        "Ցանցային շերտ (Network Layer)",
        "IP հասցեավորում (IPv4, IPv6)",
        "Ենթացանցերի դիմակներ",
        "Մարշրուտիզացիա",
        "Ստատիկ և դինամիկ մարշրուտիզացիա",
        "Տրանսպորտային շերտ (Transport Layer)",
        "TCP և UDP պրոտոկոլներ",
        "Պորտեր և սոկետներ",
        "Սեսիայի շերտ (Session Layer)",
        "Ներկայացման շերտ (Presentation Layer)",
        "Հավելվածի շերտ (Application Layer)",
        "HTTP և HTTPS պրոտոկոլներ",
        "DNS համակարգ",
        "DHCP ծառայություն",
        "NAT տեխնոլոգիա",
        "VPN տեխնոլոգիաներ",
        "VLAN-ներ",
        "Ցանցային սարքեր (երթուղիչ, կոմուտատոր, հաբ)",
        "Ցանցային անվտանգություն",
        "Ֆայրվոլներ և նրանց կարգավորում",
        "Վիրտուալ ցանցեր",
        "Ցանցերի ախտորոշում և կարգաբերում"
      ]
    },
    { 
      id: 5, 
      title: "Ստատրիկ վեբ կայքերի նախագծում", 
      icon: Layout, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "HTML5 ներածություն և հիմնական կառուցվածք",
        "Վեբ էջի կառուցվածք և թեգեր",
        "Վերնագրեր և պարագրաֆներ",
        "Հղումներ և խարիսխներ",
        "Նկարներ և մուլտիմեդիա",
        "Ցուցակներ (ordered, unordered, definition)",
        "Աղյուսակներ և նրանց կառուցվածքը",
        "Ձևեր և մուտքի դաշտեր",
        "HTML5 սեմանտիկ էլեմենտներ",
        "CSS3 հիմունքներ",
        "Ընտրիչներ (selector)",
        "Գույներ և ֆոներ",
        "Տեքստի ձևավորում",
        "Box մոդել (margin, padding, border)",
        "Դիրքավորում (position)",
        "Float և clear հատկություններ",
        "Flexbox մոդել",
        "Grid մոդել",
        "Անիմացիաներ և անցումներ",
        "CSS փոխակերպումներ (transformations)",
        "Media հարցումներ",
        "Մոբայլ նախագծում (mobile first)",
        "Ադապտիվ և responsive դիզայն",
        "CSS Frameworks (Bootstrap, Tailwind)",
        "Վեբ տառատեսակներ և իկոնաներ",
        "Վեբ մատչելիություն (accessibility)",
        "SEO հիմունքներ",
        "Կայքի օպտիմիզացիա",
        "Վեբ չափորոշիչներ",
        "Կայքի հոսթինգ և տեղադրում",
        "Դոմեյն անուններ",
        "Git և վերսիաների վերահսկում"
      ]
    },
    { 
      id: 6, 
      title: "Ջավասկրիպտի կիրառումը", 
      icon: Code, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "JavaScript-ի ներածություն և պատմություն",
        "JavaScript տվյալների տիպեր",
        "Փոփոխականներ և կոնստանտներ",
        "Օպերատորներ և արտահայտություններ",
        "Պայմանական օպերատորներ",
        "Ցիկլեր (for, while, do-while)",
        "Ֆունկցիաներ և նրանց տեսակները",
        "Սլաքային ֆունկցիաներ (arrow functions)",
        "Զանգվածներ և նրանց մեթոդները",
        "Օբյեկտներ և հատկությունները",
        "Օբյեկտ-կողմնորոշված JavaScript",
        "Դասեր և ժառանգում",
        "DOM հիմունքներ",
        "DOM-ի մանիպուլյացիա",
        "Էլեմենտների ընտրություն",
        "Էլեմենտների ատրիբուտների փոփոխություն",
        "Էլեմենտների ստեղծում և հեռացում",
        "Իրադարձությունների մշակում (event handling)",
        "Իրադարձությունների տիպեր",
        "Իրադարձությունների տարածում (bubbling, capturing)",
        "JSON տվյալների ձևաչափ",
        "Ասինխրոն JavaScript",
        "Callbacks և նրանց կիրառությունը",
        "Promise օբյեկտներ",
        "Async/await",
        "Fetch API և AJAX",
        "LocalStorage և SessionStorage",
        "Ռեգուլյար արտահայտություններ",
        "JavaScript մոդուլներ",
        "ES6+ նորությունները",
        "Դեբագինգ և սխալների մշակում",
        "Frameworks և գրադարաններ (React, Vue, Angular)"
      ]
    },
    { 
      id: 7, 
      title: "Ռելյացիոն տվյալների բազաների նախագծում", 
      icon: Database, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "Տվյալների բազաների ներածություն",
        "Ռելյացիոն մոդել",
        "Տվյալների բազաների տիպեր",
        "SQL ներածություն",
        "Տվյալների տիպեր SQL-ում",
        "Աղյուսակների ստեղծում (CREATE TABLE)",
        "Աղյուսակների փոփոխում (ALTER TABLE)",
        "Տվյալների ավելացում (INSERT)",
        "Տվյալների ընթերցում (SELECT)",
        "WHERE պայմաններ",
        "ORDER BY դասավորում",
        "GROUP BY խմբավորում",
        "Ագրեգացիոն ֆունկցիաներ (COUNT, SUM, AVG)",
        "JOIN օպերացիաներ",
        "Ենթահարցումներ (subqueries)",
        "Ինդեքսներ և նրանց կիրառումը",
        "Բանալիներ (Primary Key, Foreign Key)",
        "Նորմալացման կանոններ",
        "Առաջին նորմալ ձև (1NF)",
        "Երկրորդ նորմալ ձև (2NF)",
        "Երրորդ նորմալ ձև (3NF)",
        "Բոյս-Կոդ նորմալ ձև (BCNF)",
        "Տրանզակցիաներ և ACID սկզբունքներ",
        "Պահված պրոցեդուրաներ (stored procedures)",
        "Տրիգերներ",
        "Views (տեսքեր)",
        "Տվյալների անվտանգություն",
        "Օգտագործողների կառավարում",
        "Տվյալների կրկնօրինակում (replication)",
        "Վիրտուալ աղյուսակներ",
        "Օպտիմիզացման մեթոդներ",
        "Ժամանակակից ռելյացիոն ՍՈՒԲԴ-ներ (MySQL, PostgreSQL)"
      ]
    },
    { 
      id: 8, 
      title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում", 
      icon: Database, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "NoSQL բազաների ներածություն",
        "NoSQL vs SQL",
        "NoSQL բազաների տիպեր",
        "Document-կողմնորոշված բազաներ",
        "MongoDB ներածություն",
        "MongoDB տվյալների մոդել",
        "JSON և BSON ձևաչափեր",
        "CRUD գործողություններ MongoDB-ում",
        "Հարցումներ և ֆիլտրացիա",
        "Ինդեքսներ MongoDB-ում",
        "Ագրեգացիոն Pipeline",
        "Հարաբերություններ NoSQL բազաներում",
        "Key-Value պահեստներ",
        "Redis ներածություն",
        "Redis տվյալների կառուցվածքներ",
        "Redis հրամաններ",
        "Column-family պահեստներ",
        "Cassandra ներածություն",
        "Գրաֆային բազաներ",
        "Neo4j ներածություն",
        "Cypher հարցման լեզու",
        "NoSQL սխեմաների նախագծում",
        "Տվյալների մասշտաբավորում (sharding)",
        "Հորիզոնական մասշտաբավորում",
        "Ուղղահայաց մասշտաբավորում",
        "CAP թեորեմ",
        "Տրանզակցիաներ NoSQL բազաներում",
        "Կոնսիստենտություն և նրա մակարդակները",
        "Նախագծման կաղապարներ (design patterns)",
        "Բազմամոդել NoSQL բազաներ",
        "NoSQL-ի ինտեգրացիան ժամանակակից հավելվածներում",
        "Իրական խնդիրներ և նրանց լուծումներ"
      ]
    },
    { 
      id: 9, 
      title: "Դինաﬕկ վեբ կայքերի նախագծում", 
      icon: Monitor, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "Դինամիկ վեբ հավելվածների հիմունքներ",
        "Client-Server արխիտեկտուրա",
        "HTTP պրոտոկոլ և նրա մեթոդները",
        "Node.js էկոհամակարգ",
        "Node.js մոդուլներ և npm",
        "Express.js framework",
        "Մարշրուտիզացիա (routing)",
        "Middleware-ի կոնցեպցիա",
        "Տեմպլեյտների շարժիչներ (EJS, Pug)",
        "MVC արխիտեկտուրա",
        "ORM գրադարաններ (Sequelize, TypeORM)",
        "Տվյալների բազաների ինտեգրացիա",
        "REST API նախագծում",
        "API ռեսուրսներ և endpoint-ներ",
        "API վերսիավորում",
        "Օգտագործողների ավթենտիֆիկացիա",
        "JWT (JSON Web Token)",
        "OAuth ինտեգրացիա",
        "CRUD գործողություններ",
        "Ֆայլերի վերբեռնում",
        "Պատկերների մշակում",
        "Web Sockets և ռեալ ժամանակով հաղորդակցություն",
        "Socket.io գրադարան",
        "Միկրոսերվիսային արխիտեկտուրա",
        "API Gateway",
        "Տվյալների պահպանում (caching)",
        "Redis որպես քեշ",
        "Ասինխրոն հարցումների կառավարում",
        "Տեսթավորում (Mocha, Jest)",
        "CI/CD ինտեգրացիա",
        "Դոկերիզացիա և կոնտեյներներ",
        "Ծրագրի մոնիտորինգ և լոգավորում"
      ]
    },
    { 
      id: 10, 
      title: "Վեկտորային գրաֆիկա", 
      icon: PenTool, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "Վեկտորային գրաֆիկայի ներածություն",
        "Ռաստրային vs վեկտորային գրաֆիկա",
        "Վեկտորային ծրագրերի ինտերֆեյս",
        "Adobe Illustrator հիմունքներ",
        "Inkscape կիրառում",
        "Բազային երկրաչափական օբյեկտներ",
        "Տեղակայում և չափսավորում",
        "Pen գործիք և կորեր",
        "Bezier կորեր",
        "Ուրվագծեր և լիցքավորում",
        "Գրադիենտներ և նրանց տեսակները",
        "Տեքստի աշխատանք վեկտորային միջավայրում",
        "Տեքստի փոխակերպումը ուրվագծերի",
        "Օբյեկտների կոմբինացիաներ",
        "Boolean օպերացիաներ",
        "Շերտեր և նրանց կազմակերպումը",
        "Խմբավորում և բացում",
        "Օբյեկտների դիրքավորում և հավասարեցում",
        "Սիմվոլներ և սիմվոլների գրադարաններ",
        "Path finder և path գործիքներ",
        "Brush գործիքներ և նրանց կիրառումը",
        "Pattern-ներ և նրանց ստեղծումը",
        "Live trace ֆունկցիա",
        "Գծանկարների ստեղծում",
        "Տարբեր ոճերի իլյուստրացիաներ",
        "Լոգոների դիզայն",
        "Իկոնաների ստեղծում",
        "SVG ֆորմատ և նրա առավելությունները",
        "Վեբ համար վեկտորային գրաֆիկա",
        "Անիմացիաներ SVG-ով",
        "Ինտերակտիվ վեկտորային գրաֆիկա",
        "Տպագրական պրոդուկցիայի նախագծում"
      ]
    },
    { 
      id: 11, 
      title: "Կետային գրաֆիկա", 
      icon: Image, 
      status: 'not-started', 
      progress: 0,
      topics: [
        "Կետային գրաֆիկայի հիմունքներ",
        "Ռեզոլյուցիա և նրա նշանակությունը",
        "Գունային մոդելներ (RGB, CMYK, Lab)",
        "Գունային խորություն",
        "Photoshop ինտերֆեյս և գործիքներ",
        "GIMP և այլ OpenSource լուծումներ",
        "Ընտրության գործիքներ",
        "Ընտրության կատարելագործում",
        "Շերտերի հետ աշխատանք",
        "Շերտերի տեսակներ",
        "Մասկաներ և ալֆա կանալներ",
        "Շերտերի ոճեր և էֆեկտներ",
        "Ֆիլտրեր և նրանց կիրառումը",
        "Կարգավորիչ շերտեր (adjustment layers)",
        "Գունային կարգավորումներ",
        "Տեքստի հետ աշխատանք",
        "Գործիքների նախապատվություններ",
        "Տրանսֆորմացիաներ և դեֆորմացիաներ",
        "Ռետուշ և վերականգնում",
        "Ֆոտոմոնտաժ և կոմպոզիցիա",
        "Կադրում և կոմպոզիցիայի կանոններ",
        "Լուսանկարչական կոռեկցիաներ",
        "Գույների գրադացիա",
        "HDR տեխնիկա",
        "Տպագրական նախապատրաստում",
        "Բաներ և վեբ գրաֆիկա",
        "Մոբայլ ինտերֆեյսների գրաֆիկա",
        "Օպտիմիզացիա վեբի համար",
        "Ֆայլերի ֆորմատներ և սեղմում",
        "Batch մշակում",
        "Actions և ավտոմատացում",
        "3D տեքստուրաներ և մոդելներ"
      ]
    },
    { 
      id:
