
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Theme } from '../hooks/useThemeDetail';

interface RelatedThemesProps {
  relatedThemes: Theme[];
}

const RelatedThemes: React.FC<RelatedThemesProps> = ({ relatedThemes }) => {
  return (
    <div className="mt-12">
      <Separator className="mb-8" />
      <h2 className="text-2xl font-bold mb-6">Նմանատիպ թեմաներ</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedThemes.map((relatedTheme) => (
          <Card key={relatedTheme.id} className="overflow-hidden">
            {relatedTheme.image_url && (
              <div className="h-36 overflow-hidden">
                <img 
                  src={relatedTheme.image_url} 
                  alt={relatedTheme.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">
                <Link to={`/themes/${relatedTheme.id}`} className="hover:text-primary">
                  {relatedTheme.title}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {relatedTheme.summary}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedThemes;
