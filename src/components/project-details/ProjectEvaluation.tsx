
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectEvaluationProps {
  projectId: number;
  isEditing: boolean;
}

const ProjectEvaluation: React.FC<ProjectEvaluationProps> = ({
  projectId,
  isEditing
}) => {
  // Mock data - in a real app this would come from an API
  const evaluation = {
    score: 85,
    feedback: `Պրոեկտը կատարված է բարձր մակարդակով: Ուսանողը ցուցաբերել է հիմնարար գիտելիքներ և կարողություններ: 
    
Խնդրի լուծման ճանապարհին կիրառել է համապատասխան մեթոդներ և մոտեցումներ:

Կան մի քանի փոքր թերություններ, որոնք կարող են բարելավվել հետագայում:
- Կոդի որակը պետք է բարելավել 
- Օպտիմիզացիայի հարցերը դեռ պետք է լուծել
- UI/UX դիզայնը կարող է ավելի ինտուիտիվ լինել`,
    criterias: [
      { name: 'Տեխնիկական իրականացում', score: 9, maxScore: 10 },
      { name: 'Կոդի որակ', score: 8, maxScore: 10 },
      { name: 'Դիզայն և UI/UX', score: 7, maxScore: 10 },
      { name: 'Նախագծի ամբողջականություն', score: 9, maxScore: 10 },
      { name: 'Ներկայացում և փաստաթղթեր', score: 8, maxScore: 10 },
    ]
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" /> Գնահատական և կարծիքներ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* Score overview */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-[12px] border-muted flex items-center justify-center">
                  <div className="text-4xl font-bold">
                    {evaluation.score}%
                  </div>
                </div>
                <div 
                  className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-primary border-l-transparent border-b-transparent"
                  style={{ 
                    transform: `rotate(${evaluation.score * 3.6}deg)`,
                    transition: 'transform 1s ease-out'
                  }}
                />
              </div>
            </div>
            
            {/* Criterias */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg mb-3">Գնահատման չափանիշներ</h3>
              
              {evaluation.criterias.map((criteria, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{criteria.name}</span>
                    <span className="font-medium">{criteria.score}/{criteria.maxScore}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        criteria.score / criteria.maxScore > 0.8 ? "bg-green-500" :
                        criteria.score / criteria.maxScore > 0.6 ? "bg-amber-500" : 
                        "bg-red-500"
                      )}
                      style={{ width: `${(criteria.score / criteria.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            {/* Feedback */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Գնահատողի կարծիքը
              </h3>
              
              <div className="p-4 bg-muted/30 rounded-lg border whitespace-pre-line">
                {evaluation.feedback}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectEvaluation;
