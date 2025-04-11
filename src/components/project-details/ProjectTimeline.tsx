
import React from 'react';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { Chart } from 'react-google-charts';

interface ProjectTimelineProps {
  timeline: TimelineEvent[];
  tasks: Task[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ timeline, tasks }) => {
  // Prepare data for Gantt chart
  const prepareGanttData = () => {
    const columns = [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ];
    
    // Add timeline events as tasks
    const rows = timeline.map((event, index) => {
      const date = new Date(event.date);
      const endDate = new Date(date);
      endDate.setDate(date.getDate() + 1); // 1-day duration for timeline events
      
      return [
        `timeline-${index}`,
        event.title,
        date,
        endDate,
        null,
        event.isCompleted ? 100 : 0,
        null
      ];
    });
    
    // Add tasks with estimated durations
    tasks.forEach((task, index) => {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 5 + index); // Just for visualization
      
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 3); // 3-day duration for tasks
      
      let percentComplete = 0;
      if (task.status === 'completed' || task.status === 'done') {
        percentComplete = 100;
      } else if (task.status === 'inProgress' || task.status === 'in-progress' || task.status === 'review') {
        percentComplete = 50;
      }
      
      rows.push([
        `task-${index}`,
        task.title,
        startDate,
        endDate,
        null,
        percentComplete,
        null
      ]);
    });
    
    return [columns, ...rows];
  };
  
  const data = prepareGanttData();
  
  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      barHeight: 20,
      labelStyle: {
        fontName: 'Inter',
        fontSize: 12,
      },
    },
  };
  
  if (timeline.length === 0 && tasks.length === 0) {
    return (
      <div className="p-8 text-center bg-accent/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Դեռևս ժամանակացույց չկա</h3>
        <p className="text-muted-foreground">
          Ժամանակացույցը և առաջադրանքները կցուցադրվեն այստեղ, երբ դրանք ավելացվեն։
        </p>
      </div>
    );
  }
  
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <h3 className="text-lg font-medium mb-4">Նախագծի ժամանակացույց</h3>
      
      <div className="h-[400px] w-full">
        <Chart
          chartType="Gantt"
          width="100%"
          height="100%"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
};

export default ProjectTimeline;
