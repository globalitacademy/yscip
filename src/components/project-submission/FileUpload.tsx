
import React from 'react';
import { Upload, HardDrive, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, onFileChange, onRemoveFile }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="files">Կցել ֆայլեր</Label>
      <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <p className="text-sm text-muted-foreground mb-2">Քաշեք ֆայլերը այստեղ կամ սեղմեք ֆայլ ընտրելու համար</p>
        <p className="text-xs text-muted-foreground mb-4">Առավելագույնը 10 MB, .pdf, .docx, .zip, .rar, .ppt</p>
        <Input
          id="files"
          type="file"
          multiple
          className="hidden"
          onChange={onFileChange}
          accept=".pdf,.docx,.pptx,.zip,.rar"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('files')?.click()}
        >
          Ընտրել ֆայլեր
        </Button>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Կցված ֆայլեր ({files.length})</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
