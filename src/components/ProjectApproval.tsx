
import React from 'react';
import { getCurrentUser, rolePermissions } from '@/data/userRoles';
import { Button } from '@/components/ui/button';
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
import { toast } from "@/components/ui/use-toast";
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Upload, FileCheck2, Clock } from 'lucide-react';

interface ProjectApprovalProps {
  projectStatus?: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  onSubmit?: (feedback: string) => void;
  onApprove?: (feedback: string) => void;
  onReject?: (feedback: string) => void;
}

const ProjectApproval: React.FC<ProjectApprovalProps> = ({
  projectStatus = 'not_submitted',
  onSubmit,
  onApprove,
  onReject
}) => {
  const currentUser = getCurrentUser();
  const permissions = rolePermissions[currentUser.role];
  const [feedback, setFeedback] = React.useState('');
  const [submitOpen, setSubmitOpen] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(feedback);
      setFeedback('');
      setSubmitOpen(false);
      toast({
        title: "Նախագիծը ներկայացված է",
        description: "Ձեր նախագիծը հաջողությամբ ներկայացվել է գնահատման։",
      });
    }
  };
  
  const handleApprove = () => {
    if (onApprove) {
      onApprove(feedback);
      setFeedback('');
      setReviewOpen(false);
      toast({
        title: "Նախագիծը հաստատված է",
        description: "Նախագիծը հաջողությամբ հաստատվել է։",
      });
    }
  };
  
  const handleReject = () => {
    if (onReject) {
      onReject(feedback);
      setFeedback('');
      setReviewOpen(false);
      toast({
        title: "Նախագիծը մերժված է",
        description: "Նախագիծը վերադարձվել է լրամշակման։",
      });
    }
  };
  
  const renderStatusBadge = () => {
    switch (projectStatus) {
      case 'not_submitted':
        return <Badge variant="outline" className="gap-1"><Clock size={14} /> Չներկայացված</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
          <Clock size={14} /> Սպասում է վերանայման
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1">
          <CheckCircle2 size={14} /> Հաստատված
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 gap-1">
          <Clock size={14} /> Վերադարձված լրամշակման
        </Badge>;
      default:
        return null;
    }
  };
  
  const canSubmit = permissions.canSubmitProject && projectStatus !== 'pending' && projectStatus !== 'approved';
  const canReview = (permissions.canApproveProject && projectStatus === 'pending');
  
  return (
    <div className="border border-border rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Նախագծի կարգավիճակ</h3>
        {renderStatusBadge()}
      </div>
      
      <div className="border-t border-border my-4"></div>
      
      <div className="flex justify-between items-center">
        {canSubmit && (
          <Dialog open={submitOpen} onOpenChange={setSubmitOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Upload size={16} /> Ներկայացնել նախագիծը
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Նախագծի ներկայացում</DialogTitle>
                <DialogDescription>
                  Ներկայացրեք ձեր նախագիծը գնահատման համար։ Կարող եք նաև ավելացնել մեկնաբանություն։
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Մեկնաբանություն ձեր նախագծի վերաբերյալ..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSubmitOpen(false)}>Չեղարկել</Button>
                <Button onClick={handleSubmit}>Ներկայացնել</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {canReview && (
          <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <FileCheck2 size={16} /> Գնահատել նախագիծը
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Նախագծի գնահատում</DialogTitle>
                <DialogDescription>
                  Գնահատեք ուսանողի ներկայացրած նախագիծը։ Տրամադրեք հետադարձ կապ նախագծի վերաբերյալ։
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  placeholder="Հետադարձ կապ նախագծի վերաբերյալ..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <DialogFooter className="flex justify-between">
                <Button variant="destructive" onClick={handleReject}>
                  Վերադարձնել լրամշակման
                </Button>
                <Button variant="default" onClick={handleApprove}>
                  Հաստատել նախագիծը
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {projectStatus === 'approved' && (
          <div className="text-center w-full">
            <div className="flex items-center justify-center text-green-600 mb-2">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-muted-foreground">Նախագիծը հաջողությամբ հաստատվել է։</p>
          </div>
        )}
        
        {projectStatus === 'rejected' && permissions.canSubmitProject && (
          <div className="text-center w-full">
            <p className="text-muted-foreground mb-4">Նախագիծը վերադարձվել է լրամշակման։ Խնդրում ենք կատարել անհրաժեշտ փոփոխությունները և կրկին ներկայացնել։</p>
            <Button onClick={() => setSubmitOpen(true)} className="gap-1">
              <Upload size={16} /> Կրկին ներկայացնել
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApproval;
