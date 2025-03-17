
import { ProfessionalCourse } from '../types/ProfessionalCourse';

export const getCourseById = (id: string): ProfessionalCourse | undefined => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      return courses.find(course => course.id === id);
    }
  } catch (error) {
    console.error('Error fetching course:', error);
  }
  
  const mockCourses = [
    {
      id: '1',
      title: 'WEB Front-End',
      subtitle: 'ԴԱՍԸՆԹԱՑ',
      description: 'Սովորեք Web կայքերի մշակում՝ օգտագործելով արդի տեխնոլոգիաներ ինչպիսիք են HTML5, CSS3, JavaScript, React և Node.js։ Այս դասընթացը նախատեսված է սկսնակների համար և կօգնի ձեզ դառնալ պրոֆեսիոնալ Front-End ծրագրավորող։',
      duration: '9 ամիս',
      price: '58,000 ֏',
      createdBy: 'Արամ Հակոբյան',
      institution: 'ՀՊՏՀ',
      color: 'text-amber-500',
      buttonText: 'Դիտել',
      icon: null,
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
      institution: 'ԵՊՀ',
      color: 'text-blue-500',
      buttonText: 'Դիտել',
      icon: null,
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
    }
  ];
  
  return mockCourses.find(course => course.id === id) as ProfessionalCourse;
};

export const saveCourseChanges = (course: ProfessionalCourse): boolean => {
  try {
    const storedCourses = localStorage.getItem('professionalCourses');
    if (storedCourses) {
      const courses: ProfessionalCourse[] = JSON.parse(storedCourses);
      const updatedCourses = courses.map(c => 
        c.id === course.id ? course : c
      );
      localStorage.setItem('professionalCourses', JSON.stringify(updatedCourses));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating course:', error);
    return false;
  }
};
