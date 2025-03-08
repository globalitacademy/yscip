
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Edit, Trash, Image, PlusCircle, Search, Filter, ArrowUpDown } from 'lucide-react';
import { projectThemes } from '@/data/projectThemes';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState(projectThemes);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete project
  const handleDelete = () => {
    if (!selectedProject) return;
    
    const updatedProjects = projects.filter(project => project.id !== selectedProject.id);
    setProjects(updatedProjects);
    setIsDeleteDialogOpen(false);
    toast.success(`"${selectedProject.title}" նախագիծը հաջողությամբ ջնջվել է`);
    setSelectedProject(null);
  };

  // Handle change project image
  const handleChangeImage = () => {
    if (!selectedProject || !newImageUrl.trim()) return;
    
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return { ...project, image: newImageUrl.trim() };
      }
      return project;
    });
    
    setProjects(updatedProjects);
    setIsImageDialogOpen(false);
    setNewImageUrl('');
    toast.success(`"${selectedProject.title}" նախագծի նկարը հաջողությամբ թարմացվել է`);
    setSelectedProject(null);
  };

  return (
    <div className="space-y-4">
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
              onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 sm:h-48 bg-gray-100 relative">
              <img 
                src={project.image || 'https://via.placeholder.com/640x360?text=Նախագծի+նկար'} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-white/80 hover:bg-white"
                  onClick={() => {
                    setSelectedProject(project);
                    setNewImageUrl(project.image || '');
                    setIsImageDialogOpen(true);
                  }}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="bg-white/80 hover:bg-red-500 text-red-500 hover:text-white"
                  onClick={() => {
                    setSelectedProject(project);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-4 pb-0">
              <CardTitle className="line-clamp-1 text-base sm:text-lg">{project.title}</CardTitle>
              <CardDescription>{project.category}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-3 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.techStack.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.techStack.length - 3}
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="text-xs">
                  <Edit className="mr-1 h-3 w-3" />
                  Խմբագրել
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Նախագծեր չեն գտնվել</p>
          <Button className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ավելացնել նոր նախագիծ
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Նախագծի հեռացում</DialogTitle>
            <DialogDescription>
              Դուք իսկապե՞ս ցանկանում եք հեռացնել "{selectedProject?.title}" նախագիծը։ 
              Այս գործողությունը չի կարող հետ շրջվել։
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="w-full sm:w-auto">Չեղարկել</Button>
            <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">Հեռացնել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Նախագծի նկարի փոփոխում</DialogTitle>
            <DialogDescription>
              Մուտքագրեք նոր նկարի URL-ը "{selectedProject?.title}" նախագծի համար։
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="image-url" className="text-sm font-medium">Նկարի URL</label>
              <Input
                id="image-url"
                placeholder="Օրինակ՝ https://example.com/image.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
            </div>
            {newImageUrl && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Նախադիտում</p>
                <div className="h-48 bg-gray-100 rounded-md overflow-hidden">
                  <img 
                    src={newImageUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Handle image load error
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=Սխալ+նկար';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)} className="w-full sm:w-auto">Չեղարկել</Button>
            <Button onClick={handleChangeImage} className="w-full sm:w-auto">Պահպանել</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectManagement;
