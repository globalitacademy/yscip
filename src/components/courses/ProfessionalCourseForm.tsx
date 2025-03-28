import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from "../ui/button";
import { ChevronDown, X, PlusCircle, Upload, Link, Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Switch } from "@/components/ui/switch";

const colorOptions = [
  { label: 'Ամբերային', value: 'text-amber-500' },
  { label: 'Կապույտ', value: 'text-blue-500' },
  { label: 'Կարմիր', value: 'text-red-500' },
  { label: 'Դեղին', value: 'text-yellow-500' },
  { label: 'Մանուշակագույն', value: 'text-purple-500' },
  { label: 'Կանաչ', value: 'text-green-500' },
];

const iconOptions = [
  { label: 'Կոդ', value: 'code', icon: <Code className="h-5 w-5" /> },
  { label: 'Գիրք', value: 'book', icon: <BookText className="h-5 w-5" /> },
  { label: 'ԻԻ', value: 'ai', icon: <BrainCircuit className="h-5 w-5" /> },
  { label: 'Տվյալներ', value: 'database', icon: <Database className="h-5 w-5" /> },
  { label: 'Ֆայլեր', value: 'files', icon: <FileCode className="h-5 w-5" /> },
  { label: 'Վեբ', value: 'web', icon: <Globe className="h-5 w-5" /> },
];

interface ProfessionalCourseFormProps {
  course: Partial<ProfessionalCourse>;
  setCourse: (course: Partial<ProfessionalCourse>) => void;
  isEdit?: boolean;
}

const ProfessionalCourseForm: React.FC<ProfessionalCourseFormProps> = ({
  course,
  setCourse,
  isEdit = false
}) => {
  const [isIconsOpen, setIsIconsOpen] = useState(false);
  const [isColorsOpen, setIsColorsOpen] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: '', duration: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [imageOption, setImageOption] = useState(course.imageUrl ? 'url' : 'icon');
  const [logoOption, setLogoOption] = useState(course.organizationLogo ? 'url' : 'upload');
  const [useCustomInstitution, setUseCustomInstitution] = useState(
    !['ՀՊՏՀ', 'ԵՊՀ', 'ՀԱՊՀ', 'ՀԱՀ', 'ՀՊՄՀ', 'ՀՌԱՀ'].includes(course.institution || '')
  );

  const handleIconSelect = (iconName: string) => {
    let newIcon;
    switch (iconName) {
      case 'code':
        newIcon = <Code className="w-16 h-16" />;
        break;
      case 'book':
        newIcon = <BookText className="w-16 h-16" />;
        break;
      case 'ai':
        newIcon = <BrainCircuit className="w-16 h-16" />;
        break;
      case 'database':
        newIcon = <Database className="w-16 h-16" />;
        break;
      case 'files':
        newIcon = <FileCode className="w-16 h-16" />;
        break;
      case 'web':
        newIcon = <Globe className="w-16 h-16" />;
        break;
      default:
        newIcon = <Code className="w-16 h-16" />;
    }
    setCourse({ ...course, icon: newIcon });
    setIsIconsOpen(false);
  };

  const handleColorSelect = (color: string) => {
    setCourse({ ...course, color });
    setIsColorsOpen(false);
  };

  const handleInstitutionChange = (value: string) => {
    setCourse({ ...course, institution: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourse({ ...course, imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourse({ ...course, organizationLogo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddLesson = () => {
    if (newLesson.title && newLesson.duration) {
      const lessons = [...(course.lessons || []), newLesson];
      setCourse({ ...course, lessons });
      setNewLesson({ title: '', duration: '' });
    }
  };

  const handleRemoveLesson = (index: number) => {
    const lessons = [...(course.lessons || [])];
    lessons.splice(index, 1);
    setCourse({ ...course, lessons });
  };

  const handleAddRequirement = () => {
    if (newRequirement) {
      const requirements = [...(course.requirements || []), newRequirement];
      setCourse({ ...course, requirements });
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const requirements = [...(course.requirements || [])];
    requirements.splice(index, 1);
    setCourse({ ...course, requirements });
  };

  const handleAddOutcome = () => {
    if (newOutcome) {
      const outcomes = [...(course.outcomes || []), newOutcome];
      setCourse({ ...course, outcomes });
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index: number) => {
    const outcomes = [...(course.outcomes || [])];
    outcomes.splice(index, 1);
    setCourse({ ...course, outcomes });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Վերնագիր</Label>
          <Input
            id="title"
            value={course.title}
            onChange={(e) => setCourse({ ...course, title: e.target.value })}
            placeholder="Դասընթացի վերնագիր"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">Ենթավերնագիր</Label>
          <Input
            id="subtitle"
            value={course.subtitle}
            onChange={(e) => setCourse({ ...course, subtitle: e.target.value })}
            placeholder="Դասընթացի ենթավերնագիր"
          />
        </div>

        <div>
          <Label htmlFor="description">Նկարագրություն</Label>
          <Textarea
            id="description"
            value={course.description || ''}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
            placeholder="Դասընթացի մանրամասն նկարագրություն"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="duration">Տևողություն</Label>
          <Input
            id="duration"
            value={course.duration}
            onChange={(e) => setCourse({ ...course, duration: e.target.value })}
            placeholder="Օրինակ՝ 3 ամիս"
          />
        </div>

        <div>
          <Label htmlFor="price">Արժեք</Label>
          <Input
            id="price"
            value={course.price}
            onChange={(e) => setCourse({ ...course, price: e.target.value })}
            placeholder="Օրինակ՝ 58,000 ֏"
          />
        </div>

        <div>
          <Label>Հաստատություն</Label>
          <div className="flex items-center mb-2">
            <input 
              type="checkbox" 
              id="customInstitution" 
              className="mr-2"
              checked={useCustomInstitution}
              onChange={(e) => setUseCustomInstitution(e.target.checked)}
            />
            <Label htmlFor="customInstitution" className="text-sm font-normal">
              Մուտքագրել այլ հաստատություն
            </Label>
          </div>

          {useCustomInstitution ? (
            <Input
              value={course.institution}
              onChange={(e) => handleInstitutionChange(e.target.value)}
              placeholder="Հաստատության անվանումը"
            />
          ) : (
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={course.institution}
              onChange={(e) => handleInstitutionChange(e.target.value)}
            >
              <option value="ՀՊՏՀ">ՀՊՏՀ</option>
              <option value="ԵՊՀ">ԵՊՀ</option>
              <option value="ՀԱՊՀ">ՀԱՊՀ</option>
              <option value="ՀԱՀ">ՀԱՀ</option>
              <option value="ՀՊՄՀ">ՀՊՄՀ</option>
              <option value="ՀՌԱՀ">ՀՌԱՀ</option>
            </select>
          )}
        </div>

        <div>
          <Label>Կազմակերպության լոգո</Label>
          <Tabs value={logoOption} onValueChange={setLogoOption} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="border rounded-md p-4 text-center">
                <label htmlFor="logoUpload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Ներբեռնել լոգո</span>
                  <input
                    id="logoUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                {course.organizationLogo && (
                  <div className="mt-4">
                    <img 
                      src={course.organizationLogo} 
                      alt="Organization Logo Preview" 
                      className="max-h-20 mx-auto"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="border rounded-md p-4">
                <div className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  <Input
                    value={course.organizationLogo || ''}
                    onChange={(e) => setCourse({ ...course, organizationLogo: e.target.value })}
                    placeholder="https://example.com/logo.jpg"
                  />
                </div>
                {course.organizationLogo && (
                  <div className="mt-4">
                    <img 
                      src={course.organizationLogo} 
                      alt="Organization Logo Preview" 
                      className="max-h-20 mx-auto"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Label>Պատկեր</Label>
          <Tabs value={imageOption} onValueChange={setImageOption} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="icon">Պատկերակ</TabsTrigger>
              <TabsTrigger value="upload">Ներբեռնել</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="icon">
              <Collapsible
                open={isIconsOpen}
                onOpenChange={setIsIconsOpen}
                className="w-full border rounded-md p-2"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer p-2">
                    <span>Ընտրել պատկերակ</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isIconsOpen ? 'transform rotate-180' : ''}`} />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {iconOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant="outline"
                        className="flex flex-col items-center p-2 h-auto"
                        onClick={() => handleIconSelect(option.value)}
                      >
                        {option.icon}
                        <span className="mt-1 text-xs">{option.label}</span>
                      </Button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>
            <TabsContent value="upload">
              <div className="border rounded-md p-4 text-center">
                <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2" />
                  <span>Ներբեռնել նկար</span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <div className="border rounded-md p-4">
                <div className="flex items-center">
                  <Link className="h-5 w-5 mr-2" />
                  <Input
                    value={course.imageUrl || ''}
                    onChange={(e) => setCourse({ ...course, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Collapsible
          open={isColorsOpen}
          onOpenChange={setIsColorsOpen}
          className="w-full border rounded-md p-2"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer p-2">
              <span>Գույնի ընտրություն</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isColorsOpen ? 'transform rotate-180' : ''}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  className={`p-2 ${option.value.replace('text-', 'bg-').replace('-500', '-100')}`}
                  onClick={() => handleColorSelect(option.value)}
                >
                  <span className={option.value}>{option.label}</span>
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border rounded-md p-4 space-y-4">
          <h3 className="text-lg font-medium mb-2">Ցուցադրման կարգավորումներ</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_public" className="font-medium">Հրապարակային դասընթաց</Label>
              <p className="text-sm text-muted-foreground">Դասընթացը տեսանելի կլինի բոլոր օգտատերերին</p>
            </div>
            <Switch 
              id="is_public" 
              checked={course.is_public || false}
              onCheckedChange={(checked) => setCourse({ ...course, is_public: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show_on_homepage" className="font-medium">Ցուցադրել գլխավոր էջում</Label>
              <p className="text-sm text-muted-foreground">Դասընթացը կցուցադրվի գլխավոր էջի դասընթացների բաժնում</p>
            </div>
            <Switch 
              id="show_on_homepage" 
              checked={course.show_on_homepage || false}
              onCheckedChange={(checked) => setCourse({ ...course, show_on_homepage: checked })}
            />
          </div>
          
          <div>
            <Label htmlFor="display_order">Ցուցադրման հերթականություն</Label>
            <Input
              id="display_order"
              type="number"
              min="0"
              value={course.display_order || 0}
              onChange={(e) => setCourse({ ...course, display_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-24"
            />
            <p className="text-xs text-muted-foreground mt-1">Ավելի փոքր թվով դասընթացները ցուցադրվում են առաջինը</p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="lessons">
            <AccordionTrigger>Դասընթացի ծրագիր</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {(course.lessons || []).map((lesson, index) => (
                    <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex-1">
                        <div className="font-medium">{lesson.title}</div>
                        <div className="text-sm text-muted-foreground">{lesson.duration}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveLesson(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="lessonTitle">Թեմայի անվանում</Label>
                    <Input
                      id="lessonTitle"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      placeholder="Օր․՝ HTML5 հիմունքներ"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lessonDuration">Տևողություն</Label>
                    <Input
                      id="lessonDuration"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                      placeholder="Օր․՝ 3 ժամ"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddLesson}
                  className="w-full"
                  disabled={!newLesson.title || !newLesson.duration}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ավելացնել թեմա
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="outcomes">
            <AccordionTrigger>Ինչ կսովորեք</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {(course.outcomes || []).map((outcome, index) => (
                    <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex-1">{outcome}</div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveOutcome(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="outcome">Սովորելիք</Label>
                  <Input
                    id="outcome"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    placeholder="Օր․՝ Մշակել ամբողջական ինտերակտիվ վեբ կայքեր"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddOutcome}
                  className="w-full"
                  disabled={!newOutcome}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ավելացնել սովորելիք
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="requirements">
            <AccordionTrigger>Պահանջներ</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  {(course.requirements || []).map((requirement, index) => (
                    <div key={index} className="flex items-center justify-between border p-2 rounded-md">
                      <div className="flex-1">{requirement}</div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveRequirement(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="requirement">Պահանջ</Label>
                  <Input
                    id="requirement"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Օր․՝ Համակարգչային հիմնական գիտելիքներ"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddRequirement}
                  className="w-full"
                  disabled={!newRequirement}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ավելացնել պահանջ
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ProfessionalCourseForm;
