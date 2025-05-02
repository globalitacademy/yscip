
import React, { useState } from 'react';
import { TimelineEvent } from '@/data/projectThemes';
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProjectTimelineProps {
  timeline: TimelineEvent[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  onSubmitProject: (feedback: string) => void;
  onApproveProject: (feedback: string) => void;
  onRejectProject: (feedback: string) => void;
  isEditing?: boolean;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  timeline,
  projectStatus,
  onSubmitProject,
  onApproveProject,
  onRejectProject,
  isEditing = false
}) => {
  const [submissionDialog, setSubmissionDialog] = useState(false);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const sortedTimeline = [...timeline].sort((a, b) => {
    // Sort by date (assuming dates are string ISO format)
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });
  
  // Prepare data for the Gantt chart
  const chartData = {
    labels: sortedTimeline.map(event => event.title),
    datasets: [
      {
        label: 'Ժամանակացույց',
        data: sortedTimeline.map((_, index) => index + 1), // Just for display positioning
        backgroundColor: sortedTimeline.map(event => 
          event.isCompleted ? 'rgba(34, 197, 94, 0.6)' : 'rgba(59, 130, 246, 0.6)'
        ),
        borderColor: sortedTimeline.map(event => 
          event.isCompleted ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)'
        ),
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const event = sortedTimeline[context.dataIndex];
            return [
              `Ամսաթիվ: ${formatDate(event.date)}`,
              `Կարգավիճակ: ${event.isCompleted ? 'Ավարտված' : 'Ընթացքի մեջ'}`,
              `Նկարագրություն: ${event.description}`
            ];
          }
        }
      }
    },
  };
  
  const handleSubmitDialog = () => {
    onSubmitProject(feedback);
    setFeedback('');
    setSubmissionDialog(false);
  };
  
  const handleApproveDialog = () => {
    onApproveProject(feedback);
    setFeedback('');
    setApprovalDialog(false);
  };
  
  const handleRejectDialog = () => {
    onRejectProject(feedback);
    setFeedback('');
    setRejectDialog(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Նախագծի ժամանակացույց</h2>
        <p className="text-muted-foreground mb-6">
          Այս էջում կարող եք տեսնել նախագծի ժամանակացույցը և պլանավորված առաջադրանքներըը։
        </p>
        
        <div className="h-80 mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Ժամանակացույցի մանրամասներ</h3>
        <div className="space-y-4">
          {sortedTimeline.map((event, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-muted">
              <div className={`w-3 h-3 mt-1.5 rounded-full ${event.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} />
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <span className="text-sm text-muted-foreground">{formatDate(event.date)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {!isEditing && (
        <div className="pt-6 border-t border-border">
          <h3 className="text-xl font-bold mb-4">Նախագծի կարգավիճակ</h3>
          <div className="flex flex-wrap gap-4 items-center">
            {projectStatus === 'not_submitted' && (
              <Button 
                onClick={() => setSubmissionDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ուղարկել հաստատման
              </Button>
            )}
            
            {projectStatus === 'pending' && (
              <div className="flex gap-4">
                <Button 
                  onClick={() => setApprovalDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Հաստատել նախագիծը
                </Button>
                <Button 
                  onClick={() => setRejectDialog(true)}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Մերժել
                </Button>
              </div>
            )}
            
            {projectStatus === 'approved' && (
              <div className="px-3 py-1.5 bg-green-100 text-green-800 rounded-md flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Նախագիծը հաստատված է
              </div>
            )}
            
            {projectStatus === 'rejected' && (
              <div className="px-3 py-1.5 bg-red-100 text-red-800 rounded-md flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Նախագիծը մերժված է
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Submission Dialog */}
      <Dialog open={submissionDialog} onOpenChange={setSubmissionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Նախագծի հաստատման հարցում</DialogTitle>
            <DialogDescription>
              Ուղարկեք ձեր նախագիծը հաստատման։ Կարող եք նաև հաղորդագրություն թողնել։
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="Մուտքագրեք ձեր հաղորդագրությունը ուսուցչին կամ դասախոսին..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmissionDialog(false)}>Չեղարկել</Button>
            <Button onClick={handleSubmitDialog}>Հաստատել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approval Dialog */}
      <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Նախագծի հաստատում</DialogTitle>
            <DialogDescription>
              Հաստատեք այս նախագիծը։ Կարող եք նաև հետադարձ կապ թողնել։
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="Մուտքագրեք ձեր հաղորդագրությունը ուսանողին..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog(false)}>Չեղարկել</Button>
            <Button onClick={handleApproveDialog} className="bg-green-600 hover:bg-green-700">Հաստատել նախագիծը</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Նախագծի մերժում</DialogTitle>
            <DialogDescription>
              Մերժեք այս նախագիծը։ Խնդրում ենք նշել մերժման պատճառը։
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="Մուտքագրեք մերժման պատճառը..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialog(false)}>Չեղարկել</Button>
            <Button onClick={handleRejectDialog} variant="destructive">Մերժել նախագիծը</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTimeline;
