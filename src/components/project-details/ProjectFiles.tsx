
import React, { useState } from 'react';
import { 
  FileText, 
  FileImage, 
  FilePlus, 
  Download, 
  Trash2,
  File,
  FileArchive,
  FileCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ProjectFilesProps {
  projectId: number;
  isEditing?: boolean;
}

const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'image':
      return <FileImage className="text-blue-500" />;
    case 'document':
      return <FileText className="text-green-500" />;
    case 'code':
      return <FileCode className="text-amber-500" />;
    case 'archive':
      return <FileArchive className="text-purple-500" />;
    default:
      return <File className="text-gray-500" />;
  }
};

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId, isEditing = false }) => {
  // Mock files data
  const [files, setFiles] = useState([
    { id: '1', name: 'project_documentation.docx', type: 'document', size: '245 KB', uploadedBy: 'Արամ Հակոբյան', uploadDate: '2024-04-05' },
    { id: '2', name: 'design_mockup.png', type: 'image', size: '1.2 MB', uploadedBy: 'Գագիկ Պետրոսյան', uploadDate: '2024-04-08' },
    { id: '3', name: 'source_code.zip', type: 'archive', size: '3.7 MB', uploadedBy: 'Գագիկ Պետրոսյան', uploadDate: '2024-04-10' },
    { id: '4', name: 'api_documentation.js', type: 'code', size: '128 KB', uploadedBy: 'Արամ Հակոբյան', uploadDate: '2024-04-12' },
  ]);
  
  const [fileInput, setFileInput] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileInput(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (!fileInput) return;
    
    // Mock file upload
    const newFile = {
      id: `${files.length + 1}`,
      name: fileInput.name,
      type: getFileType(fileInput.name),
      size: formatFileSize(fileInput.size),
      uploadedBy: 'Ընթացիկ օգտատեր',
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setFiles([...files, newFile]);
    setFileInput(null);
    
    // Reset file input
    const fileInputElement = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInputElement) fileInputElement.value = '';
  };
  
  const handleDelete = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };
  
  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
      return 'image';
    } else if (['doc', 'docx', 'pdf', 'txt'].includes(extension)) {
      return 'document';
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return 'archive';
    } else if (['js', 'ts', 'html', 'css', 'py', 'java', 'cpp', 'c', 'go', 'php'].includes(extension)) {
      return 'code';
    } else {
      return 'other';
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Նախագծի ֆայլեր</h2>
        
        {!isEditing && (
          <div className="flex items-center gap-3">
            <Input 
              type="file" 
              id="file-upload" 
              className="max-w-56"
              onChange={handleFileChange}
            />
            <Button 
              onClick={handleUpload}
              disabled={!fileInput}
              className="flex items-center gap-1.5"
            >
              <FilePlus size={16} />
              Ներբեռնել
            </Button>
          </div>
        )}
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-md">
          <p className="text-muted-foreground">Այս նախագծի համար ֆայլեր չկան</p>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <div 
              key={file.id} 
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md border border-border/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <FileIcon type={file.type} />
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>Ներբեռնել է {file.uploadedBy}</span>
                    <span>•</span>
                    <span>{file.uploadDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Download size={16} />
                </Button>
                
                {!isEditing && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-red-500" 
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;
