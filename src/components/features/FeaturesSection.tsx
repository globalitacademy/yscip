
import React from 'react';
import { 
  GraduationCap, Users, Briefcase, UserCog, ClipboardCheck, 
  BookOpen, GaugeCircle, MessageSquare, UserPlus, FileSpreadsheet,
  FileCode, Server
} from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';

const ICON_BACKGROUNDS = {
  student: "bg-blue-100",
  instructor: "bg-green-100",
  employer: "bg-purple-100",
  manager: "bg-yellow-100",
  internship: "bg-orange-100",
  course: "bg-blue-100",
  grading: "bg-green-100",
  communication: "bg-red-100",
  admissions: "bg-pink-100",
  exams: "bg-indigo-100",
  code: "bg-cyan-100",
  analytics: "bg-teal-100"
};

const ICON_COLORS = {
  student: "text-blue-500",
  instructor: "text-green-500",
  employer: "text-purple-500", 
  manager: "text-yellow-600",
  internship: "text-orange-500",
  course: "text-blue-500",
  grading: "text-green-500",
  communication: "text-red-500",
  admissions: "text-pink-500",
  exams: "text-indigo-500",
  code: "text-cyan-500",
  analytics: "text-teal-500"
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  type,
  delay = "delay-0" 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  type: keyof typeof ICON_BACKGROUNDS;
  delay?: string;
}) => (
  <SlideUp delay={delay}>
    <div className="bg-white rounded-lg p-6 shadow-sm h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-2 hover:bg-gray-50 group">
      <div className={`p-3 rounded-lg ${ICON_BACKGROUNDS[type]} ${ICON_COLORS[type]} mb-4 transition-all duration-300 group-hover:scale-110`}>
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-medium mb-2 transition-colors duration-300 group-hover:text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </SlideUp>
);

const FeaturesSection = () => {
  const features = [
    // Row 1
    {
      icon: GraduationCap,
      title: "Ուսանողներ",
      description: "Մասնակցեք դասընթացներին, կատարեք առաջադրանքներ և ստացեք գնահատականներ։",
      type: "student" as const,
      delay: "delay-100"
    },
    {
      icon: Users,
      title: "Դասախոսներ",
      description: "Ստեղծեք և խմբագրեք դասընթացներ, ավելացրեք նյութեր և գնահատեք ուսանողներին։",
      type: "instructor" as const,
      delay: "delay-200"
    },
    {
      icon: Briefcase,
      title: "Գործատուներ",
      description: "Գտեք հմուտ ուսանողներ, կազմակերպեք հարցազրույցներ և առաջարկեք աշխատանք։",
      type: "employer" as const,
      delay: "delay-300"
    },
    
    // Row 2
    {
      icon: UserCog,
      title: "Ծրագրի ղեկավարներ",
      description: "Վերահսկեք դասընթացների որակը և ուսանողների առաջընթացը։",
      type: "manager" as const,
      delay: "delay-400"
    },
    {
      icon: ClipboardCheck,
      title: "Պրակտիկայի ղեկավարներ",
      description: "Ստեղծեք և ղեկավարեք պրակտիկայի ծրագրերը, կապ պահպանեք բոլոր կողմերի հետ։",
      type: "internship" as const,
      delay: "delay-500"
    },
    {
      icon: BookOpen,
      title: "Դասընթացների կառավարում",
      description: "Ստեղծեք, կազմակերպեք և ժամանակացույց կազմեք ուսումնական ծրագրերի համար։",
      type: "course" as const,
      delay: "delay-600"
    },

    // Row 3
    {
      icon: GaugeCircle,
      title: "Գնահատման համակարգ",
      description: "Գնահատեք աշխատանքները, թեստերը և ստեղծեք քննություններ։",
      type: "grading" as const,
      delay: "delay-700"
    },
    {
      icon: MessageSquare,
      title: "Հաղորդակցման գործիքներ",
      description: "Արդյունավետ հաղորդակցություն ուսանողների, դասախոսների և ղեկավարների միջև։",
      type: "communication" as const,
      delay: "delay-800"
    },
    {
      icon: UserPlus,
      title: "Ընդունելության կազմակերպում",
      description: "Կառավարեք դիմումների ընդունումը, փաստաթղթերի ստուգումն և ընդունելության գործընթացը։",
      type: "admissions" as const,
      delay: "delay-900"
    },

    // Row 4
    {
      icon: FileSpreadsheet,
      title: "Քննությունների կազմակերպում",
      description: "Պլանավորեք, կազմակերպեք և անցկացրեք առցանց և լսարանային քննություններ։",
      type: "exams" as const,
      delay: "delay-1000"
    },
    {
      icon: FileCode,
      title: "Դիպլոմային նախագծեր",
      description: "Ստեղծեք, կառավարեք և հետևեք ուսանողների նախագծերի առաջընթացին։",
      type: "code" as const,
      delay: "delay-1100"
    },
    {
      icon: Server,
      title: "Տվյալների վերլուծություն",
      description: "Վերլուծեք ուսանողների առաջադիմությունը և ծրագրերի արդյունավետությունը։",
      type: "analytics" as const,
      delay: "delay-1200"
    }
  ];

  return (
    <section id="features-section" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Համակարգի հիմնական առանձնահատկությունները
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Մեր հարթակը առաջարկում է բազմաթիվ գործիքներ՝ կրթական գործընթացը դյուրին դարձնելու համար
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              type={feature.type}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
