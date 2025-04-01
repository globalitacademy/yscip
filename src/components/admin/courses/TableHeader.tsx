
import React from 'react';
import {
  TableHead,
  TableHeader as UITableHeader,
  TableRow,
} from "@/components/ui/table";

export const CourseTableHeader: React.FC = () => {
  return (
    <UITableHeader>
      <TableRow>
        <TableHead>Վերնագիր</TableHead>
        <TableHead>Ստեղծողը</TableHead>
        <TableHead>Տևողություն</TableHead>
        <TableHead>Արժեք</TableHead>
        <TableHead>Կարգավիճակ</TableHead>
        <TableHead className="text-right">Գործողություններ</TableHead>
      </TableRow>
    </UITableHeader>
  );
};
