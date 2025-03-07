
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Upload, 
  Search, 
  File,
  FilePlus,
  PlusCircle,
  Filter,
  SortAsc
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  uploadDate: string;
  downloadUrl: string;
  category: 'documentation' | 'result' | 'reference' | 'other';
}

interface ProjectFilesProps {
  projectId: number;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const { user } = useAuth();
  
  // Mock file data
  const files: ProjectFile[] = [
    {
      id: "file1",
      name: "Տեխնիկական առաջադրանք.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedBy: { id: "supervisor1", name: "Արամ Հակոբյան", role: "ղեկավար" },
      uploadDate: "2023-09-15",
      downloadUrl: "#",
      category: 'documentation'
    },
    {
      id: "file2",
      name: "Նախագծի պլան.docx",
      type: "DOCX",
      size: "1.8 MB",
      uploadedBy: { id: "student1", name: "Գագիկ Պետրոսյան", role: "ուսանող" },
      uploadDate: "2023-09-20",
      downloadUrl: "#",
      category: 'documentation'
    },
    {
      id: "file3",
      name: "Դիագրամներ.png",
      type: "PNG",
      size: "3.5 MB",
      uploadedBy: { id: "supervisor1", name: "Արամ Հակոբյան", role: "ղեկավար" },
      uploadDate: "2023-09-25",
      downloadUrl: "#",
      category: 'result'
    },
    {
      id: "file4",
      name: "Օգտագործողի ձեռնարկ.pdf",
      type: "PDF",
      size: "5.2 MB",
      uploadedBy: { id: "supervisor1", name: "Արամ Հակոբյան", role: "ղեկավար" },
      uploadDate: "2023-10-05",
      downloadUrl: "#",
      category: 'reference'
    },
    {
      id: "file5",
      name: "Կոդի վերլուծության արդյունքներ.xlsx",
      type: "XLSX",
      size: "1.1 MB",
      uploadedBy: { id: "student1", name: "Գագիկ Պետրոսյան", role: "ուսանող" },
      uploadDate: "2023-10-12",
      downloadUrl: "#",
      category: 'result'
    }
  ];
  
  // Filter files by search query and category
  const filteredFiles = files.filter(file => {
    const matchesSearch = 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.uploadedBy.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeTab === 'all' || file.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText size={18} className="text-red-500" />;
      case 'docx': 
      case 'doc': return <FileText size={18} className="text-blue-500" />;
      case 'xlsx':
      case 'xls': return <FileText size={18} className="text-green-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg': return <File size={18} className="text-purple-500" />;
      default: return <File size={18} className="text-gray-500" />;
    }
  };

  // Check if user can upload files (supervisor or teacher)
  const canUploadFiles = user?.role === 'supervisor' || 
                         user?.role === 'lecturer' || 
                         user?.role === 'instructor' || 
                         user?.role === 'admin';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" /> 
              Նախագծի ֆայլեր
            </CardTitle>
            {canUploadFiles && (
              <Button className="gap-2">
                <Upload size={16} />
                Ավելացնել ֆայլ
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  placeholder="Որոնել ֆայլեր..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter size={16} /> Ֆիլտրել
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Բոլոր ֆայլերը</DropdownMenuItem>
                    <DropdownMenuItem>Իմ վերբեռնած ֆայլերը</DropdownMenuItem>
                    <DropdownMenuItem>Վերջին շաբաթվա ֆայլերը</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <SortAsc size={16} /> Դասավորել
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Ըստ անվանման ↑</DropdownMenuItem>
                    <DropdownMenuItem>Ըստ անվանման ↓</DropdownMenuItem>
                    <DropdownMenuItem>Ըստ ամսաթվի (նորը առաջինը)</DropdownMenuItem>
                    <DropdownMenuItem>Ըստ ամսաթվի (հինը առաջինը)</DropdownMenuItem>
                    <DropdownMenuItem>Ըստ չափի (մեծը առաջինը)</DropdownMenuItem>
                    <DropdownMenuItem>Ըստ չափի (փոքրը առաջինը)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="all">Բոլորը</TabsTrigger>
                <TabsTrigger value="documentation">Փաստաթղթեր</TabsTrigger>
                <TabsTrigger value="result">Արդյունքներ</TabsTrigger>
                <TabsTrigger value="reference">Հղումներ</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Անվանում</TableHead>
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
                          {getFileIcon(file.type)}
                          <div>
                            <div>{file.name}</div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {file.category === 'documentation' ? 'Փաստաթուղթ' : 
                               file.category === 'result' ? 'Արդյունք' : 
                               file.category === 'reference' ? 'Հղում' : 'Այլ'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{file.type}</TableCell>
                        <TableCell>{file.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{file.uploadedBy.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {file.uploadedBy.role}
                            </Badge>
                          </div>
                        </TableCell>
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
                        <div className="flex flex-col items-center py-8">
                          <FileText size={48} className="text-muted-foreground/50 mb-4" />
                          <p>Ֆայլեր չեն գտնվել</p>
                          {canUploadFiles && (
                            <Button variant="outline" size="sm" className="mt-4 gap-1">
                              <PlusCircle size={16} /> Ավելացնել առաջին ֆայլը
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-4 flex gap-2 items-center">
              <FileText size={20} className="text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p>Պրոեկտի ֆայլերը տեսանելի են բոլոր մասնակիցներին։</p>
                <p className="mt-1">Ֆայլերի առավելագույն չափը՝ 20MB։ Թույլատրելի ֆորմատներ՝ PDF, DOCX, XLSX, PNG, JPG, ZIP։</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectFiles;
