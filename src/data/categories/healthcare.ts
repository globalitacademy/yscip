
import { ProjectTheme } from '../projectThemes';

export const healthcareProjects: ProjectTheme[] = [
  {
    id: 2,
    title: "Հանդիպումների ամրագրման համակարգ",
    description: "Հանդիպումների ժամանակացույցի և ամրագրման հարթակ, որը կապում է հաճախորդներին մասնագետների հետ՝ ժամանակի քլոթների հասանելիության հիման վրա։",
    detailedDescription: "Մշակեք հավելված, որը թույլ է տալիս հաճախորդներին ամրագրել ծառայություններ (ինչպիսիք են բժշկական այցեր, խորհրդատվություն, դասեր) որոշակի ժամերին, հասանելի ժամանակացույցի հիման վրա։ Ներառեք օրացույցի ինտեգրում, ավտոմատ հիշեցումներ և վճարումներ։",
    complexity: "Միջին",
    techStack: ["Vue.js", "Laravel", "MySQL", "Google Calendar API", "Twilio API"],
    steps: [
      "Մշակել Vue.js առջևի մաս՝ օրացույցի և ամրագրման ինտերֆեյսով",
      "Ստեղծել Laravel API՝ ժամանակի քլոթների և ամրագրումների կառավարման համար",
      "Ստեղծել օգտագործողի հաշիվներ ծառայություն մատուցողների և հաճախորդների համար",
      "Ինտեգրել Google Calendar API՝ սինխրոնիզացիայի համար",
      "Ներդնել էլ. փոստային և SMS հիշեցումներ Twilio-ով",
      "Ավելացնել վճարումների մշակման հնարավորություն"
    ],
    category: "Առողջապահություն և ծառայություններ",
    image: "https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
    duration: "2-3 ամիս",
    prerequisites: ["JavaScript-ի լավ իմացություն", "PHP հիմունքներ", "API-ների հետ աշխատելու փորձ"],
    learningOutcomes: [
      "Vue.js-ով առջևի մասի կառուցում",
      "Laravel-ով REST API-ների ստեղծում",
      "Երրորդ կողմի API-ների ինտեգրում",
      "Օրացույցի կառավարման ծրագրավորում",
      "Ռեալ ժամանակում ծանուցումների ներդրում"
    ],
    createdBy: "system",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
