
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Theme } from '../hooks/useThemeManagement';

interface ThemeTableProps {
  themes: Theme[];
  onEditClick: (theme: Theme) => void;
  onDeleteClick: (theme: Theme) => void;
}

const ThemeTable: React.FC<ThemeTableProps> = ({ themes, onEditClick, onDeleteClick }) => {
  if (themes.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Թեմաներ չեն գտնվել</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Վերնագիր</TableHead>
            <TableHead>Ամփոփում</TableHead>
            <TableHead>Կատեգորիա</TableHead>
            <TableHead>Կարգավիճակ</TableHead>
            <TableHead className="text-right">Գործողություններ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {themes.map(theme => (
            <TableRow key={theme.id}>
              <TableCell className="font-medium">{theme.title}</TableCell>
              <TableCell className="max-w-md truncate">{theme.summary}</TableCell>
              <TableCell>{theme.category || 'Անկատեգորիա'}</TableCell>
              <TableCell>
                {theme.is_published ? (
                  <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                    Հրապարակված
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                    Սևագիր
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEditClick(theme)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDeleteClick(theme)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href={`/themes/${theme.id}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ThemeTable;
