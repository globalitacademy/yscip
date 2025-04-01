
import React from 'react';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CourseActions } from './CourseActions';

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
    return (
      <div className="bg-muted p-8 text-center rounded-md">
        <p className="text-muted-foreground">Դասընթացներ չկան: Ստեղծեք ձեր առաջին դասընթացը:</p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Վերնագիր</TableHead>
            <TableHead>Ստեղծողը</TableHead>
            <TableHead>Տևողություն</TableHead>
            <TableHead>Արժեք</TableHead>
            <TableHead>Կարգավիճակ</TableHead>
            <TableHead className="text-right">Գործողություններ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
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
              <TableCell className="text-right">
                <CourseActions 
                  course={course} 
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
