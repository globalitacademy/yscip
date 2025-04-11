
import React, { useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { Task, TimelineEvent } from '@/data/projectThemes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Circle, Clock, PlusCircle, User } from 'lucide-react';

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
  const { theme } = useTheme();
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  
  const handleAddTimelineEvent = () => {
    if (newEventTitle && newEventDate) {
      addTimelineEvent({
        title: newEventTitle,
        date: newEventDate,
        isCompleted: false,
      });
      setNewEventTitle('');
      setNewEventDate('');
    }
  };
  
  const handleAddTask = () => {
    if (newTaskTitle) {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        assignedTo: '',
        status: 'todo',
        createdAt: new Date().toISOString(),
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
    }
  };
  
  const handleSubmitProject = () => {
    submitProject(feedbackText);
    setFeedbackText('');
  };
  
  const handleApproveProject = () => {
    approveProject(feedbackText);
    setFeedbackText('');
  };
  
  const handleRejectProject = () => {
    rejectProject(feedbackText);
    setFeedbackText('');
  };
  
  const getStatusBadgeColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
      case 'done':
        return theme === 'dark' 
          ? 'bg-green-700/40 text-green-300 hover:bg-green-700/60' 
          : 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'inProgress':
      case 'in-progress':
        return theme === 'dark' 
          ? 'bg-blue-700/40 text-blue-300 hover:bg-blue-700/60' 
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return theme === 'dark' 
          ? 'bg-gray-700/40 text-gray-300 hover:bg-gray-700/60' 
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Timeline Section */}
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
              Նախագծի ժամանակացույց
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-6 border-l border-dashed mb-6 space-y-6">
              {timeline.map((event, index) => (
                <div key={index} className="relative">
                  {event.isCompleted ? (
                    <CheckCircle 
                      className={`absolute -left-[25px] h-5 w-5 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`} 
                    />
                  ) : (
                    <Circle 
                      className={`absolute -left-[25px] h-5 w-5 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`} 
                      strokeWidth={1.5}
                    />
                  )}
                  
                  <div className={`mb-1 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    <span className="font-medium">{event.title}</span>
                    
                    {!event.isCompleted && isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className={`ml-2 py-0 h-7 text-xs ${
                          theme === 'dark' 
                            ? 'border-gray-600 hover:bg-gray-700' 
                            : 'border-gray-300 hover:bg-gray-100'
                        }`}
                        onClick={() => completeTimelineEvent(event.id)}
                      >
                        Նշել որպես ավարտված
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-sm mb-1">
                    <Clock className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {event.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add new timeline event */}
            {isEditing && (
              <div className={`mt-8 p-4 rounded ${
                theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'
              } border`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Ավելացնել նոր իրադարձություն
                </h4>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Իրադարձության վերնագիր"
                    className={`w-full px-3 py-2 text-sm rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="Ամսաթիվ (օր․՝ 2025թ․ հունվարի 15)"
                    className={`w-full px-3 py-2 text-sm rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  
                  <Button
                    onClick={handleAddTimelineEvent}
                    disabled={!newEventTitle || !newEventDate}
                    size="sm"
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> 
                    Ավելացնել իրադարձություն
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
              Առաջադրանքներ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {tasks.map((task, index) => (
                <AccordionItem 
                  key={index} 
                  value={`task-${index}`}
                  className={theme === 'dark' ? 'border-gray-700' : ''}
                >
                  <AccordionTrigger className={theme === 'dark' ? 'text-gray-200 hover:text-gray-100' : ''}>
                    <div className="flex items-center gap-2 text-left">
                      <span className="line-clamp-1">{task.title}</span>
                      <Badge className={getStatusBadgeColor(task.status)}>
                        {task.status === 'completed' || task.status === 'done' ? 'Ավարտված' : 
                         task.status === 'inProgress' || task.status === 'in-progress' ? 'Ընթացքում' : 'Սպասում է'}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={theme === 'dark' ? 'text-gray-300' : ''}>
                    <div className="px-1 space-y-2">
                      <p>{task.description}</p>
                      
                      <div className="flex items-center gap-1.5 text-sm">
                        <User className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          {task.assignedTo || 'Չնշանակված'}
                        </span>
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant={task.status === 'todo' || task.status === 'open' ? 'default' : 'outline'}
                            onClick={() => updateTaskStatus(task.id, 'todo')}
                            className={`flex-1 ${task.status === 'todo' || task.status === 'open' ? '' : 'border-gray-300'}`}
                          >
                            Սպասում
                          </Button>
                          <Button
                            size="sm"
                            variant={task.status === 'inProgress' || task.status === 'in-progress' ? 'default' : 'outline'}
                            onClick={() => updateTaskStatus(task.id, 'in-progress')}
                            className={`flex-1 ${task.status === 'inProgress' || task.status === 'in-progress' ? '' : 'border-gray-300'}`}
                          >
                            Ընթացքում
                          </Button>
                          <Button
                            size="sm"
                            variant={task.status === 'completed' || task.status === 'done' ? 'default' : 'outline'}
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            className={`flex-1 ${task.status === 'completed' || task.status === 'done' ? '' : 'border-gray-300'}`}
                          >
                            Ավարտված
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {/* Add new task */}
            {isEditing && (
              <div className={`mt-8 p-4 rounded ${
                theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'
              } border`}>
                <h4 className={`text-sm font-medium mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Ավելացնել նոր առաջադրանք
                </h4>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Առաջադրանքի վերնագիր"
                    className={`w-full px-3 py-2 text-sm rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Առաջադրանքի նկարագրություն"
                    className={`w-full px-3 py-2 text-sm rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    rows={3}
                  />
                  
                  <Button
                    onClick={handleAddTask}
                    disabled={!newTaskTitle}
                    size="sm"
                    className="w-full"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" /> 
                    Ավելացնել առաջադրանք
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Project Status Management */}
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={theme === 'dark' ? 'text-gray-100' : ''}>
            Նախագծի կարգավիճակ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div>
                <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                  Ընթացիկ կարգավիճակ:
                </h3>
                <Badge 
                  className={`mt-2 ${
                    projectStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    projectStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    projectStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  } ${theme === 'dark' ? 'bg-opacity-20 border' : ''}`}
                >
                  {projectStatus === 'approved' ? 'Հաստատված' :
                   projectStatus === 'rejected' ? 'Մերժված' :
                   projectStatus === 'pending' ? 'Սպասում է հաստատման' :
                   'Չներկայացված'}
                </Badge>
              </div>
            </div>
            
            {isEditing && (
              <>
                <Separator className={theme === 'dark' ? 'bg-gray-700' : ''} />
                
                <div>
                  <h4 className={`mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Փոխել նախագծի կարգավիճակը
                  </h4>
                  
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Մեկնաբանություն (ոչ պարտադիր)..."
                    className={`w-full mb-4 px-3 py-2 text-sm rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                    rows={3}
                  />
                  
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={handleSubmitProject} variant="outline">
                      Ներկայացնել հաստատման
                    </Button>
                    <Button onClick={handleApproveProject} variant="default" className="bg-green-600 hover:bg-green-700">
                      Հաստատել նախագիծը
                    </Button>
                    <Button onClick={handleRejectProject} variant="destructive">
                      Մերժել նախագիծը
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectImplementationTab;
