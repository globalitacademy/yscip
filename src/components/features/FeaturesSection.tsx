
import React from 'react';
import { 
  GraduationCap, Users, Briefcase, UserCog, ClipboardCheck, 
  BookOpen, GaugeCircle, MessageSquare, UserPlus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn, SlideUp } from '@/components/LocalTransitions';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  delay = "delay-0" 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay?: string;
}) => (
  <SlideUp delay={delay}>
    <Card className="h-full border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 mb-4 rounded-full bg-primary/10 text-primary">
            <Icon size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  </SlideUp>
);

const FeaturesSection = () => {
  const userFeatures = [
    {
      icon: GraduationCap,
      title: "Ուսանողներ",
      description: "Մասնակցեք դասընթացներին, կատարեք առաջադրանքներ և ստացեք գնահատականներ։",
      delay: "delay-100"
    },
    {
      icon: Users,
      title: "Դասախոսներ",
      description: "Ստեղծեք և խմբագրեք դասընթացներ, ավելացրեք նյութեր և գնահատեք ուսանողներին։",
      delay: "delay-200"
    },
    {
      icon: Briefcase,
      title: "Գործատուներ",
      description: "Գտեք հմուտ ուսանողներ, կազմակերպեք հարցազրույցներ և առաջարկեք աշխատանք։",
      delay: "delay-300"
    },
    {
      icon: UserCog,
      title: "Ծրագրի ղեկավարներ",
      description: "Վերահսկեք դասընթացների որակը և ուսանողների առաջընթացը։",
      delay: "delay-400"
    },
    {
      icon: ClipboardCheck,
      title: "Պրակտիկայի ղեկավարներ",
      description: "Ստեղծեք և ղեկավարեք պրակտիկայի ծրագրերը, կապ պահպանեք բոլոր կողմերի հետ։",
      delay: "delay-500"
    }
  ];

  const systemFeatures = [
    {
      icon: BookOpen,
      title: "Դասընթացների կառավարում",
      description: "Ստեղծեք, կազմակերպեք և ժամանակացույց կազմեք ուսումնական ծրագրերի համար։",
      delay: "delay-100"
    },
    {
      icon: GaugeCircle,
      title: "Գնահատման համակարգ",
      description: "Գնահատեք աշխատանքները, թեստերը և ստեղծեք քննություններ։",
      delay: "delay-200"
    },
    {
      icon: MessageSquare,
      title: "Հաղորդակցման գործիքներ",
      description: "Արդյունավետ հաղորդակցություն ուսանողների, դասախոսների և ղեկավարների միջև։",
      delay: "delay-300"
    },
    {
      icon: UserPlus,
      title: "Ընդունելության կազմակերպում",
      description: "Կառավարեք դիմումների ընդունումը, փաստաթղթերի ստուգումը և ընդունելության գործընթացը։",
      delay: "delay-400"
    }
  ];

  return (
    <section id="features-section" className="py-16 bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-4">
        <FadeIn delay="delay-100">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Համակարգի հիմնական առանձնահատկությունները
            </span>
          </h2>
        </FadeIn>
        
        <FadeIn delay="delay-200">
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Մեր հարթակը առաջարկում է բազմաթիվ գործիքներ՝ կրթական գործընթացը դյուրին դարձնելու համար
          </p>
        </FadeIn>

        <div className="mb-16">
          <h3 className="text-xl font-medium mb-8 text-center">Օգտատերերի տեսակներ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {userFeatures.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium mb-8 text-center">Համակարգի գործառույթներ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemFeatures.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
