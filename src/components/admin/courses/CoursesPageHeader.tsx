
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';

interface CoursesPageHeaderProps {
  courseCount: number;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export const CoursesPageHeader: React.FC<CoursesPageHeaderProps> = ({
  courseCount,
  searchQuery = '',
  onSearchChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">Դասընթացներ</h1>
        <p className="text-muted-foreground">
          {courseCount} դասընթաց համակարգում
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {onSearchChange && (
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Որոնել դասընթացներ..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        )}
        <Button asChild>
          <Link to="/courses/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Նոր դասընթաց
          </Link>
        </Button>
      </div>
    </div>
  );
};
