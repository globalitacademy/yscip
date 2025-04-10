
import React, { useState } from 'react';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  ExternalLink, 
  Calendar, 
  Book, 
  Users, 
  Download, 
  Clock,
  CalendarDays,
  FileText,
  Languages,
  Cast,
  Laptop,
  Video,
  Building,
  Tv2,
  GraduationCap,
  School
} from 'lucide-react';
import CourseApplicationForm from './CourseApplicationForm';
import { useTheme } from '@/hooks/use-theme';
import { toast } from 'sonner';

interface CourseSidebarProps {
  course: ProfessionalCourse;
  handleApply: () => void;
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  handleApply
}) => {
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const { theme } = useTheme();
  
  const openApplicationForm = () => {
    setIsApplicationFormOpen(true);
  };

  const downloadSyllabus = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (course.syllabus_file) {
      // Open in a new tab or directly download based on browser behavior
      window.open(course.syllabus_file, '_blank');
    } else {
      toast.info('Դասընթացի ծրագիրը դեռ հասանելի չէ։');
    }
  };

  // Format display helpers
  const getLearningFormatIcon = (format: string) => {
    switch (format) {
      case 'online': return <Video className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />;
      case 'classroom': return <School className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />;
      case 'remote': return <Cast className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />;
      case 'hybrid': return <Laptop className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />;
      default: return <GraduationCap className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />;
    }
  };
  
  const getLearningFormatLabel = (format: string) => {
    switch (format) {
      case 'online': return 'Առցանց';
      case 'classroom': return 'Լսարանային';
      case 'remote': return 'Հեռավար';
      case 'hybrid': return 'Հիբրիդային';
      default: return format;
    }
  };
  
  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'armenian': return 'Հայերեն';
      case 'russian': return 'Ռուսերեն';
      case 'english': return 'Անգլերեն';
      default: return language;
    }
  };
  
  // Get resource icon based on type
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4 mr-2" />;
      case 'video': return <Video className="h-4 w-4 mr-2" />;
      case 'link': return <ExternalLink className="h-4 w-4 mr-2" />;
      default: return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  // Check if we have any learning formats or languages to display
  const hasLearningFormats = course.learning_formats && course.learning_formats.length > 0;
  const hasLanguages = course.languages && course.languages.length > 0;
  const showFormatsSection = hasLearningFormats || hasLanguages;
  
  // Check if we have resources to display
  const hasResources = course.resources && course.resources.length > 0;
  const hasDownloadableSyllabus = !!course.syllabus_file;

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-lg overflow-hidden sticky top-8`}>
      {course.imageUrl && (
        <div className="h-48 w-full">
          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800/95' : 'bg-indigo-50/80'}`}>
        {course.price && (
          <div className="mb-6 text-center">
            <p className={`text-3xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>{course.price}</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-indigo-500/70'}`}>Միայն սահմանափակ ժամանակով</p>
          </div>
        )}
        
        <div className={`space-y-4 mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'} p-4 rounded-lg shadow-md`}>
          <div className="flex justify-between items-center">
            <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <Calendar className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />
              Տևողություն
            </span>
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{course.duration}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <Book className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />
              Դասերի քանակ
            </span>
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{course.lessons ? course.lessons.length : 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              <Users className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />
              Դասախոս
            </span>
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{course.createdBy || course.instructor || 'Անանուն'}</span>
          </div>
          {course.institution && (
            <div className="flex justify-between items-center">
              <span className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <Building className={`h-4 w-4 mr-2 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />
                Հաստատություն
              </span>
              <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{course.institution}</span>
            </div>
          )}
          
          {/* Learning format and language section */}
          {showFormatsSection && (
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
              <h4 className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Ուսուցման ձևաչափ
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {hasLearningFormats && course.learning_formats.map(format => (
                  <div key={format} className="flex items-center gap-1.5">
                    {getLearningFormatIcon(format)}
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getLearningFormatLabel(format)}
                    </span>
                  </div>
                ))}
                
                {hasLanguages && course.languages.map(language => (
                  <div key={language} className="flex items-center gap-1.5">
                    <Languages className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {getLanguageLabel(language)}
                    </span>
                  </div>
                ))}
                
                {/* If no formats or languages are set, show a default option */}
                {!hasLearningFormats && !hasLanguages && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className={`h-3.5 w-3.5 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-500'}`} />
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Ստանդարտ</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Button onClick={openApplicationForm} className={`w-full mb-3 ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-full py-6 shadow-md transition-all transform hover:translate-y-[-2px]`}>
          {course.buttonText || "Դիմել դասընթացին"}
        </Button>
        
        {hasDownloadableSyllabus && (
          <Button 
            variant="outline" 
            className={`w-full rounded-full ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'}`}
            onClick={downloadSyllabus}
          >
            <Download className="mr-2 h-4 w-4" /> Ներբեռնել ծրագիրը
          </Button>
        )}
        
        <div className={`mt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-indigo-100'} pt-6`}>
          <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Դասընթացի առավելությունները</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className={`${theme === 'dark' ? 'bg-green-900/40' : 'bg-green-100'} rounded-full p-1 mt-0.5 mr-3`}>
                <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Անհատական ուշադրություն</span>
            </div>
            <div className="flex items-start">
              <div className={`${theme === 'dark' ? 'bg-green-900/40' : 'bg-green-100'} rounded-full p-1 mt-0.5 mr-3`}>
                <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Պրակտիկ հմտություններ</span>
            </div>
            <div className="flex items-start">
              <div className={`${theme === 'dark' ? 'bg-green-900/40' : 'bg-green-100'} rounded-full p-1 mt-0.5 mr-3`}>
                <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Ավարտական փաստաթուղթ</span>
            </div>
            <div className="flex items-start">
              <div className={`${theme === 'dark' ? 'bg-green-900/40' : 'bg-green-100'} rounded-full p-1 mt-0.5 mr-3`}>
                <CheckCircle className={`h-4 w-4 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Շարունակական աջակցություն</span>
            </div>
          </div>
        </div>
        
        {/* Resources section */}
        {hasResources && (
          <div className={`mt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-indigo-100'} pt-6`}>
            <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Օգտակար ռեսուրսներ</h3>
            <div className="space-y-3">
              {course.resources.map((resource, index) => (
                <a 
                  key={index}
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`flex items-center ${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-800'}`}
                >
                  {getResourceIcon(resource.type)}
                  <span>{resource.title || 'Օգտակար ռեսուրս'}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course Application Form Dialog */}
      <CourseApplicationForm course={course} isOpen={isApplicationFormOpen} onClose={() => setIsApplicationFormOpen(false)} />
    </div>
  );
};

export default CourseSidebar;
