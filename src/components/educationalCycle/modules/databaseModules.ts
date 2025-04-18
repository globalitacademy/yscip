
import { Database } from 'lucide-react';
import { EducationalModule } from '../types';

export const databaseModules: EducationalModule[] = [
  { 
    id: 7, 
    title: "Ռելյացիոն տվյալների բազաների նախագծում", 
    icon: Database, 
    status: 'not-started', 
    progress: 0,
    topics: [
      "Տվյալների բազաների ներածություն",
      "Ռելյացիոն մոդել",
      "Տվյալների բազաների տիպեր",
      "SQL ներածություն",
      "Տվյալների տիպեր SQL-ում",
      "Աղյուսակների ստեղծում (CREATE TABLE)",
      "Աղյուսակների փոփոխում (ALTER TABLE)",
      "Տվյալների ավելացում (INSERT)",
      "Տվյալների ընթերցում (SELECT)",
      "WHERE պայմաններ",
      "ORDER BY դասավորում",
      "GROUP BY խմբավորում",
      "Ագրեգացիոն ֆունկցիաներ (COUNT, SUM, AVG)",
      "JOIN օպերացիաներ",
      "Ենթահարցումներ (subqueries)",
      "Ինդեքսներ և նրանց կիրառումը",
      "Բանալիներ (Primary Key, Foreign Key)",
      "Նորմալացման կանոններ",
      "Առաջին նորմալ ձև (1NF)",
      "Երկրորդ նորմալ ձև (2NF)",
      "Երրորդ նորմալ ձև (3NF)",
      "Բոյս-Կոդ նորմալ ձև (BCNF)",
      "Տրանզակցիաներ և ACID սկզբունքներ",
      "Պահված պրոցեդուրաներ (stored procedures)",
      "Տրիգերներ",
      "Views (տեսքեր)",
      "Տվյալների անվտանգություն",
      "Օգտագործողների կառավարում",
      "Տվյալների կրկնօրինակում (replication)",
      "Վիրտուալ աղյուսակներ",
      "Օպտիմիզացման մեթոդներ",
      "Ժամանակակից ռելյացիոն ՍՈՒԲԴ-ներ (MySQL, PostgreSQL)"
    ]
  },
  { 
    id: 8, 
    title: "Ոչ Ռելյացիոն տվյալների բազաների նախագծում", 
    icon: Database, 
    status: 'not-started', 
    progress: 0,
    topics: [
      "NoSQL բազաների ներածություն",
      "NoSQL vs SQL",
      "NoSQL բազաների տիպեր",
      "Document-կողմնորոշված բազաներ",
      "MongoDB ներածություն",
      "MongoDB տվյալների մոդել",
      "JSON և BSON ձևաչափեր",
      "CRUD գործողություններ MongoDB-ում",
      "Հարցումներ և ֆիլտրացիա",
      "Ինդեքսներ MongoDB-ում",
      "Ագրեգացիոն Pipeline",
      "Հարաբերություններ NoSQL բազաներում",
      "Key-Value պահեստներ",
      "Redis ներածություն",
      "Redis տվյալների կառուցվածքներ",
      "Redis հրամաններ",
      "Column-family պահեստներ",
      "Cassandra ներածություն",
      "Գրաֆային բազաներ",
      "Neo4j ներածություն",
      "Cypher հարցման լեզու",
      "NoSQL սխեմաների նախագծում",
      "Տվյալների մասշտաբավորում (sharding)",
      "Հորիզոնական մասշտաբավորում",
      "Ուղղահայաց մասշտաբավորում",
      "CAP թեորեմ",
      "Տրանզակցիաներ NoSQL բազաներում",
      "Կոնսիստենտություն և նրա մակարդակները",
      "Նախագծման կաղապարներ (design patterns)",
      "Բազմամոդել NoSQL բազաներ",
      "NoSQL-ի ինտեգրացիան ժամանակակից հավելվածներում",
      "Իրական խնդիրներ և նրանց լուծումներ"
    ]
  }
];
