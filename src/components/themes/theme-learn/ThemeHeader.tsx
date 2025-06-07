
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen } from 'lucide-react';
import { Theme } from '../hooks/useThemeDetail';

interface ThemeHeaderProps {
  theme: Theme;
  moduleId?: number;
  moduleTitle?: string | null;
}

const ThemeHeader: React.FC<ThemeHeaderProps> = ({ theme, moduleId, moduleTitle }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{theme.title}</h1>
          {theme.category && (
            <Badge variant="secondary" className="mb-2">
              {theme.category}
            </Badge>
          )}
          {moduleTitle && (
            <Link to={`/module/${moduleId}`} className="text-sm text-primary hover:underline block">
              {moduleTitle}
            </Link>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button asChild>
            <Link to={`/themes/${theme.id}/learn`} className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Սկսել ուսումը
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/themes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Բոլոր թեմաները
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeHeader;
