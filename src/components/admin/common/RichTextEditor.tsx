
import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Heading, Quote, Code, Image, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className }) => {
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const editorRef = React.useRef<HTMLDivElement>(null);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      // Capture updated content after execCommand
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const toggleStyle = (style: string) => {
    handleCommand(style);
  };

  const insertLink = () => {
    const url = prompt('Մուտքագրեք հղումը', 'http://');
    if (url) {
      handleCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Մուտքագրեք նկարի URL-ը', 'http://');
    if (url) {
      handleCommand('insertImage', url);
    }
  };

  return (
    <div className={cn("border rounded-md overflow-hidden", className)}>
      <div className="bg-muted/50 p-2 border-b">
        <div className="flex flex-wrap gap-2 mb-2">
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="bold" onClick={() => toggleStyle('bold')} aria-label="Bold">
              <Bold className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" onClick={() => toggleStyle('italic')} aria-label="Italic">
              <Italic className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Separator orientation="vertical" className="h-8" />
          
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="heading" onClick={() => handleCommand('formatBlock', '<h2>')} aria-label="Heading">
              <Heading className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="quote" onClick={() => handleCommand('formatBlock', '<blockquote>')} aria-label="Quote">
              <Quote className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="code" onClick={() => handleCommand('formatBlock', '<pre>')} aria-label="Code">
              <Code className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Separator orientation="vertical" className="h-8" />
          
          <ToggleGroup type="multiple">
            <ToggleGroupItem value="list-ul" onClick={() => handleCommand('insertUnorderedList')} aria-label="Bullet List">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list-ol" onClick={() => handleCommand('insertOrderedList')} aria-label="Numbered List">
              <ListOrdered className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Separator orientation="vertical" className="h-8" />
          
          <Button variant="ghost" size="icon" onClick={insertLink}>
            <Link className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={insertImage}>
            <Image className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-end">
          <ToggleGroup type="single" value={mode} onValueChange={(value) => value && setMode(value as 'write' | 'preview')}>
            <ToggleGroupItem value="write">Գրել</ToggleGroupItem>
            <ToggleGroupItem value="preview">Նախադիտում</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      {mode === 'write' ? (
        <div
          ref={editorRef}
          contentEditable
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={handleEditorChange}
          className="p-4 min-h-[250px] focus:outline-none prose max-w-full"
        />
      ) : (
        <div 
          className="p-4 min-h-[250px] prose max-w-full" 
          dangerouslySetInnerHTML={{ __html: value }}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
