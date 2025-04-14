
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const DesignInspiration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const designResources = [
    {
      id: 1,
      title: "Հայկական օրնամենտներ",
      category: "Գրաֆիկական դիզայն",
      imageUrl: "https://placehold.co/600x400",
      description: "Ավանդական հայկական օրնամենտների հավաքածու, որը կարող է օգտագործվել տպագրական և վեբ նախագծերում",
      tags: ["Ազգային", "Օրնամենտներ", "Գրաֆիկա"]
    },
    {
      id: 2,
      title: "UX դիզայնի սկզբունքներ",
      category: "UX/UI դիզայն",
      imageUrl: "https://placehold.co/600x400",
      description: "Օգտագործողի փորձառության դիզայնի հիմնական սկզբունքներ և լավագույն փորձի օրինակներ",
      tags: ["UX", "Դիզայն", "Հարմարավետություն"]
    },
    {
      id: 3,
      title: "Արվեստ և տեխնոլոգիաներ",
      category: "Թվային արվեստ",
      imageUrl: "https://placehold.co/600x400",
      description: "Ժամանակակից թվային արվեստի նմուշներ և ոգեշնչման աղբյուրներ",
      tags: ["Արվեստ", "Թվային", "Ժամանակակից"]
    },
    {
      id: 4,
      title: "Վեբ դիզայնի տրենդներ 2025",
      category: "Վեբ դիզայն",
      imageUrl: "https://placehold.co/600x400",
      description: "2025 թվականի վեբ դիզայնի գլխավոր տրենդներ և միտումներ",
      tags: ["Վեբ", "Տրենդներ", "2025"]
    },
    {
      id: 5,
      title: "Մինիմալիստական ինտերֆեյսներ",
      category: "UI դիզայն",
      imageUrl: "https://placehold.co/600x400",
      description: "Մինիմալիստական դիզայնի սկզբունքներ և դրանց կիրառություն ՕԻ-ում",
      tags: ["Մինիմալիզմ", "UI", "Պարզություն"]
    },
    {
      id: 6,
      title: "Գույների տեսություն",
      category: "Գրաֆիկական դիզայն",
      imageUrl: "https://placehold.co/600x400",
      description: "Գույների ընտրության տեսություն և պրակտիկա տարբեր նախագծերում",
      tags: ["Գույներ", "Տեսություն", "Պալիտրաներ"]
    },
  ];

  // Filter designs based on search term
  const filteredDesigns = designResources.filter(design => 
    design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    design.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`flex flex-col min-h-screen ${theme === 'dark' ? 'bg-background text-foreground' : 'bg-white text-gray-900'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Դիզայնի ոգեշնչում</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          Հավաքածու դիզայնի և ստեղծագործության ոլորտից, որը կօգնի ոգեշնչվել և զարգացնել ձեր ստեղծագործական հմտությունները։
          Այստեղ կգտնեք տարբեր ոճերի, ուղղությունների և ժանրերի աշխատանքներ։
        </p>
        
        <div className="mb-8 max-w-md relative">
          <Input
            placeholder="Որոնել ոգեշնչման նյութեր..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Search className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => (
            <Card key={design.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={design.imageUrl} 
                  alt={design.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{design.title}</h3>
                  <Badge variant="outline">{design.category}</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{design.description}</p>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-secondary/30">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="#" className="inline-flex items-center">
                    Դիտել մանրամասներ <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredDesigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Որոնման արդյունքներ չեն գտնվել։ Փորձեք այլ բառով որոնել։</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default DesignInspiration;
