
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Upload, Trash2, File, Code, Image, PlusCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ProjectFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'code' | 'other';
  size: number;
  uploadedBy: string;
  uploadDate: string;
  url: string;
}

interface ProjectFilesProps {
  projectId: number;
  isEditing: boolean;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({
  projectId,
  isEditing
}) => {
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: '1',
      name: 'Պրոեկտի_նկարագրություն.docx',
      type: 'document',
      size: 1024 * 25, // 25 KB
      uploadedBy: 'Արամ Հակոբյան',
      uploadDate: '2023-05-10T09:30:00Z',
      url: '#',
    },
    {
      id: '2',
      name: 'նախագիծ_wireframe.png',
      type: 'image',
      size: 1024 * 450, // 450 KB
      uploadedBy: 'Գագիկ Պետրոսյան',
      uploadDate: '2023-05-12T14:15:00Z',
      url: '#',
    },
    {
      id: '3',
      name: 'api_client.js',
      type: 'code',
      size: 1024 * 8, // 8 KB
      uploadedBy: 'Գագիկ Պետրոսյան',
      uploadDate: '2023-05-14T11:45:00Z',
      url: '#',
    },
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const uploadedFiles: ProjectFile[] = Array.from(fileList).map(file => {
        // Determine file type
        let type: ProjectFile['type'] = 'other';
        if (file.type.includes('image')) type = 'image';
        else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.pdf')) type = 'document';
        else if (file.name.endsWith('.js') || file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.ts') || file.name.endsWith('.jsx') || file.name.endsWith('.tsx')) type = 'code';
        
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type,
          size: file.size,
          uploadedBy: 'Ընթացիկ օգտատեր', // Should be replaced with actual user name
          uploadDate: new Date().toISOString(),
          url: '#',
        };
      });
      
      setFiles([...files, ...uploadedFiles]);
      setIsUploading(false);
      
      // Reset the input
      e.target.value = '';
    }, 1500);
  };
  
  const handleDeleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };
  
  const getFileIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'code':
        return <Code className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Ֆայլեր
        </CardTitle>
        
        {isEditing && (
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 opacity-0 w-full cursor-pointer"
              onChange={handleFileUpload}
              multiple
              disabled={isUploading}
            />
            <Button size="sm" disabled={isUploading}>
              {isUploading ? (
                <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Բեռնվում է...</>
              ) : (
                <><Upload className="h-4 w-4 mr-1.5" /> Բեռնել ֆայլ</>
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file) => (
              <div 
                key={file.id}
                className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <h4 className="font-medium">{file.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{format(new Date(file.uploadDate), 'dd.MM.yyyy')}</span>
                      <span>•</span>
                      <span>{file.uploadedBy}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={file.url} download>
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </a>
                  </Button>
                  
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Ֆայլեր չկան</h3>
            <p className="text-muted-foreground mb-6">Դեռևս ոչ մի ֆայլ չի բեռնվել այս նախագծի համար</p>
            
            {isEditing && (
              <div className="relative">
                <input
                  type="file"
                  id="file-upload-empty"
                  className="absolute inset-0 opacity-0 w-full cursor-pointer"
                  onChange={handleFileUpload}
                  multiple
                  disabled={isUploading}
                />
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Բեռնել ֆայլեր
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectFiles;
