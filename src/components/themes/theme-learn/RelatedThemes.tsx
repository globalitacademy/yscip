
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Theme } from '../hooks/useThemeDetail';

interface RelatedThemesProps {
  relatedThemes: Theme[];
}

const RelatedThemes: React.FC<RelatedThemesProps> = ({ relatedThemes }) => {
  if (relatedThemes.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Կապակցված թեմաներ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedThemes.map((theme) => (
            <Card key={theme.id} className="group hover:shadow-md transition-shadow">
              {theme.image_url && (
                <div className="h-32 overflow-hidden rounded-t-lg">
                  <img 
                    src={theme.image_url} 
                    alt={theme.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="space-y-2">
                  {theme.category && (
                    <Badge variant="outline" className="text-xs">
                      {theme.category}
                    </Badge>
                  )}
                  <h3 className="font-medium text-sm line-clamp-2">
                    <Link to={`/themes/${theme.id}`} className="hover:text-primary">
                      {theme.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {theme.summary}
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to={`/themes/${theme.id}`} className="flex items-center gap-1">
                      Ուսումնասիրել
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedThemes;
