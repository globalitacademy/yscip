
import React from 'react';
import { Star, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProjectEvaluationProps {
  projectId: number;
  isEditing?: boolean;
}

const ProjectEvaluation: React.FC<ProjectEvaluationProps> = ({ projectId, isEditing = false }) => {
  // Mock evaluation data
  const evaluationData = {
    overall: 85,
    technical: 90,
    design: 80,
    documentation: 85,
    presentation: 70,
    status: 'completed',
    feedback: 'Նախագիծը լավ է իրականացված, սակայն ներկայացման մասը կարող էր լինել ավելի համապարփակ։ Տեխնիկական իրականացումը գերազանց է, դիզայնը՝ լավ։',
    strengths: [
      'Գերազանց կոդի կազմակերպում և ճարտարապետություն',
      'Լավ փաստաթղթավորում',
      'Դժվար խնդիրների լուծումների ստեղծարար մոտեցում'
    ],
    areasForImprovement: [
      'Ներկայացման հմտություններ',
      'Օգտագործողի ինտերֆեյսի դիզայն',
      'Ժամանակի կառավարում'
    ]
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Նախագծի գնահատական</h2>
        
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium 
            ${evaluationData.status === 'completed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-amber-100 text-amber-800'}`
          }>
            {evaluationData.status === 'completed' ? (
              <div className="flex items-center gap-1">
                <CheckCircle size={14} />
                <span>Գնահատված</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>Սպասում է գնահատման</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Scores */}
        <div className="space-y-6 bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h3 className="text-xl font-semibold mb-4">Գնահատականներ</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ընդհանուր գնահատական</span>
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-semibold">{evaluationData.overall}%</span>
                </div>
              </div>
              <Progress value={evaluationData.overall} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Տեխնիկական իրականացում</span>
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-semibold">{evaluationData.technical}%</span>
                </div>
              </div>
              <Progress value={evaluationData.technical} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Դիզայն</span>
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-semibold">{evaluationData.design}%</span>
                </div>
              </div>
              <Progress value={evaluationData.design} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Փաստաթղթավորում</span>
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-semibold">{evaluationData.documentation}%</span>
                </div>
              </div>
              <Progress value={evaluationData.documentation} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ներկայացում</span>
                <div className="flex items-center gap-1">
                  <Star className="text-amber-500 fill-amber-500" size={16} />
                  <span className="font-semibold">{evaluationData.presentation}%</span>
                </div>
              </div>
              <Progress value={evaluationData.presentation} className="h-2" />
            </div>
          </div>
        </div>
        
        {/* Right column - Feedback */}
        <div className="space-y-6 bg-card rounded-xl shadow-md p-6 border border-border/30">
          <h3 className="text-xl font-semibold mb-4">Դասախոսի կարծիքը</h3>
          
          <div className="prose prose-sm max-w-none">
            <p>{evaluationData.feedback}</p>
          </div>
          
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-500" size={16} />
                Ուժեղ կողմեր
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {evaluationData.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <AlertTriangle className="text-amber-500" size={16} />
                Զարգացման ուղղություններ
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {evaluationData.areasForImprovement.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEvaluation;
