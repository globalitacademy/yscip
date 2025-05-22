
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { Theme } from '../hooks/useThemeDetail';

interface ThemeHeaderProps {
  theme: Theme;
  moduleId?: number;
  moduleTitle: string | null;
}

const ThemeHeader: React.FC<ThemeHeaderProps> = ({ theme, moduleId, moduleTitle }) => {
  return (
    <>
      {moduleId && moduleTitle && (
        <div className="mb-2">
          <Badge variant="outline" className="flex items-center gap-1 max-w-fit">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            <Link to={`/module/${moduleId}`}>{moduleTitle}</Link>
          </Badge>
        </div>
      )}
      
      <h1 className="text-3xl md:text-4xl font-bold">{theme.title}</h1>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        {theme.created_at && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(theme.created_at), 'dd.MM.yyyy')}</span>
          </div>
        )}
        {theme.category && (
          <Badge variant="secondary">{theme.category}</Badge>
        )}
      </div>
    </>
  );
};

export default ThemeHeader;
