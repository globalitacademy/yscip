
import React, { useState } from 'react';
import { Check, Clock, X } from 'lucide-react';
import { SlideUp } from '@/components/LocalTransitions';
import { Progress } from '@/components/ui/progress';
import { EducationalModule } from './types';

interface ModuleCardProps {
  module: EducationalModule;
  delay: string;
  showProgress: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, delay, showProgress }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const colors = [
    "bg-blue-100 text-blue-600 border-blue-200",
    "bg-green-100 text-green-600 border-green-200",
    "bg-purple-100 text-purple-600 border-purple-200",
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-pink-100 text-pink-600 border-pink-200",
    "bg-indigo-100 text-indigo-600 border-indigo-200",
    "bg-teal-100 text-teal-600 border-teal-200",
    "bg-amber-100 text-amber-600 border-amber-200",
    "bg-cyan-100 text-cyan-600 border-cyan-200",
    "bg-rose-100 text-rose-600 border-rose-200",
    "bg-lime-100 text-lime-600 border-lime-200",
    "bg-emerald-100 text-emerald-600 border-emerald-200",
    "bg-sky-100 text-sky-600 border-sky-200",
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
        className={`flip-card ${isFlipped ? 'flipped' : ''}`}
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
            className={`flip-card-front absolute w-full h-full ${colorClass} border rounded-lg p-6 shadow-md flex flex-col items-center cursor-pointer`}
            onClick={handleCardClick}
            style={{ 
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="rounded-full bg-white p-3 mb-4 shadow-inner">
              <module.icon className={colorClass.split(' ')[1]} size={28} />
            </div>
            <div className="text-sm font-semibold mb-1">{module.id}.</div>
            <h3 className="text-center font-medium mb-2">{module.title}</h3>
            
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
                <p className="text-xs italic">Սեղմեք թեմաները տեսնելու համար</p>
              </div>
            )}
          </div>
          
          <div 
            className={`flip-card-back absolute w-full h-full ${colorClass} border rounded-lg p-4 shadow-md flex flex-col cursor-pointer overflow-hidden`}
            onClick={handleCardClick}
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <h4 className="font-medium mb-2 text-center text-sm">{module.title} - Թեմաներ</h4>
            
            {module.topics && module.topics.length > 0 ? (
              <div className="overflow-y-auto flex-grow pr-1 -mr-2">
                <ul className="space-y-1 text-xs">
                  {module.topics.map((topic, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="bg-white text-primary rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-tight">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-center italic">Թեմաներ չկան</p>
            )}
            
            <div className="mt-auto pt-2 text-center">
              <p className="text-xs italic">Սեղմեք քարտը շրջելու համար</p>
            </div>
          </div>
        </div>
      </div>
    </SlideUp>
  );
};

export default ModuleCard;
