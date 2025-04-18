
import { ProjectTheme } from '../projectThemes';

export const ecommerceProjects: ProjectTheme[] = [
  {
    id: 1,
    title: "Էլեկտրոնային առևտրի հավելված",
    description: "Ամբողջական էլեկտրոնային առևտրի հարթակ՝ ապրանքների կատալոգով, զամբյուղով, վճարումների մշակմամբ և պատվերների կառավարմամբ։",
    detailedDescription: "Ստեղծեք վեբ հավելված, որում օգտագործողները կարող են դիտել ապրանքները, ավելացնել դրանք զամբյուղ և կատարել գնումներ։ Ներառեք որոնման և ֆիլտրման ֆունկցիաներ, օգտագործողի հաշիվներ և վճարումների ինտեգրում։",
    complexity: "Միջին",
    techStack: ["React", "Node.js", "Express", "MongoDB", "Stripe API"],
    steps: [
      "Ստեղծել React-ով ինտերֆեյս՝ Tailwind CSS-ի կիրառմամբ",
      "Մշակել Node.js հետին մաս՝ Express-ով և MongoDB-ով",
      "Ստեղծել ապրանքների կատալոգ և զամբյուղի ֆունկցիոնալություն",
      "Ինտեգրել Stripe՝ վճարումների մշակման համար",
      "Ավելացնել օգտագործողի նույնականացում և պրոֆիլի կառավարում",
      "Մշակել պատվերների և առաքման հետևում"
    ],
    category: "Էլեկտրոնային առևտուր",
    image: "https://images.unsplash.com/photo-1561715276-a2d087060f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    duration: "3-4 ամիս",
    prerequisites: ["JavaScript-ի միջին իմացություն", "React հիմունքներ", "API-ների հետ աշխատելու փորձ"],
    learningOutcomes: [
      "Full-stack վեբ հավելվածի ստեղծում",
      "REST API-ների նախագծում և մշակում",
      "Վճարումների մշակման ինտեգրում",
      "Օգտագործողի նույնականացման ներդրում",
      "Ծրագրի կառավարում պրոդուկտային միջավայրում"
    ],
    createdBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
