
import { ProjectTheme } from '../projectThemes';

export const realEstateProjects: ProjectTheme[] = [
  {
    id: 3,
    title: "Անշարժ գույքի հայտնաբերման հավելված",
    description: "Անշարժ գույքի հայտնաբերման մոբայլ հավելված՝ մոտակա տներ և բնակարաններ գտնելու համար՝ AR տեխնոլոգիայով և վիրտուալ շրջագայություններով։",
    detailedDescription: "Ստեղծեք մոբայլ հավելված, որն օգտագործում է վերադիր իրականություն (AR)՝ ցուցադրելու անշարժ գույքի ցուցակներ տարածքում, երբ օգտագործողը նկարում է շրջապատը։ Ներառեք վիրտուալ շրջագայություններ, հարմարեցված որոնումներ և նախնական հիփոթեքի հաշվարկներ։",
    complexity: "Առաջադեմ",
    techStack: ["React Native", "Firebase", "ARKit/ARCore", "Node.js", "Google Maps API", "AWS S3"],
    steps: [
      "Մշակել React Native հավելված՝ iOS և Android համար",
      "Ներդնել ARKit/ARCore՝ վերադիր իրականության փորձառության համար",
      "Մշակել Firebase հետին մաս՝ անշարժ գույքի ցուցակների համար",
      "Ինտեգրել Google Maps API՝ տեղադրության և քարտեզագրման համար",
      "Ստեղծել 360° վիրտուալ շրջագայությունների ֆունկցիոնալություն",
      "Ընդգրկել AWS S3՝ մեդիա պահպանման համար",
      "Ներդնել հիփոթեքի հաշվարկիչ և անշարժ գույքի գնահատման գործիքներ"
    ],
    category: "Անշարժ գույք",
    image: "https://images.unsplash.com/photo-1592595896616-c37162298647?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    duration: "4-6 ամիս",
    prerequisites: ["JavaScript-ի ամուր իմացություն", "React Native փորձ", "3D և AR կոնցեպտների հասկացողություն"],
    learningOutcomes: [
      "React Native-ով մոբայլ հավելվածի մշակում",
      "Firebase-ի և AWS-ի հետ աշխատանք",
      "Վերադիր իրականության (AR) ծրագրավորում",
      "Տեղադրության և տարածական տվյալների հետ աշխատանք",
      "Մասշտաբավորվող մոբայլ հավելվածների ճարտարապետություն"
    ],
    createdBy: "system",
    createdAt: new Date().toISOString()
  }
];
