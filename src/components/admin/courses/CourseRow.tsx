
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Badge } from '@/components/ui/badge';
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { CourseActions } from './CourseActions';

interface CourseRowProps {
  course: ProfessionalCourse;
  onStatusChange: (updatedCourse: ProfessionalCourse) => void;
  onDelete: (courseId: string) => void;
}

export const CourseRow: React.FC<CourseRowProps> = ({
  course,
  onStatusChange,
  onDelete,
}) => {
  return (
    <TableRow key={course.id}>
      <TableCell className="font-medium">{course.title}</TableCell>
      <TableCell>{course.createdBy || 'Անհայտ'}</TableCell>
      <TableCell>{course.duration}</TableCell>
      <TableCell>{course.price}</TableCell>
      <TableCell>
        <Badge variant={course.is_public ? "success" : "secondary"}>
          {course.is_public ? 'Հրապարակված' : 'Թաքցված'}
        </Badge>
      </TableCell>
      <TableCell>
        <CourseActions 
          course={course} 
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
