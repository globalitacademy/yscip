
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectImageUploader from './ProjectImageUploader';

interface ProjectBasicInfoProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  detailedDescription: string;
  setDetailedDescription: (detailedDescription: string) => void;
  category: string;
  setCategory: (category: string) => void;
  complexity: 'Սկսնակ' | 'Միջին' | 'Առաջադեմ';
  setComplexity: (complexity: 'Սկսնակ' | 'Միջին' | 'Առաջադեմ') => void;
  duration: string;
  setDuration: (duration: string) => void;
  previewImage: string | null;
  setPreviewImage: (image: string | null) => void;
  setProjectImage: (image: string) => void;
}

const ProjectBasicInfo: React.FC<ProjectBasicInfoProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  detailedDescription,
  setDetailedDescription,
  category,
  setCategory,
  complexity,
  setComplexity,
  duration,
  setDuration,
  previewImage,
  setPreviewImage,
  setProjectImage
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Պրոեկտի վերնագիր</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Մուտքագրեք պրոեկտի վերնագիրը"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Կատեգորիա</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Օրինակ՝ Վեբ ծրագրավորում"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="complexity">Բարդություն</Label>
          <Select
            value={complexity}
            onValueChange={(value: 'Սկսնակ' | 'Միջին' | 'Առաջադեմ') => setComplexity(value)}
          >
            <SelectTrigger id="complexity" className="mt-1">
              <SelectValue placeholder="Ընտրեք բարդությունը" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Սկսնակ">Սկսնակ</SelectItem>
              <SelectItem value="Միջին">Միջին</SelectItem>
              <SelectItem value="Առաջադեմ">Առաջադեմ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="duration">Տևողություն</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Օրինակ՝ 6 շաբաթ"
            className="mt-1"
          />
        </div>

        <ProjectImageUploader 
          previewImage={previewImage}
          onImageChange={(imageDataUrl) => {
            setPreviewImage(imageDataUrl);
            setProjectImage(imageDataUrl);
          }}
          onImageRemove={() => {
            setPreviewImage(null);
            setProjectImage('');
          }}
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Համառոտ նկարագրություն</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Մուտքագրեք պրոեկտի համառոտ նկարագրությունը"
            className="mt-1 resize-none"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="detailedDescription">Մանրամասն նկարագրություն</Label>
          <Textarea
            id="detailedDescription"
            value={detailedDescription}
            onChange={(e) => setDetailedDescription(e.target.value)}
            placeholder="Մուտքագրեք պրոեկտի մանրամասն նկարագրությունը"
            className="mt-1 resize-none"
            rows={6}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectBasicInfo;
