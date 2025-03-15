
import React, { useState } from 'react';
import { User } from '@/data/userRoles';
import { Task } from '@/data/projectThemes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  onClose: () => void;
  currentUserId: string;
  students: User[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onClose,
  currentUserId,
  students
}) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as const,
    assignedTo: currentUserId || '',
    dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...newTask,
      createdBy: currentUserId,
    });
    onClose();
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Նոր առաջադրանք</DialogTitle>
        <DialogDescription>
          Ավելացրեք նոր առաջադրանք պրոեկտի համար։
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Վերնագիր</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Նկարագրություն</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Կարգավիճակ</Label>
            <Select 
              onValueChange={(value) => setNewTask({ ...newTask, status: value as any })}
              defaultValue={newTask.status}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Ընտրեք կարգավիճակը" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Անելիք</SelectItem>
                <SelectItem value="in-progress">Ընթացքի մեջ</SelectItem>
                <SelectItem value="review">Վերանայման</SelectItem>
                <SelectItem value="done">Ավարտված</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Վերջնաժամկետ</Label>
            <Input
              id="dueDate"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Նշանակված ուսանող</Label>
            <Select 
              onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              defaultValue={currentUserId || newTask.assignedTo}
            >
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Ընտրեք ուսանող" />
              </SelectTrigger>
              <SelectContent>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id} className="flex items-center gap-2">
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
        </div>
        <DialogFooter>
          <Button type="submit">Ավելացնել</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default TaskForm;
