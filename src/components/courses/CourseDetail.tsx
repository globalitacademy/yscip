
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfessionalCourse } from './types/ProfessionalCourse';
import { getCourseById, getAllCoursesFromSupabase } from './utils/courseUtils';
import { toast } from 'sonner';
import { Book } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ProfessionalCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const courseData = await getCourseById(id);
        if (courseData) {
          setCourse(courseData);
        } else {
          toast.error('Դասընթացը չհաջողվեց գտնել');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Դասընթացի բեռնման ժամանակ սխալ է տեղի ունեցել');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Բեռնում...</div>;
  }

  if (!course) {
    return <div className="flex justify-center items-center min-h-screen">Դասընթացը չի գտնվել</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <div className="mr-4">
            {course.icon || <Book className="w-12 h-12" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-gray-600">{course.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Նկարագրություն</h2>
              <p className="text-gray-700">{course.description || 'Նկարագրություն չկա'}</p>
            </div>

            {course.lessons && course.lessons.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Դասեր</h2>
                <ul className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <li key={index} className="p-3 bg-gray-50 rounded flex justify-between">
                      <span>{lesson.title}</span>
                      <span className="text-gray-600">{lesson.duration}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.outcomes && course.outcomes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Ակնկալվող արդյունքներ</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {course.outcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>
            )}

            {course.requirements && course.requirements.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Պահանջներ</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {course.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4">
              <h3 className="font-semibold">Տևողություն</h3>
              <p>{course.duration}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Արժեք</h3>
              <p>{course.price}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Հաստատություն</h3>
              <p>{course.institution}</p>
            </div>
            <button className={`w-full py-2 px-4 rounded ${course.color?.replace('text', 'bg')} text-white font-semibold mt-4`}>
              {course.buttonText || 'Դիմել'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
