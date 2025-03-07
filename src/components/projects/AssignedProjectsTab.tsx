
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { ProjectTheme } from '@/data/projectThemes';

interface Assignment {
  id: string;
  projectId: number;
  studentId: string;
  assignedBy: string;
  studentName: string;
  studentCourse?: string;
  studentGroup?: string;
}

interface AssignedProjectsTabProps {
  assignments: Assignment[];
  userId: string;
  allProjects: ProjectTheme[];
}

const AssignedProjectsTab: React.FC<AssignedProjectsTabProps> = ({ assignments, userId, allProjects }) => {
  const userAssignments = assignments.filter(a => a.assignedBy === userId);

  if (userAssignments.length === 0) {
    return (
      <div className="text-center p-10 bg-muted rounded-lg">
        <p className="text-muted-foreground">Դեռևս նշանակված նախագծեր չկան</p>
        <Link to="/admin" className="text-primary font-medium mt-2 inline-block">
          Նշանակել նախագիծ
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userAssignments.map((assignment) => {
        const project = allProjects.find(p => Number(p.id) === Number(assignment.projectId));
        
        return project ? (
          <Card key={assignment.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{project.title}</h3>
              <Badge variant="outline" className="bg-orange-100 text-orange-700">
                <Check size={14} className="mr-1" /> Նշանակված
              </Badge>
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <p className="text-sm text-muted-foreground">
                <strong>Ուսանող:</strong> {assignment.studentName}
              </p>
              {assignment.studentCourse && assignment.studentGroup && (
                <p className="text-sm text-muted-foreground">
                  <strong>Կուրս/Խումբ:</strong> {assignment.studentCourse}-րդ կուրս, {assignment.studentGroup}
                </p>
              )}
            </div>
            
            <div className="flex items-center justify-end mt-4">
              <Link to={`/project/${assignment.projectId}`} className="text-primary text-sm font-medium">
                Դիտել մանրամասներ
              </Link>
            </div>
          </Card>
        ) : null;
      }).filter(Boolean)}
    </div>
  );
};

export default AssignedProjectsTab;
