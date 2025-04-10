
import React, { useState, useEffect } from 'react';
import { ProfessionalCourse, CourseInstructor } from '@/components/courses/types/ProfessionalCourse';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";

interface AuthorTabProps {
  editedCourse: Partial<ProfessionalCourse>;
  setEditedCourse: (changes: Partial<ProfessionalCourse>) => void;
}

export const AuthorTab: React.FC<AuthorTabProps> = ({ editedCourse, setEditedCourse }) => {
  const [instructors, setInstructors] = useState<CourseInstructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [newInstructor, setNewInstructor] = useState<Partial<CourseInstructor>>({
    name: '',
    title: '',
    bio: '',
    avatar_url: ''
  });
  const { theme } = useTheme();
  
  useEffect(() => {
    if (editedCourse.id) {
      fetchInstructors();
    }
  }, [editedCourse.id]);
  
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const response = await supabase
        .from('course_instructors')
        .select('*')
        .eq('course_id', editedCourse.id);
        
      if (response.error) throw response.error;
      
      const instructorData = response.data?.map(item => ({
        id: item.id,
        name: item.name,
        title: item.title,
        bio: item.bio,
        avatar_url: item.avatar_url,
        course_id: item.course_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      })) as CourseInstructor[];
      
      setInstructors(instructorData || []);
      
      const instructorIds = instructorData?.map(instructor => 
        instructor.id?.toString()
      ).filter(Boolean) as string[] || [];
      
      setEditedCourse({
        ...editedCourse,
        instructor_ids: instructorIds
      });
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (field: string, value: string | string[] | 'lecturer' | 'institution') => {
    console.log(`AuthorTab: Updating ${field} to:`, value);
    
    const updatedCourse = { ...editedCourse, [field]: value };
    console.log(`AuthorTab: New state after updating ${field}:`, updatedCourse);
    
    setEditedCourse(updatedCourse);
  };
  
  const addInstructor = async () => {
    if (!newInstructor.name || !editedCourse.id) return;
    
    setLoading(true);
    try {
      const response = await supabase
        .from('course_instructors')
        .insert({
          name: newInstructor.name,
          title: newInstructor.title,
          bio: newInstructor.bio,
          avatar_url: newInstructor.avatar_url,
          course_id: editedCourse.id
        })
        .select();
        
      if (response.error) throw response.error;
      
      if (response.data && response.data[0]) {
        const newInstructorData: CourseInstructor = {
          id: response.data[0].id,
          name: response.data[0].name,
          title: response.data[0].title,
          bio: response.data[0].bio,
          avatar_url: response.data[0].avatar_url,
          course_id: response.data[0].course_id,
          created_at: response.data[0].created_at,
          updated_at: response.data[0].updated_at
        };
        
        setInstructors([...instructors, newInstructorData]);
        
        const updatedIds = [...(editedCourse.instructor_ids || []), newInstructorData.id.toString()];
        setEditedCourse({
          ...editedCourse,
          instructor_ids: updatedIds
        });
        
        setNewInstructor({
          name: '',
          title: '',
          bio: '',
          avatar_url: ''
        });
      }
    } catch (error) {
      console.error('Error adding instructor:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const removeInstructor = async (instructorId: string) => {
    setLoading(true);
    try {
      const response = await supabase
        .from('course_instructors')
        .delete()
        .eq('id', instructorId);
        
      if (response.error) throw response.error;
      
      const updatedInstructors = instructors.filter(instructor => instructor.id !== instructorId);
      setInstructors(updatedInstructors);
      
      const updatedIds = (editedCourse.instructor_ids || [])
        .filter(id => id !== instructorId);
      
      setEditedCourse({
        ...editedCourse,
        instructor_ids: updatedIds
      });
    } catch (error) {
      console.error('Error removing instructor:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleNewInstructorChange = (field: string, value: string) => {
    setNewInstructor({
      ...newInstructor,
      [field]: value
    });
  };

  return (
    <div className="space-y-8">
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={`text-xl ${theme === 'dark' ? 'text-gray-100' : ''}`}>
            Դասընթացի հեղինակ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className={theme === 'dark' ? 'text-gray-300' : ''}>Հեղինակի տեսակ</Label>
            <RadioGroup 
              value={editedCourse.author_type || 'lecturer'} 
              onValueChange={(value) => handleInputChange('author_type', value as 'lecturer' | 'institution')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lecturer" id="author-lecturer" 
                  className={theme === 'dark' ? 'border-gray-600' : ''} />
                <Label htmlFor="author-lecturer" className={theme === 'dark' ? 'text-gray-300' : ''}>
                  Դասախոս
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="institution" id="author-institution" 
                  className={theme === 'dark' ? 'border-gray-600' : ''} />
                <Label htmlFor="author-institution" className={theme === 'dark' ? 'text-gray-300' : ''}>
                  Հաստատություն
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {editedCourse.author_type === 'lecturer' || !editedCourse.author_type ? (
            <div className="space-y-2">
              <Label htmlFor="createdBy" className={`text-base ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                Հեղինակ (անուն, ազգանուն)
              </Label>
              <Input 
                id="createdBy" 
                value={editedCourse.createdBy || ''} 
                onChange={(e) => handleInputChange('createdBy', e.target.value)}
                placeholder="Մուտքագրեք հեղինակի անունը և ազգանունը"
                className={`focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="institution" className={`text-base ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                Հաստատության անվանումը
              </Label>
              <Input 
                id="institution" 
                value={editedCourse.institution || ''} 
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="Մուտքագրեք հաստատության անվանումը"
                className={`focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
              />
              {editedCourse.organizationLogo && (
                <div className="mt-2">
                  <img 
                    src={editedCourse.organizationLogo} 
                    alt={editedCourse.institution} 
                    className="h-12 object-contain" 
                  />
                </div>
              )}
              <div className="pt-2">
                <Label htmlFor="organizationLogo" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                  Հաստատության լոգո
                </Label>
                <Input 
                  id="organizationLogo" 
                  value={editedCourse.organizationLogo || ''} 
                  onChange={(e) => handleInputChange('organizationLogo', e.target.value)}
                  placeholder="Մուտքագրեք լոգոյի URL-ը"
                  className={`focus:border-blue-500 mt-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}>
        <CardHeader>
          <CardTitle className={`text-xl ${theme === 'dark' ? 'text-gray-100' : ''}`}>
            Դասընթացի դասախոսները
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {instructors.length > 0 ? (
            <div className="space-y-4">
              {instructors.map(instructor => (
                <Card key={instructor.id} 
                  className={theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50'}>
                  <CardContent className="pt-4 flex justify-between items-start">
                    <div className="flex gap-4 items-start">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={instructor.avatar_url || ''} alt={instructor.name} />
                        <AvatarFallback className={theme === 'dark' ? 'bg-gray-600 text-gray-200' : ''}>
                          {instructor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className={`font-medium ${theme === 'dark' ? 'text-gray-100' : ''}`}>
                          {instructor.name}
                        </h4>
                        {instructor.title && (
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                            {instructor.title}
                          </p>
                        )}
                        {instructor.bio && (
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                            {instructor.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeInstructor(instructor.id)}
                      className={`text-red-500 ${theme === 'dark' 
                        ? 'hover:text-red-400 hover:bg-gray-600' 
                        : 'hover:text-red-700 hover:bg-red-50'}`}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className={`text-center py-4 ${theme === 'dark' 
              ? 'text-gray-400' 
              : 'text-muted-foreground'}`}>
              Դեռ չկան դասախոսներ։ Ավելացրեք դասախոսների այս դասընթացի համար։
            </div>
          )}
          
          <div className={`border rounded-md p-4 ${theme === 'dark' 
            ? 'bg-gray-700/50 border-gray-600' 
            : 'bg-gray-50'}`}>
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-gray-200' : ''}`}>
              Ավելացնել նոր դասախոս
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instructor-name" className={theme === 'dark' ? 'text-gray-300' : ''}>
                  Անուն, Ազգանուն
                </Label>
                <Input 
                  id="instructor-name"
                  value={newInstructor.name}
                  onChange={(e) => handleNewInstructorChange('name', e.target.value)}
                  placeholder="Դասախոսի անուն ազգանունը"
                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor-title" className={theme === 'dark' ? 'text-gray-300' : ''}>
                  Պաշտոն/Մասնագիտություն
                </Label>
                <Input 
                  id="instructor-title"
                  value={newInstructor.title || ''}
                  onChange={(e) => handleNewInstructorChange('title', e.target.value)}
                  placeholder="Օր․՝ Տեխնիկական գիտությունների թեկնածու"
                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor-bio" className={theme === 'dark' ? 'text-gray-300' : ''}>
                  Կենսագրություն
                </Label>
                <Textarea 
                  id="instructor-bio"
                  value={newInstructor.bio || ''}
                  onChange={(e) => handleNewInstructorChange('bio', e.target.value)}
                  placeholder="Դասախոսի մասին կարճ տեղեկություն"
                  rows={3}
                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor-avatar" className={theme === 'dark' ? 'text-gray-300' : ''}>
                  Լուսանկարի URL
                </Label>
                <Input 
                  id="instructor-avatar"
                  value={newInstructor.avatar_url || ''}
                  onChange={(e) => handleNewInstructorChange('avatar_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}
                />
              </div>
              
              <Button 
                type="button" 
                onClick={addInstructor}
                disabled={loading || !newInstructor.name}
                className={`w-full ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
              >
                <Plus size={16} className="mr-2" /> Ավելացնել դասախոս
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2 hidden">
        <Label htmlFor="instructor" className={`text-base ${theme === 'dark' ? 'text-gray-300' : ''}`}>
          Հին դասավանդող դաշտ (հին տվյալների համար)
        </Label>
        <Input 
          id="instructor" 
          value={editedCourse.instructor || ''} 
          onChange={(e) => handleInputChange('instructor', e.target.value)}
          placeholder="Մուտքագրեք դասավանդողի անունը"
          className={`focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
        />
      </div>
      
      <div className="space-y-2 hidden">
        <Label htmlFor="buttonText" className={theme === 'dark' ? 'text-gray-300' : ''}>
          Կոճակի տեքստ
        </Label>
        <Input 
          id="buttonText" 
          value={editedCourse.buttonText || 'Դիտել'} 
          onChange={(e) => handleInputChange('buttonText', e.target.value)}
          placeholder="Դիտել"
          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}
        />
      </div>
    </div>
  );
};

