import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Clock, Ban, Check, ExternalLink, Pencil, Save, X, PlusCircle, Trash } from 'lucide-react';
import { FadeIn } from '@/components/LocalTransitions';
import { toast } from 'sonner';
import { ProfessionalCourse } from '@/components/courses/types/ProfessionalCourse';
import EditProfessionalCourseDialog from '@/components/courses/EditProfessionalCourseDialog';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { getIconFromName } from '@/components/courses/utils/iconUtils';

const getCourseById = async (id: string): Promise<ProfessionalCourse | undefined> => {
  try {
    // Fetch course from Supabase
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (courseError) {
      console.error('Error fetching course:', courseError);
      return undefined;
    }
    
    if (!courseData) {
      return undefined;
    }
    
    // Fetch lessons for this course
    const { data: lessonsData, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('course_id', id);
      
    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError);
    }
    
    // Fetch requirements for this course
    const { data: requirementsData, error: requirementsError } = await supabase
      .from('course_requirements')
      .select('*')
      .eq('course_id', id);
      
    if (requirementsError) {
      console.error('Error fetching requirements:', requirementsError);
    }
    
    // Fetch outcomes for this course
    const { data: outcomesData, error: outcomesError } = await supabase
      .from('course_outcomes')
      .select('*')
      .eq('course_id', id);
      
    if (outcomesError) {
      console.error('Error fetching outcomes:', outcomesError);
    }
    
    // Transform to ProfessionalCourse format
    const course: ProfessionalCourse = {
      id: courseData.id,
      title: courseData.title,
      subtitle: courseData.subtitle,
      icon: getIconFromName(courseData.icon_name),
      icon_name: courseData.icon_name,
      duration: courseData.duration,
      price: courseData.price,
      button_text: courseData.button_text,
      color: courseData.color,
      created_by: courseData.created_by,
      institution: courseData.institution,
      image_url: courseData.image_url,
      description: courseData.description,
      is_persistent: true,
      lessons: lessonsData?.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        duration: lesson.duration
      })) || [],
      requirements: requirementsData?.map(req => req.requirement) || [],
      outcomes: outcomesData?.map(outcome => outcome.outcome) || [],
      created_at: courseData.created_at,
      updated_at: courseData.updated_at
    };
    
    return course;
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return undefined;
  }
};

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState<ProfessionalCourse | null>(null);
  const [newLesson, setNewLesson] = useState({ title: '', duration: '' });
  const [newRequirement, setNewRequirement] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const { user } = useAuth();

  const fetchCourse = async () => {
    if (!id) return;
    
    setLoading(true);
    const courseData = await getCourseById(id);
    setCourse(courseData || null);
    setEditedCourse(courseData || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleApply = async () => {
    if (!id || !user) {
      toast.error("Խնդիր առաջացավ դիմումը ուղարկելու ժամանակ։ Խնդրում ենք փորձել կրկին։");
      return;
    }

    try {
      // Add enrollment to database
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: id,
          user_id: user.id,
          status: 'pending'
        });

      if (error) {
        console.error('Error adding enrollment:', error);
        toast.error("Խնդիր առաջացավ դիմումը ուղարկելու ժամանակ։ Խնդրում ենք փորձել կրկին։");
        return;
      }

      toast.success("Դիմումը հաջողությամբ ուղարկված է", {
        description: "Մենք կապ կհաստատենք ձեզ հետ",
        duration: 5000,
      });
    } catch (error) {
      console.error('Error in handleApply:', error);
      toast.error("Խնդիր առաջացավ դիմումը ուղարկելու ժամանակ։ Խնդրում ենք փորձել կրկին։");
    }
  };

  const handleEditCourse = async () => {
    if (!course) return;

    try {
      // Update course in database
      const { error: courseError } = await supabase
        .from('courses')
        .update({
          title: course.title,
          subtitle: course.subtitle,
          icon_name: course.icon_name,
          duration: course.duration,
          price: course.price,
          button_text: course.button_text,
          color: course.color,
          created_by: course.created_by,
          institution: course.institution,
          image_url: course.image_url,
          description: course.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id);

      if (courseError) {
        console.error('Error updating course:', courseError);
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
        return;
      }

      // Handle lessons
      if (course.lessons) {
        // Delete existing lessons
        await supabase
          .from('course_lessons')
          .delete()
          .eq('course_id', course.id);
        
        // Add updated lessons
        if (course.lessons.length > 0) {
          const lessonsToAdd = course.lessons.map(lesson => ({
            course_id: course.id,
            title: lesson.title,
            duration: lesson.duration
          }));

          const { error: lessonsError } = await supabase
            .from('course_lessons')
            .insert(lessonsToAdd);

          if (lessonsError) {
            console.error('Error updating lessons:', lessonsError);
          }
        }
      }

      // Handle requirements
      if (course.requirements) {
        // Delete existing requirements
        await supabase
          .from('course_requirements')
          .delete()
          .eq('course_id', course.id);
        
        // Add updated requirements
        if (course.requirements.length > 0) {
          const requirementsToAdd = course.requirements.map(req => ({
            course_id: course.id,
            requirement: req
          }));

          const { error: requirementsError } = await supabase
            .from('course_requirements')
            .insert(requirementsToAdd);

          if (requirementsError) {
            console.error('Error updating requirements:', requirementsError);
          }
        }
      }

      // Handle outcomes
      if (course.outcomes) {
        // Delete existing outcomes
        await supabase
          .from('course_outcomes')
          .delete()
          .eq('course_id', course.id);
        
        // Add updated outcomes
        if (course.outcomes.length > 0) {
          const outcomesToAdd = course.outcomes.map(outcome => ({
            course_id: course.id,
            outcome: outcome
          }));

          const { error: outcomesError } = await supabase
            .from('course_outcomes')
            .insert(outcomesToAdd);

          if (outcomesError) {
            console.error('Error updating outcomes:', outcomesError);
          }
        }
      }

      // Refresh the course data
      await fetchCourse();
      
      setIsEditDialogOpen(false);
      toast.success('Դասընթացը հաջողությամբ թարմացվել է');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Save changes
      if (!editedCourse) return;
      
      try {
        // Update course in database
        const { error: courseError } = await supabase
          .from('courses')
          .update({
            title: editedCourse.title,
            subtitle: editedCourse.subtitle,
            icon_name: editedCourse.icon_name,
            duration: editedCourse.duration,
            price: editedCourse.price,
            button_text: editedCourse.button_text,
            color: editedCourse.color,
            created_by: editedCourse.created_by,
            institution: editedCourse.institution,
            image_url: editedCourse.image_url,
            description: editedCourse.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editedCourse.id);

        if (courseError) {
          console.error('Error updating course:', courseError);
          toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
          return;
        }

        // Handle lessons
        if (editedCourse.lessons) {
          // Delete existing lessons
          await supabase
            .from('course_lessons')
            .delete()
            .eq('course_id', editedCourse.id);
          
          // Add updated lessons
          if (editedCourse.lessons.length > 0) {
            const lessonsToAdd = editedCourse.lessons.map(lesson => ({
              course_id: editedCourse.id,
              title: lesson.title,
              duration: lesson.duration
            }));

            const { error: lessonsError } = await supabase
              .from('course_lessons')
              .insert(lessonsToAdd);

            if (lessonsError) {
              console.error('Error updating lessons:', lessonsError);
            }
          }
        }

        // Handle requirements
        if (editedCourse.requirements) {
          // Delete existing requirements
          await supabase
            .from('course_requirements')
            .delete()
            .eq('course_id', editedCourse.id);
          
          // Add updated requirements
          if (editedCourse.requirements.length > 0) {
            const requirementsToAdd = editedCourse.requirements.map(req => ({
              course_id: editedCourse.id,
              requirement: req
            }));

            const { error: requirementsError } = await supabase
              .from('course_requirements')
              .insert(requirementsToAdd);

            if (requirementsError) {
              console.error('Error updating requirements:', requirementsError);
            }
          }
        }

        // Handle outcomes
        if (editedCourse.outcomes) {
          // Delete existing outcomes
          await supabase
            .from('course_outcomes')
            .delete()
            .eq('course_id', editedCourse.id);
          
          // Add updated outcomes
          if (editedCourse.outcomes.length > 0) {
            const outcomesToAdd = editedCourse.outcomes.map(outcome => ({
              course_id: editedCourse.id,
              outcome: outcome
            }));

            const { error: outcomesError } = await supabase
              .from('course_outcomes')
              .insert(outcomesToAdd);

            if (outcomesError) {
              console.error('Error updating outcomes:', outcomesError);
            }
          }
        }

        // Refresh the course data
        await fetchCourse();
        
        toast.success('Դասընթացը հաջողությամբ թարմացվել է');
      } catch (error) {
        console.error('Error updating course:', error);
        toast.error('Դասընթացի թարմացման ժամանակ սխալ է տեղի ունեցել');
        return;
      }
    } else {
      // Enter edit mode
      setEditedCourse(course);
    }
    
    setIsEditing(!isEditing);
  };

  const cancelEditing = () => {
    setEditedCourse(course);
    setIsEditing(false);
  };

  const handleAddLesson = () => {
    if (!editedCourse || !newLesson.title || !newLesson.duration) return;
    
    const updatedLessons = [...(editedCourse.lessons || []), newLesson];
    setEditedCourse({
      ...editedCourse,
      lessons: updatedLessons
    });
    setNewLesson({ title: '', duration: '' });
  };

  const handleRemoveLesson = (index: number) => {
    if (!editedCourse) return;
    
    const updatedLessons = [...(editedCourse.lessons || [])];
    updatedLessons.splice(index, 1);
    setEditedCourse({
      ...editedCourse,
      lessons: updatedLessons
    });
  };

  const handleAddRequirement = () => {
    if (!editedCourse || !newRequirement) return;
    
    const updatedRequirements = [...(editedCourse.requirements || []), newRequirement];
    setEditedCourse({
      ...editedCourse,
      requirements: updatedRequirements
    });
    setNewRequirement('');
  };

  const handleRemoveRequirement = (index: number) => {
    if (!editedCourse) return;
    
    const updatedRequirements = [...(editedCourse.requirements || [])];
    updatedRequirements.splice(index, 1);
    setEditedCourse({
      ...editedCourse,
      requirements: updatedRequirements
    });
  };

  const handleAddOutcome = () => {
    if (!editedCourse || !newOutcome) return;
    
    const updatedOutcomes = [...(editedCourse.outcomes || []), newOutcome];
    setEditedCourse({
      ...editedCourse,
      outcomes: updatedOutcomes
    });
    setNewOutcome('');
  };

  const handleRemoveOutcome = (index: number) => {
    if (!editedCourse) return;
    
    const updatedOutcomes = [...(editedCourse.outcomes || [])];
    updatedOutcomes.splice(index, 1);
    setEditedCourse({
      ...editedCourse,
      outcomes: updatedOutcomes
    });
  };

  // Check if user can edit this course
  const canEdit = user && (user.role === 'admin' || course?.created_by === user.name);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Բեռնում...</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">Դասընթացը չի գտնվել</h2>
            <Button asChild>
              <Link to="/">Վերադառնալ գլխավոր էջ</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const displayCourse = isEditing ? editedCourse : course;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={16} className="mr-1" /> Վերադառնալ գլխավոր էջ
            </Link>
            
            {canEdit && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="default"
                      onClick={toggleEditMode}
                      className="flex items-center gap-2"
                    >
                      <Save size={16} />
                      Պահպանել
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={cancelEditing}
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      Չեղարկել
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={toggleEditMode}
                    className="flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    Խմբագրել դասընթացը
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <FadeIn>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
              {isEditing ? (
                <>
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
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">{displayCourse?.title}</h1>
                  <p className="text-lg text-muted-foreground mb-6">{displayCourse?.description}</p>
                </>
              )}
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  {isEditing ? (
                    <Input 
                      value={editedCourse?.created_by || ''}
                      onChange={(e) => setEditedCourse(prev => prev ? {...prev, created_by: e.target.value} : prev)}
                      className="w-48"
                    />
                  ) : (
                    <span>Դասախոս՝ {displayCourse?.created_by}</span>
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
                {!isEditing && user && (
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
          </FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <FadeIn delay="delay-100">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6">Դասընթացի ծրագիր</h2>
                  <div className="space-y-4">
                    {(displayCourse?.lessons || []).map((lesson, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <h3 className="font-medium">{lesson.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            {isEditing && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveLesson(index)}
                                className="text-red-500"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isEditing && (
                      <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <Input 
                            placeholder="Թեմայի անվանում" 
                            value={newLesson.title}
                            onChange={(e) => setNewLesson(prev => ({...prev, title: e.target.value}))}
                          />
                          <Input 
                            placeholder="Տևողություն (օր.՝ 3 ժամ)" 
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson(prev => ({...prev, duration: e.target.value}))}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleAddLesson}
                          disabled={!newLesson.title || !newLesson.duration}
                          className="w-full"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Ավելացնել նոր թեմա
                        </Button>
                      </div>
                    )}
                    
                    {(!displayCourse?.lessons || displayCourse.lessons.length === 0) && !isEditing && (
                      <div className="text-center p-6 border rounded-lg bg-gray-50">
                        <p className="text-muted-foreground">Դասընթացի ծրագիրը հասանելի չէ</p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay="delay-200">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6">Ինչ կսովորեք</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(displayCourse?.outcomes || []).map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check size={20} className="text-green-500 mt-0.5 shrink-0" />
                        <span className="flex-1">{outcome}</span>
                        {isEditing && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveOutcome(index)}
                            className="text-red-500 p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {isEditing && (
                      <div className="col-span-full mt-2 border rounded-lg p-4 bg-gray-50">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Ինչ կսովորեք" 
                            value={newOutcome}
                            onChange={(e) => setNewOutcome(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleAddOutcome}
                            disabled={!newOutcome}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ավելացնել
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {(!displayCourse?.outcomes || displayCourse.outcomes.length === 0) && !isEditing && (
                      <div className="col-span-2 text-center p-6 border rounded-lg bg-gray-50">
                        <p className="text-muted-foreground">Տեղեկատվությունը հասանելի չէ</p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay="delay-300">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Պահանջներ</h2>
                  <div className="space-y-2">
                    {(displayCourse?.requirements || []).map((req, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Ban size={20} className="text-red-500 mt-0.5 shrink-0" />
                        <span className="flex-1">{req}</span>
                        {isEditing && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveRequirement(index)}
                            className="text-red-500 p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    {isEditing && (
                      <div className="mt-4 border rounded-lg p-4 bg-gray-50">
                        <div className="flex gap-2">
                          <Input 
                            placeholder="Պահանջ" 
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            onClick={handleAddRequirement}
                            disabled={!newRequirement}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Ավելացնել
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {(!displayCourse?.requirements || displayCourse.requirements.length === 0) && !isEditing && (
                      <div className="text-center p-6 border rounded-lg bg-gray-50">
                        <p className="text-muted-foreground">Պահանջները սահմանված չեն</p>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <div>
              <FadeIn delay="delay-200">
                <div className="border rounded-lg p-6 sticky top-8">
                  <h3 className="text-xl font-bold mb-4">Դասընթացի մանրամասներ</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Արժեք</span>
                      {isEditing ? (
                        <Input 
                          value={editedCourse?.price || ''}
                          onChange={(e) => setEditedCourse(prev => prev ? {...prev, price: e.target.value} : prev)}
                          className="w-32 text-right"
                        />
                      ) : (
                        <span className="font-bold">{displayCourse?.price}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Տևողություն</span>
                      <span>{displayCourse?.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Դասերի քանակ</span>
                      <span>{displayCourse?.lessons ? displayCourse.lessons.length : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Հաստատություն</span>
                      {isEditing ? (
                        <Input 
                          value={editedCourse?.institution || ''}
                          onChange={(e) => setEditedCourse(prev => prev ? {...prev, institution: e.target.value} : prev)}
                          className="w-32 text-right"
                        />
                      ) : (
                        <span>{displayCourse?.institution}</span>
                      )}
                    </div>
                  </div>
                  
                  {!isEditing && user && (
                    <>
                      <Button onClick={handleApply} className="w-full mb-3">
                        Դիմել դասընթացին
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full">
                        <a href="#" className="flex items-center justify-center">
                          Ներբեռնել ծրագիրը <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />

      {course && (
        <EditProfessionalCourseDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          selectedCourse={course}
          setSelectedCourse={setCourse}
          handleEditCourse={handleEditCourse}
        />
      )}
    </div>
  );
};

export default CourseDetails;
