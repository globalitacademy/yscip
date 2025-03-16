
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

export interface Specialization {
  id: string;
  name: string;
  description: string;
  created_at?: string;
}

interface SpecializationTableProps {
  specializations: Specialization[];
  onEditSpecialization: (id: string) => void;
  onDeleteSpecialization: (id: string) => void;
  openEditSpecialization: string | null;
}

export const SpecializationTable: React.FC<SpecializationTableProps> = ({
  specializations,
  onEditSpecialization,
  onDeleteSpecialization
}) => {
  return (
    <Table>
      <TableCaption>Բոլոր մասնագիտացումները</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Անվանում</TableHead>
          <TableHead>Նկարագրություն</TableHead>
          <TableHead className="text-right">Գործողություններ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specializations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
              Մասնագիտացումներ չեն գտնվել
            </TableCell>
          </TableRow>
        ) : (
          specializations.map((specialization) => (
            <TableRow key={specialization.id}>
              <TableCell className="font-medium">{specialization.name}</TableCell>
              <TableCell>{specialization.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditSpecialization(specialization.id)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Խմբագրել
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDeleteSpecialization(specialization.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" /> Ջնջել
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
