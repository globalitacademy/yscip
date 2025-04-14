
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';

const News: React.FC = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { theme } = useTheme();
  
  const news = [
    {
      id: 1,
      title: "Նոր դասընթացներ ծրագրավորման ոլորտում",
      excerpt: "Հայտարարում ենք մի շարք նոր դասընթացների մեկնարկ, որոնք նվիրված են արդի տեխնոլոգիաներին և մասնագիտություններին։",
      content: "Մենք ուրախ ենք հայտարարել, որ 2025 թվականին կմեկնարկեն նոր դասընթացներ մի շարք պահանջված ուղղություններով, ներառյալ Front-end ծրագրավորում (React.js), Back-end ծրագրավորում (Node.js), և Machine Learning։ Դասընթացները հնարավորություն կտան ձեռք բերել ժամանակակից հմտություններ, որոնք պահանջված են աշխատաշուկայում։",
      date: "2025-03-28",
      category: "Դասընթացներ",
      image: "https://placehold.co/600x400",
      featured: true
    },
    {
      id: 2,
      title: "Համագործակցություն տեխնոլոգիական ընկերությունների հետ",
      excerpt: "Մեր հարթակը սկսել է համագործակցություն մի շարք առաջատար տեխնոլոգիական ընկերությունների հետ։",
      content: "Ուրախ ենք տեղեկացնել, որ մեր հարթակը համաձայնության է եկել մի շարք հայկական և միջազգային տեխնոլոգիական ընկերությունների հետ, ինչը հնարավորություն կտա մեր ուսանողներին մասնակցել պրակտիկ ծրագրերի, ինչպես նաև ստանալ անմիջական աշխատանքի առաջարկներ դասընթացների հաջող ավարտից հետո։",
      date: "2025-03-15",
      category: "Համագործակցություն",
      image: "https://placehold.co/600x400",
      featured: true
    },
    {
      id: 3,
      title: "Ամառային դպրոց տեխնոլոգիաների ոլորտում",
      excerpt: "Հայտարարում ենք «Տեխնոլոգիական ամառ» ծրագրի մեկնարկի մասին, որը նախատեսված է դպրոցականների համար։",
      content: "Այս տարի առաջին անգամ կազմակերպվելու է «Տեխնոլոգիական ամառ» ծրագիրը, որը նախատեսված է 12-16 տարեկան դպրոցականների համար։ Ծրագրի շրջանակում մասնակիցները կծանոթանան ծրագրավորման հիմունքներին, ռոբոտաշինությանը և արհեստական բանականության տարրերին։",
      date: "2025-03-10",
      category: "Կրթություն",
      image: "https://placehold.co/600x400",
      featured: false
    },
    {
      id: 4,
      title: "Նոր հնարավորություններ շրջանավարտների համար",
      excerpt: "Մեր շրջանավարտների համար նոր հնարավորություններ մասնագիտական աճի համար։",
      content: "Մեր հարթակը նախաձեռնել է նոր ծրագիր, որի շրջանակում շրջանավարտները կունենան հնարավորություն մասնակցելու մասնագիտական զարգացման դասընթացների, ինչպես նաև ստանալ անհատական խորհրդատվություն կարիերայի առաջխաղացման հարցերով։",
      date: "2025-02-25",
      category: "Կարիերա",
      image: "https://placehold.co/600x400",
      featured: false
    },
    {
      id: 5,
      title: "Տեխնոլոգիական ֆորում Երևանում",
      excerpt: "Մայիսին Երևանում կկայանա տեխնոլոգիական ֆորում, որին կմասնակցեն միջազգային փորձագետներ։",
      content: "Այս տարվա մայիսին Երևանում կկայանա «Տեխնոլոգիաներ հանուն ապագայի» խորագրով միջազգային ֆորումը, որին կմասնակցեն ՏՏ ոլորտի առաջատար մասնագետներ աշխարհի տարբեր երկրներից։ Միջոցառման ընթացքում կքննարկվեն ոլորտի արդի զարգացումները և միտումները։",
      date: "2025-02-10",
      category: "Միջոցառումներ",
      image: "https://placehold.co/600x400",
      featured: false
    },
  ];

  const featuredNews = news.filter(item => item.featured);
  const regularNews = news.filter(item => !item.featured);

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Նորություններ</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          Հետևեք մեր վերջին նորություններին, իրադարձություններին և հայտարարություններին՝ տեղեկացված մնալու համար։
        </p>
        
        {featuredNews.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-medium mb-6">Գլխավոր նորություններ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredNews.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="h-60 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                      <Badge>{item.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Կարդալ ավելին</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        <section>
          <h2 className="text-2xl font-medium mb-6">Բոլոր նորությունները</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {regularNews.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">{item.category}</Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-muted-foreground text-sm line-clamp-3">{item.excerpt}</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="p-0 h-auto">Կարդալ ավելին</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default News;
