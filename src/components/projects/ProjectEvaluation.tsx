
import React from 'react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, StarHalf, Clock, CheckCircle, AlertTriangle, FileDown } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from 'date-fns';
import { rolePermissions, getCurrentUser } from '@/data/userRoles';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CriterionScore {
  id: number;
  criterion: string;
  score: number;
  maxScore: number;
  comment?: string;
}

interface Evaluation {
  submissionDate?: Date;
  evaluationDate?: Date;
  finalScore?: number;
  maxScore: number;
  status: 'pending' | 'evaluated' | 'returned' | 'not_submitted';
  criteriaScores?: CriterionScore[];
  supervisorFeedback?: string;
  supervisorName?: string;
}

interface ProjectEvaluationProps {
  projectId: number;
}

const ProjectEvaluation: React.FC<ProjectEvaluationProps> = ({ projectId }) => {
  const [evaluation, setEvaluation] = React.useState<Evaluation>({
    submissionDate: new Date(2023, 5, 20),
    evaluationDate: new Date(2023, 5, 25),
    finalScore: 89,
    maxScore: 100,
    status: 'evaluated',
    criteriaScores: [
      { id: 1, criterion: 'Նախագծի արդիականություն և նորարարություն', score: 18, maxScore: 20 },
      { id: 2, criterion: 'Տեխնիկական իրականացում', score: 27, maxScore: 30 },
      { id: 3, criterion: 'Նախագծի փաստաթղթավորում', score: 17, maxScore: 20 },
      { id: 4, criterion: 'Կոդի որակ և մաքրություն', score: 14, maxScore: 15 },
      { id: 5, criterion: 'Ներկայացում և պաշտպանություն', score: 13, maxScore: 15 }
    ],
    supervisorFeedback: 'Նախագիծը իրականացված է բարձր որակով։ Կոդը մաքուր է և լավ փաստաթղթավորված։ Տվյալների բազայի սխեման ունի փոքր բարելավման հնարավորություններ։ Ցանկալի կլիներ իրականացնել ավելի մանրամասն օգտատերերի իրավունքների կառավարում։',
    supervisorName: 'Արամ Հակոբյան'
  });
  
  const [feedback, setFeedback] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const currentUser = getCurrentUser();
  const permissions = rolePermissions[currentUser.role];
  const canAddFeedback = permissions.canApproveProject || currentUser.role === 'instructor' || currentUser.role === 'lecturer';
  
  const handleSubmitFeedback = () => {
    if (!feedback.trim()) return;
    
    setEvaluation({
      ...evaluation,
      supervisorFeedback: feedback,
      supervisorName: currentUser.name,
      evaluationDate: new Date(),
      status: 'evaluated'
    });
    
    setFeedback('');
    setDialogOpen(false);
    
    toast({
      title: "Գնահատականը հաստատված է",
      description: "Նախագծի գնահատականը և հետադարձ կապը հաջողությամբ պահպանվել են։",
    });
  };
  
  const getGradeText = (score?: number, maxScore = 100): string => {
    if (!score) return 'Չգնահատված';
    
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 94) return 'Գերազանց (A)';
    if (percentage >= 87) return 'Գերազանց (A-)';
    if (percentage >= 83) return 'Լավ (B+)';
    if (percentage >= 77) return 'Լավ (B)';
    if (percentage >= 70) return 'Լավ (B-)';
    if (percentage >= 67) return 'Բավարար (C+)';
    if (percentage >= 63) return 'Բավարար (C)';
    if (percentage >= 60) return 'Բավարար (C-)';
    if (percentage >= 50) return 'Անբավարար (D)';
    return 'Անբավարար (F)';
  };
  
  const getStatusBadge = (status: Evaluation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
          <Clock size={14} className="mr-1" /> Գնահատման սպասում
        </Badge>;
      case 'evaluated':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle size={14} className="mr-1" /> Գնահատված
        </Badge>;
      case 'returned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
          <AlertTriangle size={14} className="mr-1" /> Վերադարձված լրամշակման
        </Badge>;
      case 'not_submitted':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
          <Clock size={14} className="mr-1" /> Չներկայացված
        </Badge>;
    }
  };
  
  const renderStars = (score: number, maxScore: number) => {
    const stars = [];
    const fullStars = Math.floor((score / maxScore) * 5);
    const hasHalfStar = ((score / maxScore) * 5) % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="text-yellow-500 fill-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={16} className="text-yellow-500 fill-yellow-500" />);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-muted-foreground" />);
    }
    
    return stars;
  };
  
  if (evaluation.status === 'not_submitted') {
    return (
      <Card className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">Նախագիծը դեռևս չի ներկայացվել գնահատման</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Նախագիծը պետք է ներկայացվի գնահատման՝ գնահատական ստանալու համար։
        </p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">Նախագծի գնահատում</h3>
            {getStatusBadge(evaluation.status)}
          </div>
          {evaluation.supervisorName && (
            <p className="text-sm text-muted-foreground mt-1">
              Գնահատող: {evaluation.supervisorName}
            </p>
          )}
        </div>
        
        {canAddFeedback && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                Ավելացնել գնահատական
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Գնահատել նախագիծը</DialogTitle>
                <DialogDescription>
                  Տրամադրեք հետադարձ կապ նախագծի վերաբերյալ։
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="feedback">Հետադարձ կապ</Label>
                  <Textarea
                    id="feedback"
                    rows={6}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Մանրամասն հետադարձ կապ նախագծի ուժեղ և թույլ կողմերի վերաբերյալ..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmitFeedback}>Հաստատել գնահատականը</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <h4 className="font-medium text-lg mb-4">Գնահատման չափանիշներ</h4>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Չափանիշ</TableHead>
                <TableHead className="w-24 text-center">Միավոր</TableHead>
                <TableHead className="w-32 text-center">Գնահատական</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluation.criteriaScores?.map(criterion => (
                <TableRow key={criterion.id}>
                  <TableCell>{criterion.criterion}</TableCell>
                  <TableCell className="text-center">
                    {criterion.score} / {criterion.maxScore}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      {renderStars(criterion.score, criterion.maxScore)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
        
        <Card className="p-6">
          <h4 className="font-medium text-lg mb-4">Ամփոփ գնահատական</h4>
          
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center my-6">
              <div className="text-4xl font-bold">
                {evaluation.finalScore}
                <span className="text-xl text-muted-foreground">/{evaluation.maxScore}</span>
              </div>
              <p className="mt-2 font-medium">
                {getGradeText(evaluation.finalScore, evaluation.maxScore)}
              </p>
              <div className="flex mt-2">
                {evaluation.finalScore && renderStars(evaluation.finalScore, evaluation.maxScore)}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Ներկայացման ամսաթիվ</span>
                <span>{evaluation.submissionDate ? format(new Date(evaluation.submissionDate), 'dd/MM/yyyy') : '-'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Գնահատման ամսաթիվ</span>
                <span>{evaluation.evaluationDate ? format(new Date(evaluation.evaluationDate), 'dd/MM/yyyy') : '-'}</span>
              </div>
            </div>
            
            <Button className="w-full" variant="outline" asChild>
              <a href="#" download>
                <FileDown size={16} className="mr-2" /> Ներբեռնել գնահատման թերթիկը
              </a>
            </Button>
          </div>
        </Card>
      </div>
      
      {evaluation.supervisorFeedback && (
        <Card className="p-6">
          <h4 className="font-medium text-lg mb-4">Հետադարձ կապ ղեկավարից</h4>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-muted-foreground">{evaluation.supervisorFeedback}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProjectEvaluation;
