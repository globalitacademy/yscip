
import React from 'react';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CalendarRange, Clock, AlertCircle } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'completed';
  type: 'task' | 'event';
}

interface ProjectTimelineProps {
  timeline: TimelineEvent[];
  tasks: Task[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ timeline, tasks }) => {
  const today = new Date();
  
  // Convert timeline events and tasks to unified timeline items
  const timelineItems: TimelineItem[] = [
    ...timeline.map(event => ({
      id: event.id,
      title: event.title,
      startDate: parseISO(event.date),
      endDate: addDays(parseISO(event.date), 1), // End date is 1 day after for events
      status: event.completed ? 'completed' as const : 'todo' as const,
      type: 'event' as const
    })),
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      startDate: task.dueDate ? addDays(parseISO(task.dueDate), -7) : addDays(today, -7), // Assume 7 days for tasks without dates
      endDate: task.dueDate ? parseISO(task.dueDate) : today,
      status: task.status,
      type: 'task' as const
    }))
  ].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  
  // Calculate timeline range (1 month)
  const startDate = timelineItems.length > 0 
    ? new Date(Math.min(...timelineItems.map(item => item.startDate.getTime()))) 
    : addDays(today, -15);
  const endDate = timelineItems.length > 0 
    ? new Date(Math.max(...timelineItems.map(item => item.endDate.getTime()))) 
    : addDays(today, 15);
  
  // Generate date range (ensure at least 30 days)
  const days = Math.max(30, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const dateRange = Array.from({ length: days + 1 }, (_, i) => addDays(startDate, i));
  
  const getStatusColor = (status: TimelineItem['status'], isLate: boolean) => {
    if (isLate) return 'bg-red-500/20 border-red-500';
    
    switch (status) {
      case 'todo': return 'bg-slate-200/50 border-slate-400';
      case 'in-progress': return 'bg-blue-200/50 border-blue-400';
      case 'review': return 'bg-amber-200/50 border-amber-400';
      case 'done':
      case 'completed': return 'bg-green-200/50 border-green-400';
      default: return 'bg-slate-200/50 border-slate-400';
    }
  };
  
  const getItemWidth = (item: TimelineItem) => {
    const duration = Math.max(1, Math.ceil((item.endDate.getTime() - item.startDate.getTime()) / (1000 * 60 * 60 * 24)));
    return `${duration * 40}px`; // 40px per day
  };
  
  const getItemPosition = (item: TimelineItem) => {
    const daysDiff = Math.ceil((item.startDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return `${daysDiff * 40}px`; // 40px per day
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5" /> Նախագծի թայմլայն
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[1200px]">
            {/* Date headers */}
            <div className="flex border-b mb-4">
              <div className="w-[200px] flex-shrink-0 font-medium p-2">Անվանում</div>
              <div className="flex-1 flex">
                {dateRange.map((date, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-[40px] text-center text-xs p-1 flex-shrink-0",
                      format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') 
                        ? "bg-primary/10 font-bold" 
                        : (date.getDay() === 0 || date.getDay() === 6) ? "bg-muted/50" : ""
                    )}
                  >
                    {format(date, 'dd')}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Month labels */}
            <div className="flex mb-6">
              <div className="w-[200px] flex-shrink-0"></div>
              <div className="flex-1 flex">
                {dateRange.map((date, i) => {
                  // Only show label at the first day of month
                  if (i === 0 || format(date, 'MMM') !== format(dateRange[i-1], 'MMM')) {
                    return (
                      <div 
                        key={i} 
                        className="text-xs font-medium text-muted-foreground"
                        style={{
                          position: 'absolute',
                          transform: 'translateX(-50%)',
                          marginLeft: `${i * 40 + 20}px`
                        }}
                      >
                        {format(date, 'MMM')}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
            
            {/* Timeline items */}
            <div className="space-y-2">
              {timelineItems.map(item => {
                const isLate = item.status !== 'done' && 
                               item.status !== 'completed' && 
                               isAfter(today, item.endDate);
                
                return (
                  <div key={item.id} className="flex items-center">
                    <div className="w-[200px] flex-shrink-0 p-2 text-sm">
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock size={12} />
                        <span>{format(item.startDate, 'dd MMM')} - {format(item.endDate, 'dd MMM')}</span>
                      </div>
                    </div>
                    <div className="flex-1 relative h-8">
                      {/* Today indicator */}
                      {isBefore(startDate, today) && isBefore(today, endDate) && (
                        <div 
                          className="absolute top-0 bottom-0 w-px bg-primary z-10"
                          style={{ 
                            left: `${Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) * 40}px` 
                          }}
                        />
                      )}
                      
                      {/* The timeline bar */}
                      <div 
                        className={cn(
                          "absolute top-1 h-6 rounded px-2 text-xs flex items-center border",
                          getStatusColor(item.status, isLate)
                        )}
                        style={{ 
                          left: getItemPosition(item),
                          width: getItemWidth(item)
                        }}
                      >
                        <div className="truncate">
                          {isLate && <AlertCircle size={12} className="inline mr-1 text-red-500" />}
                          {item.title}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Badge variant="outline" className="bg-slate-200/50 border-slate-400">Սպասվող</Badge>
              <Badge variant="outline" className="bg-blue-200/50 border-blue-400">Ընթացքում</Badge>
              <Badge variant="outline" className="bg-amber-200/50 border-amber-400">Վերանայում</Badge>
              <Badge variant="outline" className="bg-green-200/50 border-green-400">Ավարտված</Badge>
              <Badge variant="outline" className="bg-red-500/20 border-red-500">Ուշացած</Badge>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-px h-4 bg-primary"></div>
                <span className="text-xs text-muted-foreground">Այսօր</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
