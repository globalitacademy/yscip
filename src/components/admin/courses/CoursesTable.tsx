
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { TableHeader } from './TableHeader';
import { CourseRow } from './CourseRow';
import { EmptyState } from './EmptyState';

interface CoursesTableProps {
  courses: ProfessionalCourse[];
  onStatusChange: (updatedCourse: ProfessionalCourse) => void;
  onDelete: (courseId: string) => void;
}

export const CoursesTable: React.FC<CoursesTableProps> = ({
  courses,
  onStatusChange,
  onDelete,
}) => {
  if (courses.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader />
        <TableBody>
          {courses.map((course) => (
            <CourseRow 
              key={course.id}
              course={course}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
