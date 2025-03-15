
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import TaskManager from '@/components/tasks/TaskManager';
import { ClipboardList } from 'lucide-react';
import SupervisorEmptyState from '@/components/supervisor/SupervisorEmptyState';
import StudentProjectSelector from '@/components/tasks/StudentProjectSelector';
import { useTasksPageLogic } from '@/hooks/useTasksPageLogic';

const TasksPage: React.FC = () => {
  const {
    tasks,
    selectedCourse,
    selectedGroup,
    selectedStudent,
    selectedProject,
    showTaskForm,
    setShowTaskForm,
    studentProjects,
    courses,
    groups,
    students,
    handleCourseChange,
    handleGroupChange,
    handleStudentChange,
    handleProjectChange,
    handleAddTask,
    handleUpdateTaskStatus
  } = useTasksPageLogic();

  return (
    <AdminLayout pageTitle="Առաջադրանքների կառավարում">
      <div className="space-y-6">
        <StudentProjectSelector
          selectedCourse={selectedCourse}
          selectedGroup={selectedGroup}
          selectedStudent={selectedStudent}
          selectedProject={selectedProject}
          courses={courses}
          groups={groups}
          students={students}
          studentProjects={studentProjects}
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          onCourseChange={handleCourseChange}
          onGroupChange={handleGroupChange}
          onStudentChange={handleStudentChange}
          onProjectChange={handleProjectChange}
          onAddTask={handleAddTask}
        />

        {selectedProject ? (
          <TaskManager 
            tasks={tasks} 
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        ) : (
          <SupervisorEmptyState 
            icon={<ClipboardList className="h-12 w-12" />}
            title="Ընտրեք ուսանող և նախագիծ"
            description="Առաջադրանքները տեսնելու համար նախ ընտրեք կուրսը, խումբը, ուսանողին և նախագիծը։"
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default TasksPage;
