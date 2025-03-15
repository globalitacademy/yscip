
import { EducationalModule } from './types';
import { 
  Code, Brain, Database, Network, 
  Globe, Cpu, Layers, Palette, 
  Shield, Laptop, Monitor, PenTool, FileCode 
} from 'lucide-react';

export const educationalModules: EducationalModule[] = [
  {
    id: 1,
    title: "Ալգորիթմների տարրերի կիրառում",
    icon: Brain,
    status: 'completed',
    progress: 100,
    description: "Ծրագրավորման հիմնական ալգորիթմներ և տրամաբանություն",
    topics: ["Ցիկլեր", "Պայմաններ", "Զանգվածներ", "Հաշվարկներ"]
  },
  {
    id: 2,
    title: "Ծրագրավորման հիմունքներ",
    icon: Code,
    status: 'completed',
    progress: 100,
    description: "Ծրագրավորման հիմունքների ուսումնասիրում",
    topics: ["Փոփոխականներ", "Ֆունկցիաներ", "Օբյեկտներ", "Տվյալների տիպեր"]
  },
  {
    id: 3,
    title: "Օբյեկտ կողմնորոշված ծրագրավորում",
    icon: Layers,
    status: 'in-progress',
    progress: 75,
    description: "Օբյեկտ կողմնորոշված ծրագրավորման հիմունքներ",
    topics: ["Կլասսներ", "Ժառանգականություն", "Պոլիմորֆիզմ", "Ինկապսուլյացիա"]
  },
  {
    id: 4,
    title: "Համակարգչային ցանցեր",
    icon: Network,
    status: 'in-progress',
    progress: 40,
    description: "Ցանցային տեխնոլոգիաների ուսումնասիրում",
    topics: ["TCP/IP", "HTTP", "DNS", "Firewall"]
  },
  {
    id: 5,
    title: "Ստատրիկ վեբ կայքերի նախագծում",
    icon: Globe,
    status: 'not-started',
    progress: 0,
    description: "Ստատիկ վեբ կայքերի մշակում",
    topics: ["HTML", "CSS", "Responsive Design", "SEO Basics"]
  },
  {
    id: 6,
    title: "Ջավասկրիպտի կիրառումը",
    icon: FileCode,
    status: 'not-started',
    progress: 0,
    description: "JavaScript ծրագրավորման լեզվի հիմունքներ",
    topics: ["Syntax", "DOM Manipulation", "Events", "Async/Await"]
  },
  {
    id: 7,
    title: "Ռելյացիոն տվյալների բազաների նախագծում",
    icon: Database,
    status: 'not-started',
    progress: 0,
    description: "Ռելյացիոն տվյալների բազաների ուսումնասիրում",
    topics: ["SQL", "Database Design", "Normalization", "Indexing"]
  },
  {
    id: 8,
    title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում",
    icon: Database,
    status: 'not-started',
    progress: 0,
    description: "NoSQL տվյալների բազաների ուսումնասիրում",
    topics: ["MongoDB", "Document Stores", "Key-Value Stores", "Graph Databases"]
  },
  {
    id: 9,
    title: "Դինաﬕկ վեբ կայքերի նախագծում",
    icon: Laptop,
    status: 'not-started',
    progress: 0,
    description: "Դինամիկ վեբ կայքերի մշակում",
    topics: ["React", "State Management", "API Integration", "Authentication"]
  },
  {
    id: 10,
    title: "Վեկտորային գրաֆիկա",
    icon: PenTool,
    status: 'not-started',
    progress: 0,
    description: "Վեկտորային գրաֆիկայի հիմունքներ",
    topics: ["SVG", "Illustrator Basics", "Path Manipulation", "Vector Design"]
  },
  {
    id: 11,
    title: "Կետային գրաֆիկա",
    icon: Palette,
    status: 'not-started',
    progress: 0,
    description: "Կետային գրաֆիկայի հիմունքներ",
    topics: ["Photoshop Basics", "Image Manipulation", "Pixel Art", "Digital Painting"]
  },
  {
    id: 12,
    title: "Գրաֆիկական ինտերֆեյսի ծրագրավորում",
    icon: Monitor,
    status: 'not-started',
    progress: 0,
    description: "UI/UX նախագծման հիմունքներ",
    topics: ["UI Components", "Wireframing", "Prototyping", "User Testing"]
  },
  {
    id: 13,
    title: "Տեղեկատվության անվտանգություն",
    icon: Shield,
    status: 'not-started',
    progress: 0,
    description: "Կիբերանվտանգության հիմունքներ",
    topics: ["Encryption", "Authentication", "Authorization", "Security Best Practices"]
  },
];
