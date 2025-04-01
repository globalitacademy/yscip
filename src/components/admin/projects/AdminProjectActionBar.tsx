
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileSpreadsheet, Grid3X3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminProjectActionBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  categories: string[];
  onAddNewProject: () => void;
  viewMode: 'grid' | 'table';
  setViewMode: (mode: 'grid' | 'table') => void;
}

const AdminProjectActionBar: React.FC<AdminProjectActionBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onAddNewProject,
  viewMode,
  setViewMode
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Որոնել ըստ վերնագրի..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select 
          value={selectedCategory || 'all'} 
          onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
        >
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Բոլոր կատեգորիաները" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Բոլոր կատեգորիաները</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="bg-slate-100 p-1 rounded-md flex">
          <Button
            variant={viewMode === 'grid' ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 size={16} />
          </Button>
          <Button
            variant={viewMode === 'table' ? "default" : "ghost"}
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setViewMode('table')}
          >
            <FileSpreadsheet size={16} />
          </Button>
        </div>
        
        <Button onClick={onAddNewProject} className="ml-2">
          <Plus className="h-4 w-4 mr-2" /> Նոր նախագիծ
        </Button>
      </div>
    </div>
  );
};

export default AdminProjectActionBar;
