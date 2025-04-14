
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/hooks/use-theme';

const About: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { theme } = useTheme();
  
  const teamMembers = [
    {
      name: 'Անի Սարգսյան',
      role: 'Հիմնադիր և գլխավոր տնօրեն',
      bio: 'Ավելի քան 10 տարվա փորձ ՏՏ ոլորտում և կրթության համակարգում: Նախկինում աշխատել է մի շարք հաջողված ստարտափերում որպես կրթական ծրագրերի ղեկավար:',
    },
    {
      name: 'Դավիթ Հովհաննիսյան',
      role: 'Տեխնիկական տնօրեն',
      bio: 'Փորձառու ծրագրավորող և մենթոր՝ մասնագիտացած վեբ և մոբայլ հավելվածների մշակման մեջ: Շուրջ 8 տարվա փորձ ունի թիմի ղեկավարման և մենթորության ոլորտում:',
    },
    {
      name: 'Մարիա Գրիգորյան',
      role: 'Կրթական ծրագրերի համակարգող',
      bio: 'Մասնագիտությամբ մանկավարժ, ունի փորձ կրթական ծրագրերի մշակման և իրականացման ոլորտում: Հետաքրքրված է կրթության նորարարական մեթոդներով:',
    },
  ];

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Մեր մասին</h1>
        
        <section className="mb-12 max-w-3xl">
          <h2 className="text-2xl font-medium mb-4">Մեր առաքելությունը</h2>
          <p className="text-muted-foreground mb-4">
            «Ուսուցում Առանց Սահմանների» նախաձեռնությունը ստեղծվել է 2022 թվականին՝ նպատակ ունենալով հասանելի դարձնել որակյալ կրթությունը բոլորի համար։ 
            Մենք հավատում ենք, որ կրթությունը պետք է լինի հասանելի և մատչելի յուրաքանչյուրի համար՝ անկախ նրա աշխարհագրական դիրքից, սոցիալական կարգավիճակից կամ ֆինանսական հնարավորություններից։
          </p>
          <p className="text-muted-foreground">
            Մեր հարթակը միավորում է ուսանողներին, դասախոսներին և գործատուներին՝ ստեղծելով կրթության նոր ճանապարհ, որը հարմարեցված է յուրաքանչյուր մասնակցի կարիքներին։
          </p>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-medium mb-4">Մեր թիմը</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <Separator className="my-8" />
        
        <section className="mb-12 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-medium mb-4">Մեր արժեքները</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li>
                <span className="font-medium">Հասանելիություն</span> - Կրթությունը պետք է լինի հասանելի բոլորին
              </li>
              <li>
                <span className="font-medium">Որակ</span> - Մենք չենք զիջում որակը և ձգտում ենք գերազանցության
              </li>
              <li>
                <span className="font-medium">Համագործակցություն</span> - Հավատում ենք, որ միասին ավելի ուժեղ ենք
              </li>
              <li>
                <span className="font-medium">Նորարարություն</span> - Մշտապես փնտրում ենք կրթության նոր և ավելի արդյունավետ մեթոդներ
              </li>
              <li>
                <span className="font-medium">Ներառականություն</span> - Գնահատում ենք տարբերությունները և խրախուսում բազմազանությունը
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-medium mb-4">Մեր պատմությունը</h2>
            <p className="text-muted-foreground mb-3">
              Մեր նախաձեռնությունը սկիզբ է առել մի խումբ դասախոսների և ՏՏ ոլորտի մասնագետների համագործակցությամբ, ովքեր տեսան հայկական կրթական համակարգի բացերը և որոշեցին գործնական քայլեր ձեռնարկել իրավիճակի բարելավման ուղղությամբ։
            </p>
            <p className="text-muted-foreground mb-3">
              Սկսելով որպես փոքր համայնքային նախաձեռնություն, այժմ մենք աճել ենք և դարձել ազգային մակարդակով ճանաչված հարթակ, որը համագործակցում է բազմաթիվ համալսարանների և ընկերությունների հետ։
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
