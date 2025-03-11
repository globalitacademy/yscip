
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  buttonText: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon, href, buttonText }) => (
  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
    <CardHeader>
      <div className="rounded-lg p-3 bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <CardTitle className="text-xl mb-2">{title}</CardTitle>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow" />
    <CardFooter>
      <Link to={href} className="w-full">
        <Button 
          className="w-full group/button" 
          variant="default"
        >
          <span className="flex-1">{buttonText}</span>
          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/button:translate-x-1" />
        </Button>
      </Link>
    </CardFooter>
  </Card>
);

export default ActionCard;
