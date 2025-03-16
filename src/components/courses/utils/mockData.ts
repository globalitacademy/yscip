
import React from 'react';
import { Course } from '../types';
import { ProfessionalCourse } from '../types/ProfessionalCourse';
import { Code, BookText, BrainCircuit, Database, FileCode, Globe } from 'lucide-react';

// Mock professional courses data
export const mockProfessionalCourses: ProfessionalCourse[] = [
  {
    id: '1',
    title: 'WEB Front-End',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Code, { className: "w-16 h-16" }),
    duration: '9 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-amber-500',
    createdBy: 'Արամ Հակոբյան',
    institution: 'ՀՊՏՀ',
    description: 'Սովորեք Web կայքերի մշակում՝ օգտագործելով արդի տեխնոլոգիաներ ինչպիսիք են HTML5, CSS3, JavaScript, React և Node.js։ Այս դասընթացը նախատեսված է սկսնակների համար և կօգնի ձեզ դառնալ պրոֆեսիոնալ Front-End ծրագրավորող։',
    lessons: [
      { title: 'Ներածություն Web ծրագրավորման մեջ', duration: '3 ժամ' },
      { title: 'HTML5 հիմունքներ', duration: '6 ժամ' },
      { title: 'CSS3 և ձևավորում', duration: '8 ժամ' },
      { title: 'JavaScript հիմունքներ', duration: '12 ժամ' }
    ],
    requirements: [
      'Համակարգչային հիմնական գիտելիքներ',
      'Տրամաբանական մտածելակերպ'
    ],
    outcomes: [
      'Մշակել ամբողջական ինտերակտիվ վեբ կայքեր',
      'Աշխատել React-ով միաէջանի հավելվածների հետ'
    ]
  },
  {
    id: '2',
    title: 'Python (ML / AI)',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(BrainCircuit, { className: "w-16 h-16" }),
    duration: '7 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-blue-500',
    createdBy: 'Լիլիթ Մարտիրոսյան',
    institution: 'ԵՊՀ',
    description: 'Սովորեք Python ծրագրավորում՝ մեքենայական ուսուցման և արհեստական բանականության հիմունքներով։ Այս ինտենսիվ դասընթացը կօգնի ձեզ ծանոթանալ AI/ML ժամանակակից գործիքների հետ։',
    lessons: [
      { title: 'Python հիմունքներ', duration: '10 ժամ' },
      { title: 'Տվյալների վերլուծություն NumPy-ով և Pandas-ով', duration: '12 ժամ' },
      { title: 'Մեքենայական ուսուցման ներածություն', duration: '6 ժամ' }
    ],
    requirements: [
      'Ծրագրավորման բազային իմացություն',
      'Մաթեմատիկայի և վիճակագրության հիմունքներ'
    ],
    outcomes: [
      'Մշակել մեքենայական ուսուցման մոդելներ',
      'Վերլուծել և վիզուալիզացնել մեծ տվյալներ'
    ]
  },
  {
    id: '3',
    title: 'Java',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(BookText, { className: "w-16 h-16" }),
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-red-500',
    createdBy: 'Գարիկ Սարգսյան',
    institution: 'ՀԱՊՀ'
  },
  {
    id: '4',
    title: 'JavaScript',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(FileCode, { className: "w-16 h-16" }),
    duration: '3.5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-yellow-500',
    createdBy: 'Անի Մուրադյան',
    institution: 'ՀԱՀ'
  },
  {
    id: '5',
    title: 'PHP',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Database, { className: "w-16 h-16" }),
    duration: '5 ամիս',
    price: '58,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-purple-500',
    createdBy: 'Վահե Ղազարյան',
    institution: 'ՀՊՄՀ'
  },
  {
    id: '6',
    title: 'C#/.NET',
    subtitle: 'ԴԱՍԸՆԹԱՑ',
    icon: React.createElement(Globe, { className: "w-16 h-16" }),
    duration: '6 ամիս',
    price: '68,000 ֏',
    buttonText: 'Դիտել',
    color: 'text-green-500',
    createdBy: 'Տիգրան Դավթյան',
    institution: 'ՀՌԱՀ'
  }
];

export const mockSpecializations = ['Ծրագրավորում', 'Տվյալագիտություն', 'Դիզայն', 'Մարկետինգ', 'Բիզնես վերլուծություն'];

// Old mock data kept for reference
export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Վեբ ծրագրավորում',
    description: 'HTML, CSS, JavaScript, React և Node.js օգտագործելով վեբ հավելվածների մշակում',
    specialization: 'Ծրագրավորում',
    duration: '4 ամիս',
    modules: ['HTML/CSS հիմունքներ', 'JavaScript', 'React', 'Node.js/Express', 'Վերջնական նախագիծ'],
    createdBy: 'admin'
  },
  {
    id: '2',
    name: 'Մեքենայական ուսուցում',
    description: 'Ներածություն մեքենայական ուսուցման մեջ՝ օգտագործելով Python և TensorFlow',
    specialization: 'Տվյալագիտություն',
    duration: '6 ամիս',
    modules: ['Python հիմունքներ', 'Տվյալների վերլուծություն', 'Վիճակագրություն', 'Մեքենայական ուսուցման մոդելներ', 'Խորը ուսուցում', 'Վերջնական նախագիծ'],
    createdBy: 'admin'
  }
];
