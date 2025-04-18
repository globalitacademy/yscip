
import { Layout, Monitor } from 'lucide-react';
import { EducationalModule } from '../types';

export const webDevelopmentModules: EducationalModule[] = [
  { 
    id: 5, 
    title: "Ստատրիկ վեբ կայքերի նախագծում", 
    icon: Layout, 
    status: 'not-started', 
    progress: 0,
    topics: [
      "HTML5 ներածություն և հիմնական կառուցվածք",
      "Վեբ էջի կառուցվածք և թեգեր",
      "Վերնագրեր և պարագրաֆներ",
      "Հղումներ և խարիսխներ",
      "Նկարներ և մուլտիմեդիա",
      "Ցուցակներ (ordered, unordered, definition)",
      "Աղյուսակներ և նրանց կառուցվածքը",
      "Ձևեր և մուտքի դաշտեր",
      "HTML5 սեմանտիկ էլեմենտներ",
      "CSS3 հիմունքներ",
      "Ընտրիչներ (selector)",
      "Գույներ և ֆոներ",
      "Տեքստի ձևավորում",
      "Box մոդել (margin, padding, border)",
      "Դիրքավորում (position)",
      "Float և clear հատկություններ",
      "Flexbox մոդել",
      "Grid մոդել",
      "Անիմացիաներ և անցումներ",
      "CSS փոխակերպումներ (transformations)",
      "Media հարցումներ",
      "Մոբայլ նախագծում (mobile first)",
      "Ադապտիվ և responsive դիզայն",
      "CSS Frameworks (Bootstrap, Tailwind)",
      "Վեբ տառատեսակներ և իկոնաներ",
      "Վեբ մատչելիություն (accessibility)",
      "SEO հիմունքներ",
      "Կայքի օպտիմիզացիա",
      "Վեբ չափորոշիչներ",
      "Կայքի հոսթինգ և տեղադրում",
      "Դոմեյն անուններ",
      "Git և վերսիաների վերահսկում"
    ]
  },
  { 
    id: 9, 
    title: "Դինաﬕկ վեբ կայքերի նախագծում", 
    icon: Monitor, 
    status: 'not-started', 
    progress: 0,
    topics: [
      "Դինամիկ վեբ հավելվածների հիմունքներ",
      "Client-Server արխիտեկտուրա",
      "HTTP պրոտոկոլ և նրա մեթոդները",
      "Node.js էկոհամակարգ",
      "Node.js մոդուլներ և npm",
      "Express.js framework",
      "Մարշրուտիզացիա (routing)",
      "Middleware-ի կոնցեպցիա",
      "Տեմպլեյտների շարժիչներ (EJS, Pug)",
      "MVC արխիտեկտուրա",
      "ORM գրադարաններ (Sequelize, TypeORM)",
      "Տվյալների բազաների ինտեգրացիա",
      "REST API նախագծում",
      "API ռեսուրսներ և endpoint-ներ",
      "API վերսիավորում",
      "Օգտագործողների ավթենտիֆիկացիա",
      "JWT (JSON Web Token)",
      "OAuth ինտեգրացիա",
      "CRUD գործողություններ",
      "Ֆայլերի վերբեռնում",
      "Պատկերների մշակում",
      "Web Sockets և ռեալ ժամանակով հաղորդակցություն",
      "Socket.io գրադարան",
      "Միկրոսերվիսային արխիտեկտուրա",
      "API Gateway",
      "Տվյալների պահպանում (caching)",
      "Redis որպես քեշ",
      "Ասինխրոն հարցումների կառավարում",
      "Տեսթավորում (Mocha, Jest)",
      "CI/CD ինտեգրացիա",
      "Դոկերիզացիա և կոնտեյներներ",
      "Ծրագրի մոնիտորինգ և լոգավորում"
    ]
  }
];
