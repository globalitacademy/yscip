
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, ArrowUpDown, PlusCircle } from 'lucide-react';

interface ProjectSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-start">
        <h1 className="text-2xl md:text-3xl font-bold">Նախագծերի կառավարում</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Որոնել նախագծեր..."
            className="pl-8 w-full sm:w-[200px] md:w-[300px]"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" title="Ֆիլտրել">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="Դասավորել">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button className="whitespace-nowrap">
            <PlusCircle className="mr-2 h-4 w-4" />
            Նոր նախագիծ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSearch;
