
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/components/courses/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, BookOpen, User, School } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        setCourse({
          id: data.id,
          title: data.title,
          description: data.description || '',
          specialization: data.specialization,
          duration: data.duration,
          modules: data.modules || [],
          createdBy: data.created_by || 'unknown',
          color: data.color,
          button_text: data.button_text,
          icon_name: data.icon_name,
          subtitle: data.subtitle,
          price: data.price,
          image_url: data.image_url,
          institution: data.institution,
          is_persistent: data.is_persistent
        });
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Չհաջողվեց բեռնել դասընթացի մանրամասները');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Խնդրում ենք մուտք գործել հաշիվ՝ դասընթացին գրանցվելու համար');
      navigate('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: id,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Դուք հաջողությամբ գրանցվել եք դասընթացին');
    } catch (err) {
      console.error('Error enrolling in course:', err);
      toast.error('Չհաջողվեց գրանցվել դասընթացին');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-56" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-72 w-full rounded-lg" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Header />
        <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Սխալ</h1>
          <p className="mb-8">{error || 'Դասընթաց չի գտնվել'}</p>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Վերադառնալ
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
          onClick={handleGoBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Վերադառնալ
        </Button>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-bold">{course.title}</CardTitle>
                  <CardDescription className="mt-2 text-lg">{course.subtitle}</CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {course.specialization && (
                      <Badge variant="outline" className="px-3 py-1 font-normal">
                        {course.specialization}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="px-3 py-1 font-normal">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration} ամիս
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{course.price} ֏</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6 space-y-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-3">Դասընթացի նկարագրությունը</h3>
                <p className="whitespace-pre-line">{course.description}</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <div className="flex-1">
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium flex items-center mb-3">
                        <BookOpen className="h-5 w-5 mr-2 text-amber-500" />
                        Դասընթացի մանրամասներ
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <School className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Հաստատություն: {course.institution || 'Qolej'}</span>
                        </li>
                        <li className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>Դասավանդող: {course.createdBy === 'admin' ? 'Qolej թիմ' : 'Դասախոս'}</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex-1">
                  <Card className="h-full">
                    <CardContent className="p-4 flex flex-col h-full justify-between">
                      <div>
                        <h3 className="font-medium mb-3">Գրանցվելու համար</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Գրանցվեք հիմա և սկսեք ձեր ուսումնական ճանապարհորդությունը։
                        </p>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleEnroll}
                      >
                        Գրանցվել դասընթացին
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CourseDetailsPage;
