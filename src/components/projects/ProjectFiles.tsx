
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Upload, Search, File } from 'lucide-react';

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  downloadUrl: string;
}

interface ProjectFilesProps {
  projectId: number;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock file data
  const files: ProjectFile[] = [
    {
      id: "file1",
      name: "Տեխնիկական առաջադրանք.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: "Արամ Հակոբյան",
      uploadDate: "2023-09-15",
      downloadUrl: "#"
    },
    {
      id: "file2",
      name: "Նախագծի պլան.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadedBy: "Գագիկ Պետրոսյան",
      uploadDate: "2023-09-20",
      downloadUrl: "#"
    },
    {
      id: "file3",
      name: "Դիագրամներ.png",
      type: "PNG",
      size: "3.5 MB",
      uploadedBy: "Արամ Հակոբյան",
      uploadDate: "2023-09-25",
      downloadUrl: "#"
    }
  ];
  
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Նախագծի ֆայլեր</h2>
        <Button className="gap-2">
          <Upload size={16} />
          Ավելացնել ֆայլ
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input 
          placeholder="Որոնել ֆայլեր..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Անվանում</TableHead>
              <TableHead>Տեսակ</TableHead>
              <TableHead>Չափս</TableHead>
              <TableHead>Վերբեռնել է</TableHead>
              <TableHead>Ամսաթիվ</TableHead>
              <TableHead className="text-right">Գործողություններ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map(file => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <File size={18} className="text-primary" />
                    {file.name}
                  </TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.uploadedBy}</TableCell>
                  <TableCell>{file.uploadDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={file.downloadUrl} download={file.name}>
                        <Download size={16} className="mr-1" /> Ներբեռնել
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Ֆայլեր չեն գտնվել
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-muted/40 rounded-lg p-4 flex gap-2 items-center">
        <FileText size={20} className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Պրոեկտի ֆայլերը տեսանելի են բոլոր մասնակիցներին։ Ֆայլերի առավելագույն չափը՝ 20MB։
        </p>
      </div>
    </div>
  );
};

export default ProjectFiles;
