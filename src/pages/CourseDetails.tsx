import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Clock, Ban, Check, ExternalLink } from 'lucide-react';
import { FadeIn } from '@/components/LocalTransitions';
import { toast } from 'sonner';

// This is a mock of the course data which would ideally come from a DB
const getCourseById = (id: string) => {
  const courses = [
    {
      id: '1',
      title: 'WEB Front-End',
      subtitle: 'ԴԱՍԸՆԹԱՑ',
      description: 'Սովորեք Web կայքերի մշակում՝ օգտագործելով արդի տեխնոլոգիաներ ինչպիսիք են HTML5, CSS3, JavaScript, React և Node.js։ Այս դասընթացը նախատեսված է սկսնակների համար և կօգնի ձեզ դառնալ պրոֆեսիոնալ Front-End ծրագրավորող։',
      duration: '9 ամիս',
      price: '58,000 ֏',
      createdBy: 'Արամ Հակոբյան',
      lessons: [
        { title: 'Ներածություն Web ծրագրավորման մեջ', duration: '3 ժամ' },
        { title: 'HTML5 հիմունքներ', duration: '6 ժամ' },
        { title: 'CSS3 և ձևավորում', duration: '8 ժամ' },
        { title: 'JavaScript հիմունքներ', duration: '12 ժամ' },
        { title: 'DOM մանիպուլյացիա', duration: '6 ժամ' },
        { title: 'React հիմունքներ', duration: '15 ժամ' },
        { title: 'React Router և State Management', duration: '10 ժամ' },
        { title: 'Node.js և Express հիմունքներ', duration: '8 ժամ' },
        { title: 'RESTful API-ներ', duration: '6 ժամ' },
        { title: 'Ավարտական նախագիծ', duration: '25 ժամ' }
      ],
      requirements: [
        'Համակարգչային հիմնական գիտելիքներ',
        'Տրամաբանական մտածելակերպ',
        'Անգլերենի բազային իմացություն'
      ],
      outcomes: [
        'Մշակել ամբողջական ինտերակտիվ վեբ կայքեր',
        'Աշխատել React-ով միաէջանի հավելվածների հետ',
        'Ստեղծել հետին մասի API-ներ Node.js-ով',
        'Աշխատել թիմում որպես Front-End ծրագրավորող'
      ]
    },
    {
      id: '2',
      title: 'Python (ML / AI)',
      subtitle: 'ԴԱՍԸՆԹԱՑ',
      description: 'Սովորեք Python ծրագրավորում՝ մեքենայական ուսուցման և արհեստական բանականության հիմունքներով։ Այս ինտենսիվ դասընթացը կօգնի ձեզ ծանոթանալ AI/ML ժամանակակից գործիքների հետ։',
      duration: '7 ամիս',
      price: '68,000 ֏',
      createdBy: 'Լիլիթ Մարտիրոսյան',
      lessons: [
        { title: 'Python հիմունքներ', duration: '10 ժամ' },
        { title: 'Տվյալների վերլուծություն NumPy-ով և Pandas-ով', duration: '12 ժամ' },
        { title: 'Տվյալների վիզուալիզացիա Matplotlib-ով և Seaborn-ով', duration: '8 ժամ' },
        { title: 'Մեքենայական ուսուցման ներածություն', duration: '6 ժամ' },
        { title: 'Վերահսկվող ուսուցում՝ ռեգրեսիա և դասակարգում', duration: '14 ժամ' },
        { title: 'Չվերահսկվող ուսուցում', duration: '10 ժամ' },
        { title: 'Խորը ուսուցման հիմունքներ և նեյրոնային ցանցեր', duration: '15 ժամ' },
        { title: 'Բնական լեզվի մշակում (NLP)', duration: '12 ժամ' },
        { title: 'Ավարտական նախագիծ', duration: '20 ժամ' }
      ],
      requirements: [
        'Ծրագրավորման բազային իմացություն',
        'Մաթեմատիկայի և վիճակագրության հիմունքներ',
        'Անգլերենի լավ իմացություն'
      ],
      outcomes: [
        'Մշակել մեքենայական ուսուցման մոդելներ',
        'Վերլուծել և վիզուալիզացնել մեծ տվյալներ',
        'Իրականացնել խորը ուսուցման ալգորիթմներ',
        'Ստեղծել AI հիմքով հավելվածներ'
      ]
    },
    // Other courses would be added here in a real application
  ];

  return courses.find(course => course.id === id);
};

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const courseData = getCourseById(id);
      setCourse(courseData);
      setLoading(false);
    }
  }, [id]);

  const handleApply = () => {
    toast.success("Դիմումը հաջողությամբ ուղարկված է", {
      description: "Մենք կապ կհաստատենք ձեզ հետ",
      duration: 5000,
    });
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground mb-6 hover:text-primary transition-colors">
            <ArrowLeft size={16} className="mr-1" /> Վերադառնալ գլխավոր էջ
          </Link>
          
          <FadeIn>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-blue-500" />
                  <span>Դասախոս՝ {course.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  <span>Տևողություն՝ {course.duration}</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button onClick={handleApply} size="lg">
                  Դիմել դասընթացին
                </Button>
                <Button variant="outline" size="lg">
                  Կապ հաստատել
                </Button>
              </div>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <FadeIn delay="delay-100">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6">Դասընթացի ծրագիր</h2>
                  <div className="space-y-4">
                    {course.lessons.map((lesson: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                              {index + 1}
                            </div>
                            <h3 className="font-medium">{lesson.title}</h3>
                          </div>
                          <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay="delay-200">
                <div className="mb-10">
                  <h2 className="text-2xl font-bold mb-6">Ինչ կսովորեք</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.outcomes.map((outcome: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check size={20} className="text-green-500 mt-0.5 shrink-0" />
                        <span>{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay="delay-300">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Պահանջներ</h2>
                  <div className="space-y-2">
                    {course.requirements.map((req: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Ban size={20} className="text-red-500 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
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
                      <span className="font-bold">{course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Տևողություն</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Դասերի քանակ</span>
                      <span>{course.lessons.length}</span>
                    </div>
                  </div>
                  
                  <Button onClick={handleApply} className="w-full mb-3">
                    Դիմել դասընթացին
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <a href="#" className="flex items-center justify-center">
                      Ներբեռնել ծրագիրը <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CourseDetails;
