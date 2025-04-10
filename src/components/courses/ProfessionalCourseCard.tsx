import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { Eye, Pencil, Trash, Building, User, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '@/hooks/use-theme';
import { getCategoryBadgeClass, getInstitutionBadgeClass } from './utils/badgeUtils';

interface ProfessionalCourseCardProps {
  course: ProfessionalCourse;
  onEdit?: (course: ProfessionalCourse) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  canEdit?: boolean;
  onClick?: () => void;
}

const ProfessionalCourseCard: React.FC<ProfessionalCourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  isAdmin = false,
  canEdit = false,
  onClick
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation
    if (onDelete && course.id) {
      onDelete(course.id);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation
    if (onEdit) {
      onEdit(course);
    }
  };
  
  const handleViewClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/course/${course.id}`);
    }
  };
  
  const handleSyncToDatabase = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation

    try {
      const {
        data: existingCourse
      } = await supabase.from('courses').select('id').eq('id', course.id).maybeSingle();
      if (existingCourse) {
        const {
          error: updateError
        } = await supabase.from('courses').update({
          title: course.title,
          subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon_name: course.iconName || 'book',
          duration: course.duration,
          price: course.price,
          button_text: course.buttonText || 'Դիտել',
          color: course.color || 'text-amber-500',
          institution: course.institution || 'ՀՊՏՀ',
          image_url: course.imageUrl || null,
          organization_logo: course.organizationLogo || null,
          description: course.description || '',
          is_public: true,
          created_by: 'Administrator',
          created_at: new Date().toISOString(),
          slug: course.slug || course.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()
        }).eq('id', course.id);
        if (updateError) throw updateError;

        await Promise.all([supabase.from('course_lessons').delete().eq('course_id', course.id), supabase.from('course_requirements').delete().eq('course_id', course.id), supabase.from('course_outcomes').delete().eq('course_id', course.id)]);
      } else {
        const {
          error: insertError
        } = await supabase.from('courses').insert({
          id: course.id,
          title: course.title,
          subtitle: course.subtitle || 'ԴԱՍԸՆԹԱՑ',
          icon_name: course.iconName || 'book',
          duration: course.duration,
          price: course.price,
          button_text: course.buttonText || 'Դիտել',
          color: course.color || 'text-amber-500',
          institution: course.institution || 'ՀՊՏՀ',
          image_url: course.imageUrl || null,
          organization_logo: course.organizationLogo || null,
          description: course.description || '',
          is_public: true,
          created_by: 'Administrator',
          created_at: new Date().toISOString(),
          slug: course.slug || course.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()
        });
        if (insertError) throw insertError;
      }

      if (course.lessons && course.lessons.length > 0) {
        const {
          error: lessonsError
        } = await supabase.from('course_lessons').insert(course.lessons.map(lesson => ({
          course_id: course.id,
          title: lesson.title,
          duration: lesson.duration
        })));
        if (lessonsError) {
          console.error('Error inserting lessons:', lessonsError);
        }
      }

      if (course.requirements && course.requirements.length > 0) {
        const {
          error: requirementsError
        } = await supabase.from('course_requirements').insert(course.requirements.map(requirement => ({
          course_id: course.id,
          requirement: requirement
        })));
        if (requirementsError) {
          console.error('Error inserting requirements:', requirementsError);
        }
      }

      if (course.outcomes && course.outcomes.length > 0) {
        const {
          error: outcomesError
        } = await supabase.from('course_outcomes').insert(course.outcomes.map(outcome => ({
          course_id: course.id,
          outcome: outcome
        })));
        if (outcomesError) {
          console.error('Error inserting outcomes:', outcomesError);
        }
      }
      toast.success('Դասընթացը հաջողությամբ համաժամացվել է որպես ադմինի կողմից ավելացված');
    } catch (error) {
      console.error('Error syncing course to database:', error);
      toast.error('Դասընթացի համաժամացման ժամանակ սխալ է տեղի ունեցել');
    }
  };
  
  const getInstitutionBadgeClass = () => {
    const isDark = theme === 'dark';
    return isDark 
      ? "bg-slate-800/80 text-slate-200 border-slate-700"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };
  
  const isAdminUser = user?.role === 'admin';
  
  return <Card className={`flex flex-col w-full hover:shadow-md transition-shadow relative ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {course.organizationLogo ? (
        <div className={`absolute top-4 left-4 flex items-center text-xs px-2 py-1 rounded-full z-10 ${getInstitutionBadgeClass()}`}>
          <img src={course.organizationLogo} alt={course.institution} className="w-6 h-6 mr-1 object-contain rounded-full" />
          <span>{course.institution}</span>
        </div>
      ) : (
        <div className={`absolute top-4 left-4 flex items-center text-xs px-2 py-1 rounded-full z-10 ${getInstitutionBadgeClass()}`}>
          <Building size={12} className="mr-1" />
          <span>{course.institution}</span>
        </div>
      )}

      {(isAdmin || canEdit || isAdminUser) && <div className="absolute top-4 right-4 z-10 flex gap-2">
          {(isAdmin || canEdit) && <>
              <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={handleEdit}>
                <Pencil size={12} />
              </Button>
              <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={handleDelete}>
                <Trash size={12} />
              </Button>
            </>}
          {isAdminUser && <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={handleSyncToDatabase} title="Համաժամացնել որպես ադմինի կողմից ավելացված">
              <RefreshCw size={12} />
            </Button>}
        </div>}

      <CardHeader className={`pb-2 text-center pt-12 relative ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        {course.imageUrl ? <div className="w-full h-32 mb-4 overflow-hidden rounded-md">
            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" onError={e => {
          e.currentTarget.style.display = 'none';
          const iconElement = document.getElementById(`course-icon-${course.id}`);
          if (iconElement) iconElement.style.display = 'block';
        }} />
          </div> : <div id={`course-icon-${course.id}`} className={`mb-4 ${course.color} mx-auto`}>
            {course.icon}
          </div>}
        <h3 className="font-bold text-xl">{course.title}</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{course.subtitle}</p>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2">
        <div className={`flex items-center gap-2 text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <User size={16} />
          <span>Դասախոս՝ {course.createdBy}</span>
        </div>
        
        <div className={`flex justify-between w-full text-sm mt-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          <span>{course.duration}</span>
          <span className="font-semibold">{course.price}</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Button 
          variant="outline" 
          className={`w-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600' : 'bg-gray-50 hover:bg-gray-100'}`} 
          onClick={handleViewClick}>
          <Eye className="h-4 w-4 mr-2" /> {course.buttonText || "Մանրամասն"}
        </Button>
      </CardFooter>
    </Card>;
};

export default ProfessionalCourseCard;
