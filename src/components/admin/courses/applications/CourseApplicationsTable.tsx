
import React from 'react';
import { CourseApplication } from '@/components/courses/types/CourseApplication';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Mail, Phone } from 'lucide-react';

interface CourseApplicationsTableProps {
  applications: CourseApplication[];
  isLoading: boolean;
}

export const CourseApplicationsTable: React.FC<CourseApplicationsTableProps> = ({ 
  applications, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">Դեռևս դիմումներ չկան</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Նոր</Badge>;
      case 'contacted':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Կապ հաստատված</Badge>;
      case 'enrolled':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Գրանցված</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Մերժված</Badge>;
      default:
        return <Badge variant="outline">Անհայտ</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ամսաթիվ</TableHead>
          <TableHead>Անուն</TableHead>
          <TableHead>Դասընթաց</TableHead>
          <TableHead>Կոնտակտներ</TableHead>
          <TableHead>Կարգավիճակ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.slice(0, 5).map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium">
              {new Date(application.created_at).toLocaleDateString('hy-AM')}
            </TableCell>
            <TableCell>{application.full_name}</TableCell>
            <TableCell>{application.course_title}</TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span className="text-sm">{application.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span className="text-sm">{application.phone_number}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>{getStatusBadge(application.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
