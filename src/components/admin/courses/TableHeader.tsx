
import React from 'react';
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TableHeader: React.FC = () => {
  return (
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
  );
};
