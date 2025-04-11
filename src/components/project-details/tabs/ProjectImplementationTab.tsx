
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TimelineEvent, Task } from '@/data/projectThemes';
import { Check, XCircle, AlertCircle, Clock, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectTimeline from '../ProjectTimeline';
import ProjectTaskList from '../ProjectTaskList';
import { useProject } from '@/contexts/ProjectContext';

interface ProjectImplementationTabProps {
  timeline: TimelineEvent[];
  tasks: Task[];
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  isEditing: boolean;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  submitProject: (feedback: string) => void;
  approveProject: (feedback: string) => void;
  rejectProject: (feedback: string) => void;
}

const ProjectImplementationTab: React.FC<ProjectImplementationTabProps> = ({
  timeline,
  tasks,
  projectStatus,
  isEditing,
  addTimelineEvent,
  completeTimelineEvent,
  addTask,
  updateTaskStatus,
  submitProject,
  approveProject,
  rejectProject
}) => {
  const { projectProgress, projectMembers } = useProject();
  
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState('timeline');

  const handleSubmitProject = () => {
    submitProject(feedback);
    setIsSubmitDialogOpen(false);
    setFeedback('');
  };

  const handleApproveProject = () => {
    approveProject(feedback);
    setIsApproveDialogOpen(false);
    setFeedback('');
  };

  const handleRejectProject = () => {
    rejectProject(feedback);
    setIsRejectDialogOpen(false);
    setFeedback('');
  };

  // Status components
  const renderStatusComponent = () => {
    switch (projectStatus) {
      case 'approved':
        return (
          <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-green-800 dark:text-green-400 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Նախագիծը հաստատված է
                  </CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Նախագիծը հաջողությամբ հաստատվել է ղեկավարի կողմից
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
        
      case 'rejected':
        return (
          <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-red-800 dark:text-red-400 flex items-center">
                    <XCircle className="h-5 w-5 mr-2" />
                    Նախագիծը մերժված է
                  </CardTitle>
                  <CardDescription className="text-red-700 dark:text-red-300">
                    Նախագիծը մերժվել է ղեկավարի կողմից։ Խնդրում ենք վերանայել մերժման պատճառները։
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
        
      case 'pending':
        return (
          <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-amber-800 dark:text-amber-400 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Նախագիծը ստուգման փուլում է
                  </CardTitle>
                  <CardDescription className="text-amber-700 dark:text-amber-300">
                    Նախագիծը ներկայացվել է և սպասում է ղեկավարի հաստատմանը
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {isEditing && (
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                    onClick={() => setIsApproveDialogOpen(true)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Հաստատել նախագիծը
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
                    onClick={() => setIsRejectDialogOpen(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Մերժել նախագիծը
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        );
        
      default:
        return (
          <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-blue-800 dark:text-blue-400 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Նախագիծը դեռ չի ներկայացվել
                  </CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-300">
                    Նախագիծը դեռևս ներկայացված չէ ղեկավարի ստուգմանը
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            {isEditing && (
              <CardContent>
                <Button
                  onClick={() => setIsSubmitDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Ներկայացնել նախագիծը ստուգման
                </Button>
              </CardContent>
            )}
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Project progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Նախագծի առաջընթաց</CardTitle>
          <CardDescription>
            {projectProgress}% ավարտված
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={projectProgress} className="h-2" />
        </CardContent>
      </Card>
      
      {/* Project status */}
      {renderStatusComponent()}
      
      {/* Implementation tabs */}
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="timeline">Ժամանակացույց</TabsTrigger>
          <TabsTrigger value="tasks">Առաջադրանքներ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="mt-6">
          <ProjectTimeline
            timeline={timeline}
            addTimelineEvent={addTimelineEvent}
            completeTimelineEvent={completeTimelineEvent}
            isEditing={isEditing}
          />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-6">
          <ProjectTaskList
            tasks={tasks}
            projectMembers={projectMembers}
            addTask={addTask}
            updateTaskStatus={updateTaskStatus}
            isEditing={isEditing}
          />
        </TabsContent>
      </Tabs>
      
      {/* Submit Project Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ներկայացնել նախագիծը ստուգման</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p>
              Նախագիծը ներկայացնելուց հետո այն կուղարկվի ձեր ղեկավարին ստուգման։
              Ցանկանու՞մ եք շարունակել։
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="submit-feedback">Լրացուցիչ տեղեկություններ (ոչ պարտադիր)</Label>
              <Textarea
                id="submit-feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Գրեք լրացուցիչ նշումներ ղեկավարի համար..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitDialogOpen(false)}
            >
              Չեղարկել
            </Button>
            <Button
              onClick={handleSubmitProject}
            >
              Ներկայացնել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Approve Project Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Հաստատել նախագիծը</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p>
              Դուք պատրաստվում եք հաստատել այս նախագիծը։
              Ցանկանու՞մ եք շարունակել։
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="approve-feedback">Հետադարձ կապ (ոչ պարտադիր)</Label>
              <Textarea
                id="approve-feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Գրեք ձեր կարծիքը նախագծի վերաբերյալ..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApproveDialogOpen(false)}
            >
              Չեղարկել
            </Button>
            <Button
              onClick={handleApproveProject}
              className="bg-green-600 hover:bg-green-700"
            >
              Հաստատել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Project Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Մերժել նախագիծը</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p>
              Դուք պատրաստվում եք մերժել այս նախագիծը։
              Խնդրում ենք նշել մերժման պատճառները։
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="reject-feedback">Մերժման պատճառ</Label>
              <Textarea
                id="reject-feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Նշեք մերժման պատճառները..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Չեղարկել
            </Button>
            <Button
              onClick={handleRejectProject}
              className="bg-red-600 hover:bg-red-700"
              disabled={!feedback}
            >
              Մերժել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectImplementationTab;
