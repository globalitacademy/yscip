
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TimelineEvent } from '@/data/projectThemes';
import { Check, Clock, CalendarRange } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

interface ProjectTimelineProps {
  timeline: TimelineEvent[];
  onAddEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  onCompleteEvent: (eventId: string) => void;
  isEditing: boolean;
  projectStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  onSubmitProject: (feedback: string) => void;
  onApproveProject: (feedback: string) => void;
  onRejectProject: (feedback: string) => void;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  timeline,
  onAddEvent,
  onCompleteEvent,
  isEditing,
  projectStatus,
  onSubmitProject,
  onApproveProject,
  onRejectProject
}) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [feedback, setFeedback] = useState('');
  
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return;
    
    onAddEvent({
      title: newEvent.title,
      description: newEvent.description,
      date: new Date(newEvent.date).toISOString(),
      completed: false
    });
    
    setNewEvent({
      title: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const statusButton = () => {
    switch (projectStatus) {
      case 'not_submitted':
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">Ներկայացնել նախագիծը</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ներկայացնել նախագիծը</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="feedback">Մեկնաբանություն</Label>
                <Textarea
                  id="feedback"
                  placeholder="Գրեք ձեր մեկնաբանությունը..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Չեղարկել</Button>
                </DialogClose>
                <Button onClick={() => onSubmitProject(feedback)}>Ներկայացնել</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      case 'pending':
        return (
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  Հաստատել
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Հաստատել նախագիծը</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="feedback">Մեկնաբանություն</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Գրեք ձեր մեկնաբանությունը..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Չեղարկել</Button>
                  </DialogClose>
                  <Button onClick={() => onApproveProject(feedback)}>Հաստատել</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  Մերժել
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Մերժել նախագիծը</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="feedback">Մերժման պատճառը</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Նշեք մերժման պատճառը..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Չեղարկել</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={() => onRejectProject(feedback)}>
                    Մերժել
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      case 'approved':
        return (
          <Button variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200" disabled>
            <Check className="h-4 w-4 mr-2" /> Հաստատված է
          </Button>
        );
      case 'rejected':
        return (
          <Button variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200" disabled>
            <Check className="h-4 w-4 mr-2" /> Մերժված է
          </Button>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5" /> Ժամանակացույց
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline track */}
              <div className="absolute h-full w-px bg-border left-6 top-0" />
              
              {/* Timeline events */}
              <div className="space-y-6">
                {timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-14">
                    {/* Timeline node */}
                    <div 
                      className={cn(
                        "absolute left-4 w-5 h-5 rounded-full border-2 -translate-x-1/2",
                        event.completed 
                          ? "bg-primary border-primary" 
                          : "bg-background border-border"
                      )}
                    />
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {format(new Date(event.date), 'dd.MM.yyyy')}
                        </div>
                        
                        {isEditing && !event.completed && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => onCompleteEvent(event.id)}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Ավարտվել է
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add new event form */}
                {isEditing && (
                  <div className="relative pl-14 pt-2">
                    <div className="absolute left-4 w-5 h-5 rounded-full border-2 border-dashed border-border -translate-x-1/2 bg-background" />
                    
                    <div className="space-y-3">
                      <Input 
                        placeholder="Իրադարձության անվանում"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        />
                        <Button onClick={handleAddEvent}>Ավելացնել</Button>
                      </div>
                      <Textarea 
                        placeholder="Նկարագրություն (ոչ պարտադիր)"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Նախագծի կարգավիճակ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Ընթացիկ կարգավիճակ</p>
                <div 
                  className={cn(
                    "px-3 py-1.5 inline-flex items-center rounded-full text-sm font-medium",
                    projectStatus === 'approved' && "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
                    projectStatus === 'pending' && "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300",
                    projectStatus === 'rejected' && "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
                    projectStatus === 'not_submitted' && "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300"
                  )}
                >
                  {projectStatus === 'approved' && "Հաստատված"}
                  {projectStatus === 'pending' && "Սպասում է հաստատման"}
                  {projectStatus === 'rejected' && "Մերժված"}
                  {projectStatus === 'not_submitted' && "Չի ներկայացվել"}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-col gap-3">
                {statusButton()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectTimeline;
