
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  File, 
  FileText, 
  FileImage, 
  FilePdf, 
  Download, 
  Upload, 
  Trash2, 
  Plus,
  MoreVertical
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { rolePermissions, getCurrentUser } from '@/data/userRoles';

interface ProjectFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'text' | 'other';
  size: number; // in bytes
  uploadedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  uploadedAt: Date;
  description?: string;
  url: string;
}

interface ProjectFilesProps {
  projectId: number;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: '1',
      name: 'Նախագծի տեխնիկական առաջադրանք.pdf',
      type: 'pdf',
      size: 1240000,
      uploadedBy: {
        id: 'supervisor1',
        name: 'Արամ Հակոբյան',
        avatar: '/placeholder.svg'
      },
      uploadedAt: new Date(2023, 5, 10),
      description: 'Նախագծի տեխնիկական առաջադրանքը և պահանջների ցանկը',
      url: '#'
    },
    {
      id: '2',
      name: 'ER դիագրամ.png',
      type: 'image',
      size: 580000,
      uploadedBy: {
        id: 'student1',
        name: 'Գագիկ Պետրոսյան',
        avatar: '/placeholder.svg'
      },
      uploadedAt: new Date(2023, 5, 12),
      description: 'Տվյալների բազայի ER դիագրամ',
      url: '#'
    }
  ]);
  
  const [newFile, setNewFile] = useState<{
    name: string;
    file: File | null;
    description: string;
  }>({
    name: '',
    file: null,
    description: ''
  });
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const currentUser = getCurrentUser();
  const permissions = rolePermissions[currentUser.role];
  
  const canUploadFiles = permissions.canCreateProjects || 
    permissions.canApproveProject || 
    currentUser.role === 'instructor' || 
    currentUser.role === 'lecturer';
  
  const getFileIcon = (type: ProjectFile['type'], size = 20) => {
    switch (type) {
      case 'pdf':
        return <FilePdf size={size} className="text-red-500" />;
      case 'image':
        return <FileImage size={size} className="text-blue-500" />;
      case 'text':
        return <FileText size={size} className="text-yellow-500" />;
      default:
        return <File size={size} className="text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFile({
        ...newFile,
        file,
        name: file.name
      });
    }
  };
  
  const handleUploadFile = () => {
    if (!newFile.file) return;
    
    // Determine file type
    let fileType: ProjectFile['type'] = 'other';
    if (newFile.file.type.includes('pdf')) fileType = 'pdf';
    else if (newFile.file.type.includes('image')) fileType = 'image';
    else if (newFile.file.type.includes('text')) fileType = 'text';
    
    const uploadedFile: ProjectFile = {
      id: uuidv4(),
      name: newFile.name,
      type: fileType,
      size: newFile.file.size,
      uploadedBy: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar
      },
      uploadedAt: new Date(),
      description: newFile.description,
      url: URL.createObjectURL(newFile.file) // Create a temporary URL for the file
    };
    
    setFiles([uploadedFile, ...files]);
    setNewFile({
      name: '',
      file: null,
      description: ''
    });
    setDialogOpen(false);
    toast({
      title: "Ֆայլը վերբեռնված է",
      description: "Ֆայլը հաջողությամբ վերբեռնվել է։",
    });
  };
  
  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
    toast({
      title: "Ֆայլը ջնջված է",
      description: "Ֆայլը հաջողությամբ ջնջվել է։",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Նախագծի փաստաթղթեր</h3>
        {canUploadFiles && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Upload size={16} /> Վերբեռնել ֆայլ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Վերբեռնել նոր ֆայլ</DialogTitle>
                <DialogDescription>
                  Վերբեռնեք նախագծի հետ կապված փաստաթուղթ կամ նյութ։
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="file">Ֆայլ</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Ֆայլի անվանում</Label>
                  <Input
                    id="name"
                    value={newFile.name}
                    onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                    placeholder="Մուտքագրեք ֆայլի անվանումը"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Նկարագրություն (ըստ ցանկության)</Label>
                  <Input
                    id="description"
                    value={newFile.description}
                    onChange={(e) => setNewFile({ ...newFile, description: e.target.value })}
                    placeholder="Կարճ նկարագրություն ֆայլի մասին"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUploadFile} disabled={!newFile.file}>Վերբեռնել</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {files.length === 0 ? (
        <Card className="p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Ֆայլեր չկան</h3>
          <p className="mt-2 text-sm text-muted-foreground">Նախագծի համար դեռևս ֆայլեր չեն վերբեռնվել։</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {files.map(file => (
            <Card key={file.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-accent rounded-md p-3">
                  {getFileIcon(file.type, 24)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium truncate">{file.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatFileSize(file.size)} • {format(new Date(file.uploadedAt), 'dd MMM yyyy, HH:mm')}
                      </p>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={file.url} download={file.name}>
                          <Download size={16} />
                        </a>
                      </Button>
                      
                      {file.uploadedBy.id === currentUser.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteFile(file.id)}
                            >
                              <Trash2 size={14} className="mr-2" /> Ջնջել
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  
                  {file.description && (
                    <p className="text-sm mt-2">{file.description}</p>
                  )}
                  
                  <div className="flex items-center mt-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={file.uploadedBy.avatar} alt={file.uploadedBy.name} />
                        <AvatarFallback>{file.uploadedBy.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{file.uploadedBy.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;
