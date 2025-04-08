
import React from 'react';
import { 
  GraduationCap, Users, Briefcase, UserCog, ClipboardCheck, 
  BookOpen, GaugeCircle, MessageSquare, UserPlus, FileSpreadsheet,
  FileCode, Server
} from 'lucide-react';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';

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
  type: string;
  delay?: string;
}) => (
  <SlideUp delay={delay}>
    <div className="bg-card dark:bg-gray-800/70 rounded-lg p-6 shadow-sm h-full flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-2 hover:bg-accent/50 dark:hover:bg-gray-700/70 group border border-border">
      <div className={`p-3 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary mb-4 transition-all duration-300 group-hover:scale-110`}>
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
      type: "student",
      delay: "delay-100"
    },
    {
      icon: Users,
      title: "Դասախոսներ",
      description: "Ստեղծեք և խմբագրեք դասընթացներ, ավելացրեք նյութեր և գնահատեք ուսանողներին։",
      type: "instructor",
      delay: "delay-200"
    },
    {
      icon: Briefcase,
      title: "Գործատուներ",
      description: "Գտեք հմուտ ուսանողներ, կազմակերպեք հարցազրույցներ և առաջարկեք աշխատանք։",
      type: "employer",
      delay: "delay-300"
    },
    
    // Row 2
    {
      icon: UserCog,
      title: "Ծրագրի ղեկավարներ",
      description: "Վերահսկեք դասընթացների որակը և ուսանողների առաջընթացը։",
      type: "manager",
      delay: "delay-400"
    },
    {
      icon: ClipboardCheck,
      title: "Պրակտիկայի ղեկավարներ",
      description: "Ստեղծեք և ղեկավարեք պրակտիկայի ծրագրերը, կապ պահպանեք բոլոր կողմերի հետ։",
      type: "internship",
      delay: "delay-500"
    },
    {
      icon: BookOpen,
      title: "Դասընթացների կառավարում",
      description: "Ստեղծեք, կազմակերպեք և ժամանակացույց կազմեք ուսումնական ծրագրերի համար։",
      type: "course",
      delay: "delay-600"
    },

    // Row 3
    {
      icon: GaugeCircle,
      title: "Գնահատման համակարգ",
      description: "Գնահատեք աշխատանքները, թեստերը և ստեղծեք քննություններ։",
      type: "grading",
      delay: "delay-700"
    },
    {
      icon: MessageSquare,
      title: "Հաղորդակցման գործիքներ",
      description: "Արդյունավետ հաղորդակցություն ուսանողների, դասախոսների և ղեկավարների միջև։",
      type: "communication",
      delay: "delay-800"
    },
    {
      icon: UserPlus,
      title: "Ընդունելության կազմակերպում",
      description: "Կառավարեք դիմումների ընդունումը, փաստաթղթերի ստուգումն և ընդունելության գործընթացը։",
      type: "admissions",
      delay: "delay-900"
    },

    // Row 4
    {
      icon: FileSpreadsheet,
      title: "Քննությունների կազմակերպում",
      description: "Պլանավորեք, կազմակերպեք և անցկացրեք առցանց և լսարանային քննություններ։",
      type: "exams",
      delay: "delay-1000"
    },
    {
      icon: FileCode,
      title: "Դիպլոմային նախագծեր",
      description: "Ստեղծեք, կառավարեք և հետևեք ուսանողների նախագծերի առաջընթացին։",
      type: "code",
      delay: "delay-1100"
    },
    {
      icon: Server,
      title: "Տվյալների վերլուծություն",
      description: "Վերլուծեք ուսանողների առաջադիմությունը և ծրագրերի արդյունավետությունը։",
      type: "analytics",
      delay: "delay-1200"
    }
  ];

  return (
    <section id="features-section" className="py-10 sm:py-12 md:py-16 lg:py-20 bg-secondary dark:bg-gray-900/50">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn delay="delay-100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-center leading-tight text-foreground">
            Համակարգի հիմնական առանձնահատկությունները
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-sm sm:text-base text-muted-foreground text-center max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
            Մեր հարթակը առաջարկում է բազմաթիվ գործիքներ՝ կրթական գործընթացը դյուրին դարձնելու համար
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
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
