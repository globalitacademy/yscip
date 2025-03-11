
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const GanttPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  
  // Mock projects for demonstration
  const projects = [
    { id: '1', name: 'Վեբ հավելված' },
    { id: '2', name: 'Մոբայլ հավելված' },
    { id: '3', name: 'Տվյալների վերլուծություն' },
  ];
  
  // Mock tasks for demonstration
  const tasks = [
    { id: 1, name: 'Պահանջների վերլուծություն', start: '2025-03-01', end: '2025-03-05', completed: 100 },
    { id: 2, name: 'Դիզայն', start: '2025-03-06', end: '2025-03-12', completed: 80 },
    { id: 3, name: 'Ֆրոնթենդ մշակում', start: '2025-03-13', end: '2025-03-25', completed: 60 },
    { id: 4, name: 'Բեքենդ մշակում', start: '2025-03-15', end: '2025-03-30', completed: 40 },
    { id: 5, name: 'Թեստավորում', start: '2025-03-31', end: '2025-04-10', completed: 20 },
    { id: 6, name: 'Ներդրում', start: '2025-04-11', end: '2025-04-15', completed: 0 },
  ];
  
  // Get current dates for timeline
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 15);
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 30);
  
  // Calculate total days for the Gantt chart
  const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate dates for the timeline
  const dates = Array.from({ length: days + 1 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return date;
  });
  
  return (
    <AdminLayout pageTitle="Գանտի ժամանակացույց">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Ընտրեք նախագիծը" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Button variant="outline">Արտահանել</Button>
            <Button>Թարմացնել</Button>
          </div>
        </div>
        
        {!selectedProject ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Տեղեկատվություն</AlertTitle>
            <AlertDescription>
              Խնդրում ենք ընտրել նախագիծը Գանտի ժամանակացույցը դիտելու համար:
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{projects.find(p => p.id === selectedProject)?.name} - Ժամանակացույց</CardTitle>
              <CardDescription>Նախագծի աշխատանքների ժամանակացույց Գանտի դիագրամով</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header with dates */}
                  <div className="flex border-b">
                    <div className="w-1/4 min-w-[200px] p-2 font-medium">Առաջադրանք</div>
                    <div className="w-3/4 flex">
                      {dates.map((date, index) => (
                        <div 
                          key={index} 
                          className={`text-xs text-center flex-1 p-1 ${
                            date.getDate() === today.getDate() && 
                            date.getMonth() === today.getMonth() && 
                            date.getFullYear() === today.getFullYear() 
                              ? 'bg-blue-100 font-bold' 
                              : (date.getDay() === 0 || date.getDay() === 6) 
                                ? 'bg-gray-100' 
                                : ''
                          }`}
                        >
                          {date.getDate()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tasks */}
                  {tasks.map(task => {
                    const taskStart = new Date(task.start);
                    const taskEnd = new Date(task.end);
                    
                    // Calculate position and width
                    const startOffset = Math.max(0, Math.floor((taskStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
                    const taskDuration = Math.floor((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                    const width = Math.min(taskDuration, days - startOffset);
                    
                    return (
                      <div key={task.id} className="flex border-b">
                        <div className="w-1/4 min-w-[200px] p-2">
                          <div>{task.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {task.start} - {task.end}
                          </div>
                        </div>
                        <div className="w-3/4 flex relative">
                          {startOffset >= 0 && startOffset < days && width > 0 && (
                            <div 
                              className="absolute h-6 rounded"
                              style={{
                                left: `${(startOffset / days) * 100}%`,
                                width: `${(width / days) * 100}%`,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: task.completed === 100 
                                  ? 'rgba(34, 197, 94, 0.7)' 
                                  : 'rgba(59, 130, 246, 0.7)',
                              }}
                            >
                              <div 
                                className="h-full bg-green-500 rounded-l"
                                style={{
                                  width: `${task.completed}%`,
                                  opacity: 0.8
                                }}
                              />
                            </div>
                          )}
                          {dates.map((_, index) => (
                            <div 
                              key={index} 
                              className={`flex-1 h-12 ${
                                index === startOffset ? 'border-l border-r border-gray-300' : ''
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default GanttPage;
