
import React, { useState } from 'react';
import { TimelineEvent } from '@/data/projectThemes';
import { 
  CalendarRange, 
  CheckCircle2, 
  Clock, 
  PlusCircle,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/hooks/use-theme';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface ProjectTimelineProps {
  timeline: TimelineEvent[];
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => void;
  completeTimelineEvent: (eventId: string) => void;
  isEditing?: boolean;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  timeline,
  addTimelineEvent,
  completeTimelineEvent,
  isEditing = false
}) => {
  const { theme } = useTheme();
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventDate, setNewEventDate] = useState<Date | undefined>(new Date());

  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const handleSubmitNewEvent = () => {
    if (!newEventTitle || !newEventDate) return;
    
    addTimelineEvent({
      title: newEventTitle,
      description: newEventDescription,
      date: format(newEventDate, 'yyyy-MM-dd'),
      isCompleted: false
    });
    
    setIsAddEventDialogOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventDate(new Date());
  };

  const handleCompleteEvent = (eventId: string) => {
    completeTimelineEvent(eventId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <CalendarRange className="h-6 w-6 mr-2" /> 
          Նախագծի ժամանակացույց
        </h2>
        
        {isEditing && (
          <Button 
            onClick={() => setIsAddEventDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Ավելացնել իրադարձություն
          </Button>
        )}
      </div>
      
      {timeline.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Այս նախագծի համար դեռևս իրադարձություններ չկան։
            </p>
            
            {isEditing && (
              <Button 
                onClick={() => setIsAddEventDialogOpen(true)} 
                variant="outline" 
                className="mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ավելացնել առաջին իրադարձությունը
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline track */}
          <div 
            className={`absolute left-4 w-1 h-full ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`} 
          />
          
          {/* Timeline events */}
          <div className="space-y-6 relative ml-12">
            {sortedTimeline.map((event, idx) => (
              <div key={event.id} className="relative">
                {/* Timeline dot */}
                <div 
                  className={`absolute -left-12 w-5 h-5 rounded-full flex items-center justify-center ${
                    event.isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'border-2 border-gray-400 bg-white dark:bg-gray-900'
                  }`}
                >
                  {event.isCompleted && <CheckCircle2 className="h-4 w-4" />}
                </div>
                
                {/* Timeline card */}
                <Card>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">
                        {event.title}
                      </CardTitle>
                      <Badge 
                        variant={event.isCompleted ? "success" : "outline"}
                        className={event.isCompleted ? "bg-green-100 text-green-800" : ""}
                      >
                        <div className="flex items-center">
                          {event.isCompleted 
                            ? <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> 
                            : <Clock className="h-3 w-3 mr-1" />
                          }
                          {event.isCompleted ? 'Ավարտված' : 'Սպասվում է'}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      <Calendar className="h-3 w-3 inline-block mr-1" />
                      {format(new Date(event.date), 'dd/MM/yyyy')}
                    </p>
                    
                    {event.description && (
                      <p className="text-sm">{event.description}</p>
                    )}
                    
                    {isEditing && !event.isCompleted && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-3"
                        onClick={() => handleCompleteEvent(event.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                        Նշել որպես ավարտված
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add Event Dialog */}
      <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Նոր իրադարձություն</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Վերնագիր</Label>
              <Input
                id="event-title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Իրադարձության վերնագիր"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Նկարագրություն</Label>
              <Textarea
                id="event-description"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                placeholder="Իրադարձության մանրամասն նկարագրություն"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-date">Ամսաթիվ</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="event-date"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarRange className="mr-2 h-4 w-4" />
                    {newEventDate ? format(newEventDate, 'PPP') : <span>Ընտրել ամսաթիվ</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newEventDate}
                    onSelect={setNewEventDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddEventDialogOpen(false)}
            >
              Չեղարկել
            </Button>
            <Button
              onClick={handleSubmitNewEvent}
              disabled={!newEventTitle || !newEventDate}
            >
              Ավելացնել
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTimeline;
