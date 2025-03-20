import React from 'react';
import { User, Clock, BookText, Code, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FadeIn } from '@/components/LocalTransitions';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { toast } from 'sonner';

interface CourseBannerProps {
  displayCourse: ProfessionalCourse;
  isEditing: boolean;
  editedCourse: ProfessionalCourse | null;
  setEditedCourse: React.Dispatch<React.SetStateAction<ProfessionalCourse | null>>;
  handleApply: () => void;
}

const CourseBanner: React.FC<CourseBannerProps> = ({
  displayCourse,
  isEditing,
  editedCourse,
  setEditedCourse,
  handleApply
}) => {
  const iconOptions = [
    { label: 'Կոդ', value: 'code', icon: <Code className="h-5 w-5" /> },
    { label: 'Գիրք', value: 'book', icon: <BookText className="h-5 w-5" /> },
    { label: 'ԻԻ', value: 'ai', icon: <BrainCircuit className="h-5 w-5" /> },
    { label: 'Տվյալներ', value: 'database', icon: <Database className="h-5 w-5" /> },
    { label: 'Ֆայլեր', value: 'files', icon: <FileCode className="h-5 w-5" /> },
    { label: 'Վեբ', value: 'web', icon: <Globe className="h-5 w-5" /> },
  ];

  const colorOptions = [
    { label: 'Ամբերային', value: 'text-amber-500' },
    { label: 'Կապույտ', value: 'text-blue-500' },
    { label: 'Կարմիր', value: 'text-red-500' },
    { label: 'Դեղին', value: 'text-yellow-500' },
    { label: 'Մանուշակագույն', value: 'text-purple-500' },
    { label: 'Կանաչ', value: 'text-green-500' },
  ];

  const handleIconChange = (value: string) => {
    if (!editedCourse) return;

    console.log("CourseBanner: Փոխվում է պատկերակը դեպի:", value);

    let newIcon;
    switch (value) {
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
        newIcon = <BookText className="w-16 h-16" />;
    }

    const updatedCourse = { 
      ...editedCourse,
      icon: newIcon,
      iconName: value
    };
    
    console.log("CourseBanner: Թարմացված դասընթացը:", updatedCourse);
    console.log("CourseBanner: Նոր iconName:", value);
    setEditedCourse(updatedCourse);
    
    toast.info("Պատկերակը փոխվել է");
  };

  const handleColorChange = (value: string) => {
    if (!editedCourse) return;
    
    console.log("CourseBanner: Փոխվում է գույնը դեպի:", value);
    
    const updatedCourse = { 
      ...editedCourse,
      color: value
    };
    
    console.log("CourseBanner: Թարմացված դասընթացը:", updatedCourse);
    setEditedCourse(updatedCourse);
    
    toast.info("Գույնը փոխվել է");
  };

  const handlePreferIconChange = (checked: boolean) => {
    if (!editedCourse) return;
    
    console.log("CourseBanner: Փոխվում է ցուցադրման տեսակը:", checked ? "Պատկերակ" : "Նկար");
    
    const updatedCourse = { 
      ...editedCourse,
      preferIcon: checked
    };
    
    console.log("CourseBanner: Թարմացված դասընթացը:", updatedCourse);
    setEditedCourse(updatedCourse);
    
    toast.info(checked ? "Այժմ ցուցադրվում է պատկերակ" : "Այժմ ցուցադրվում է նկար");
  };

  const getGradientColors = (colorClass: string) => {
    switch(colorClass) {
      case 'text-amber-500': return 'from-amber-50 to-amber-100';
      case 'text-blue-500': return 'from-blue-50 to-indigo-100';
      case 'text-red-500': return 'from-red-50 to-rose-100';
      case 'text-yellow-500': return 'from-yellow-50 to-amber-100';
      case 'text-purple-500': return 'from-purple-50 to-indigo-100';
      case 'text-green-500': return 'from-green-50 to-emerald-100';
      default: return 'from-blue-50 to-indigo-100';
    }
  };

  const gradientClasses = getGradientColors(displayCourse.color);

  return (
    <FadeIn>
      <div className={`bg-gradient-to-r ${gradientClasses} rounded-xl p-8 mb-10 relative overflow-hidden`}>
        <div className="relative z-10">
          {isEditing ? (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Նկար URL</label>
                <Input 
                  value={editedCourse?.imageUrl || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, imageUrl: e.target.value} : prev)}
                  placeholder="https://example.com/image.jpg"
                  className="mb-3"
                />

                <div className="flex items-center justify-between mt-2">
                  <label className="block text-sm font-medium text-gray-700">Ցուցադրել որպես</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm mr-2">
                      {editedCourse?.preferIcon ? "Պատկերակ" : "Նկար"}
                    </span>
                    <Switch 
                      checked={editedCourse?.preferIcon || false}
                      onCheckedChange={handlePreferIconChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-4 flex items-center gap-4">
                <div className="flex-shrink-0">
                  {editedCourse?.icon}
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Պատկերակ</label>
                  <Select 
                    value={editedCourse?.iconName || ''} 
                    onValueChange={handleIconChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ընտրեք պատկերակ" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            {option.icon}
                            <span className="ml-2">{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Գույն</label>
                  <Select 
                    value={editedCourse?.color || ''} 
                    onValueChange={handleColorChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ընտրեք գույն" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${option.value.replace('text-', 'bg-')}`} />
                            <span className="ml-2">{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Input 
                value={editedCourse?.title || ''}
                onChange={(e) => setEditedCourse(prev => prev ? {...prev, title: e.target.value} : prev)}
                className="text-3xl md:text-4xl font-bold mb-3"
              />
              <Textarea 
                value={editedCourse?.description || ''}
                onChange={(e) => setEditedCourse(prev => prev ? {...prev, description: e.target.value} : prev)}
                className="text-lg mb-6"
                rows={4}
              />
            </>
          ) : (
            <>
              <div className="flex items-center mb-4">
                {displayCourse.preferIcon ? (
                  <div className={`mr-4 ${displayCourse?.color || 'text-blue-500'}`}>
                    {displayCourse?.icon}
                  </div>
                ) : null}
                <h1 className="text-3xl md:text-4xl font-bold">{displayCourse?.title}</h1>
              </div>
              <p className="text-lg text-muted-foreground mb-6">{displayCourse?.description}</p>
            </>
          )}
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              {isEditing ? (
                <Input 
                  value={editedCourse?.createdBy || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, createdBy: e.target.value} : prev)}
                  className="w-48"
                />
              ) : (
                <span>Դասախոս՝ {displayCourse?.createdBy}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-500" />
              {isEditing ? (
                <Input 
                  value={editedCourse?.duration || ''}
                  onChange={(e) => setEditedCourse(prev => prev ? {...prev, duration: e.target.value} : prev)}
                  className="w-48"
                />
              ) : (
                <span>Տևողություն՝ {displayCourse?.duration}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            {!isEditing && (
              <>
                <Button onClick={handleApply} size="lg">
                  Դիմել դասընթացին
                </Button>
                <Button variant="outline" size="lg">
                  Կապ հաստատել
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default CourseBanner;
