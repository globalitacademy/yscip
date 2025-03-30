
export interface ProjectTheme {
  id: number;
  title: string;
  description: string;
  image: string;  // Changed from optional to required
  category: string;
  techStack: string[];  // Changed from optional to required
  complexity?: string;
  duration?: string;
  createdBy: string;  // Changed from optional to required
  createdAt?: string;
  updatedAt?: string;  // Added this property
  tasks?: Task[];
  timeline?: TimelineEvent[];
  is_public?: boolean;
  detailedDescription?: string;
  steps?: string[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  status?: 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'assigned';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'open' | 'in progress' | 'completed';
  assignee: string;
  dueDate: string;
  assignedTo?: string;
  createdBy?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  completed?: boolean;
}

// Sample project themes
export const projectThemes: ProjectTheme[] = [
  {
    id: 1,
    title: "Հաճախորդների կառավարման համակարգ",
    description: "Մշակել հաճախորդների կառավարման համակարգ՝ հաճախորդների տվյալների պահպանման և վերլուծության համար:",
    image: "/projects/crm.jpg",
    category: "Բիզնես",
    techStack: ["React", "Node.js", "MongoDB"],
    complexity: "Միջին",
    duration: "8 շաբաթ",
    createdBy: "system", // Added a default createdBy for existing data
    detailedDescription: "Հաճախորդների կառավարման համակարգը (CRM) թույլ է տալիս բիզնեսին կառավարել հաճախորդների տվյալները, հետևել վաճառքի գործընթացին և բարելավել հաճախորդների սպասարկումը: Այս նախագիծը ներառում է հաճախորդների տվյալների պահպանում, վաճառքի ձագարի կառավարում, հաշվետվությունների ստեղծում և այլն:",
    steps: [
      "Նախագծի պահանջների վերլուծություն և հավաքագրում",
      "Տվյալների բազայի կառուցվածքի մշակում",
      "API-ների ստեղծում",
      "Օգտագործողի ինտերֆեյսի նախագծում և մշակում",
      "Թեստավորում և կատարելագործում"
    ],
    learningOutcomes: [
      "Ճարտարապետական նախագծում",
      "REST API մշակում",
      "MongoDB տվյալների բազայի կառավարում",
      "React-ով օգտագործողի ինտերֆեյսի մշակում",
      "Օգտագործողի իրավասությունների կառավարում"
    ],
    prerequisites: [
      "HTML, CSS, JavaScript հիմնական գիտելիքներ",
      "React-ի նախնական փորձ",
      "Node.js-ի հիմնական հասկացություններ",
      "MongoDB-ի հիմնական հասկացություններ"
    ],
    is_public: true
  },
  {
    id: 2,
    title: "Էլեկտրոնային առևտրի հարթակ",
    description: "Մշակել էլեկտրոնային առևտրի հարթակ՝ ապրանքների ցուցադրման և վաճառքի համար:",
    image: "/projects/ecommerce.jpg",
    category: "Էլեկտրոնային առևտուր",
    techStack: ["Vue.js", "Laravel", "MySQL"],
    complexity: "Բարդ",
    duration: "12 շաբաթ",
    createdBy: "system", // Added a default createdBy for existing data
    detailedDescription: "Էլեկտրոնային առևտրի հարթակը թույլ է տալիս վաճառողներին ցուցադրել և վաճառել իրենց ապրանքները, իսկ գնորդներին՝ դիտել, գնել և վճարել դրանց համար: Այս նախագիծը ներառում է ապրանքների կատալոգ, զամբյուղ, վճարման համակարգի ինտեգրում, օգտվողների կառավարում և այլն:",
    steps: [
      "Մրցակիցների վերլուծություն և շուկայի հետազոտություն",
      "Պահանջների վերլուծություն և հավաքագրում",
      "Տվյալների բազայի նախագծում",
      "Backend API-ների մշակում",
      "Frontend ինտերֆեյսի մշակում",
      "Վճարային համակարգերի ինտեգրում",
      "Թեստավորում և գործարկում"
    ],
    learningOutcomes: [
      "Բարդ ծրագրային համակարգերի ճարտարապետություն",
      "Վճարման համակարգերի ինտեգրում",
      "Լարավել ֆրեյմվորքի խորը ուսումնասիրություն",
      "Vue.js-ով բարդ օգտագործողի ինտերֆեյսների մշակում",
      "Տվյալների բազայի օպտիմիզացիա"
    ],
    prerequisites: [
      "PHP և Laravel-ի նախնական գիտելիքներ",
      "JavaScript և Vue.js-ի նախնական փորձ",
      "MySQL-ի հիմնական հասկացություններ",
      "REST API-ների մշակման փորձ"
    ],
    is_public: true
  },
  {
    id: 3,
    title: "Խելացի տան կառավարման համակարգ",
    description: "Մշակել IoT հիմնված խելացի տան կառավարման համակարգ:",
    image: "/projects/smarthome.jpg",
    category: "Ինտերնետ իրերի",
    techStack: ["Python", "React Native", "MQTT"],
    complexity: "Բարդ",
    duration: "14 շաբաթ",
    createdBy: "system", // Added a default createdBy for existing data
    is_public: true,
    steps: [
      "IoT սարքերի հետազոտություն և ընտրություն",
      "Համակարգի ճարտարապետության նախագծում",
      "MQTT սերվերի կարգավորում",
      "Backend ծրագրի մշակում",
      "Մոբայլ հավելվածի մշակում",
      "Թեստավորում և կատարելագործում"
    ]
  }
];
