
import React from 'react';
import { FadeIn } from '@/components/LocalTransitions';
import { LogIn, BookOpen, ClipboardCheck, FileCode, GraduationCap } from 'lucide-react';
import CycleStage from './CycleStage';
import { stageColors } from './stageColors';

const CycleTimeline: React.FC = () => {
  const stages = [
    {
      icon: LogIn,
      title: "1. Ընդունելություն",
      description: "Փաստաթղթերի ընդունում, քննություններ և դիմորդների ընդունելության գործընթաց։",
      colorScheme: stageColors.admission,
      delay: "delay-100"
    },
    {
      icon: BookOpen,
      title: "2. Առաջին կուրս",
      description: "Հիմնարար առարկաներ, ծրագրավորման լեզուների և ալգորիթմների ուսուցում։",
      colorScheme: stageColors.firstYear,
      delay: "delay-300"
    },
    {
      icon: ClipboardCheck,
      title: "3. Երկրորդ կուրս",
      description: "Խորացված ծրագրավորում, տվյալների կառուցվածքներ և ճարտարապետություն։",
      colorScheme: stageColors.secondYear,
      delay: "delay-500"
    },
    {
      icon: FileCode,
      title: "4. Երրորդ կուրս",
      description: "Մասնագիտական առարկաներ, պրակտիկա և կուրսային աշխատանքներ։",
      colorScheme: stageColors.thirdYear,
      delay: "delay-700"
    },
    {
      icon: GraduationCap,
      title: "5. Չորրորդ կուրս",
      description: "Դիպլոմային նախագծի պատրաստում, պաշտպանություն և ավարտական քննություններ։",
      colorScheme: stageColors.fourthYear,
      delay: "delay-900",
      isLast: true
    }
  ];

  return (
    <>
      <FadeIn delay="delay-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">
          Ուսումնական ցիկլ
        </h2>
      </FadeIn>
      
      <FadeIn delay="delay-200">
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          Ծանոթացեք ուսման ամբողջ ընթացքին՝ ընդունելությունից մինչև ավարտական դիպլոմի ստացում
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-0">
        {stages.map((stage, index) => (
          <CycleStage 
            key={index}
            icon={stage.icon}
            title={stage.title}
            description={stage.description}
            colorScheme={stage.colorScheme}
            delay={stage.delay}
            isLast={stage.isLast}
          />
        ))}
      </div>
      
      {/* Mobile timeline visualization */}
      <div className="md:hidden mt-4">
        {stages.slice(0, -1).map((stage, index) => (
          <div 
            key={index} 
            className={`h-16 w-1 ${stage.colorScheme.line} mx-auto`}
          />
        ))}
      </div>
    </>
  );
};

export default CycleTimeline;
