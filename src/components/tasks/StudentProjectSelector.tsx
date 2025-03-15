
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import TaskForm from '@/components/tasks/TaskForm';
import { User } from '@/types/user';

interface StudentProjectSelectorProps {
  selectedCourse: string;
  selectedGroup: string;
  selectedStudent: string;
  selectedProject: string;
  courses: string[];
  groups: string[];
  students: User[];
  studentProjects: {id: number, title: string}[];
  showTaskForm: boolean;
  setShowTaskForm: (show: boolean) => void;
  onCourseChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  onStudentChange: (value: string) => void;
  onProjectChange: (value: string) => void;
  onAddTask: (task: any) => void;
}

const StudentProjectSelector: React.FC<StudentProjectSelectorProps> = ({
  selectedCourse,
  selectedGroup,
  selectedStudent,
  selectedProject,
  courses,
  groups,
  students,
  studentProjects,
  showTaskForm,
  setShowTaskForm,
  onCourseChange,
  onGroupChange,
  onStudentChange,
  onProjectChange,
  onAddTask
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ընտրեք ուսանող և նախագիծ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="course">Կուրս</Label>
            <Select value={selectedCourse} onValueChange={onCourseChange}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Ընտրեք կուրսը" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="group">Խումբ</Label>
            <Select 
              value={selectedGroup} 
              onValueChange={onGroupChange}
              disabled={!selectedCourse}
            >
              <SelectTrigger id="group">
                <SelectValue placeholder="Ընտրեք խումբը" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="student">Ուսանող</Label>
            <Select 
              value={selectedStudent} 
              onValueChange={onStudentChange}
              disabled={!selectedGroup}
            >
              <SelectTrigger id="student">
                <SelectValue placeholder="Ընտրեք ուսանողին" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project">Նախագիծ</Label>
            <Select 
              value={selectedProject} 
              onValueChange={onProjectChange}
              disabled={!selectedStudent || studentProjects.length === 0}
            >
              <SelectTrigger id="project">
                <SelectValue placeholder="Ընտրեք նախագիծը" />
              </SelectTrigger>
              <SelectContent>
                {studentProjects.map(project => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedProject && (
          <div className="flex justify-end">
            <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus size={16} /> Ավելացնել առաջադրանք
                </Button>
              </DialogTrigger>
              <TaskForm 
                onSubmit={onAddTask}
                onClose={() => setShowTaskForm(false)}
                currentUserId={selectedStudent}
                students={[...students.filter(s => s.id === selectedStudent)]}
              />
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProjectSelector;
