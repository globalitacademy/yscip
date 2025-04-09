
import React from 'react';
import { TimelineEvent } from '@/data/projectThemes';
import { User, getCurrentUser, rolePermissions } from '@/data/userRoles';
import { CalendarClock, CheckCircle2, CircleDashed, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

interface TimelineProps {
  events: TimelineEvent[];
  onAddEvent?: (event: Omit<TimelineEvent, 'id'>) => void;
  onCompleteEvent?: (eventId: string) => void;
  isEditing?: boolean; // Add isEditing prop
}

const Timeline: React.FC<TimelineProps> = ({ 
  events = [],
  onAddEvent,
  onCompleteEvent,
  isEditing = false // Set default value to false
}) => {
  const currentUser = getCurrentUser();
  const permissions = rolePermissions[currentUser.role];
  const [open, setOpen] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({
    title: '',
    date: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddEvent) {
      onAddEvent({
        ...newEvent,
        isCompleted: false
      });
      setNewEvent({ title: '', date: '', description: '' });
      setOpen(false);
      toast({
        title: "Իրադարձությունն ավելացված է",
        description: "Ժամանակացույցում հաջողությամբ ավելացվեց նոր իրադարձություն։",
      });
    }
  };

  const handleComplete = (eventId: string) => {
    if (onCompleteEvent) {
      onCompleteEvent(eventId);
      toast({
        title: "Իրադարձությունը նշվեց որպես ավարտված",
        description: "Ժամանակացույցի իրադարձությունը հաջողությամբ թարմացվեց։",
      });
    }
  };

  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Ծրագրի ժամանակացույց</h3>
        {(permissions.canAddTimeline || isEditing) && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus size={16} /> Ավելացնել իրադարձություն
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Նոր իրադարձություն</DialogTitle>
                <DialogDescription>
                  Ավելացրեք նոր իրադարձություն պրոեկտի ժամանակացույցում։
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Վերնագիր</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Ամսաթիվ</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Նկարագրություն</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Ավելացնել</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative ml-4 pl-6 border-l-2 border-border space-y-8">
        {sortedEvents.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            Դեռևս ժամանակացույցում իրադարձություններ չկան։ Ավելացրեք առաջին իրադարձությունը։
          </div>
        ) : (
          sortedEvents.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Circular indicator */}
              <div className="absolute -left-[39px] p-2 bg-background">
                {event.isCompleted ? (
                  <CheckCircle2 size={20} className="text-primary" />
                ) : (
                  <CircleDashed size={20} className="text-muted-foreground" />
                )}
              </div>

              <Card className={`p-4 transition-all ${event.isCompleted ? 'bg-muted/40' : 'bg-card hover:shadow-md'}`}>
                <div className="flex justify-between">
                  <h4 className={`font-medium ${event.isCompleted ? 'text-muted-foreground' : ''}`}>
                    {event.title}
                  </h4>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <CalendarClock size={12} />
                    {new Date(event.date).toLocaleDateString('hy-AM')}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {event.description}
                </p>
                
                {!event.isCompleted && (permissions.canApproveTimelineEvents || isEditing) && (
                  <div className="mt-4 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleComplete(event.id)}
                    >
                      <CheckCircle2 size={16} /> Նշել որպես ավարտված
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Timeline;
