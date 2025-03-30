
import React from 'react';
import { 
  Book, 
  Code, 
  Globe, 
  Database, 
  PieChart, 
  LineChart, 
  Network, 
  Brain, 
  Laptop, 
  Smartphone, 
  Server, 
  Cloud, 
  Blocks, 
  FileCode, 
  Lightbulb,
  Atom,
  Bot,
  Binary,
  BookOpen,
  CreditCard,
  BarChart,
  Lock
} from 'lucide-react';

export type IconName = 'book' | 'code' | 'globe' | 'database' | 'pieChart' | 'lineChart' | 
  'network' | 'brain' | 'laptop' | 'smartphone' | 'server' | 'cloud' | 'blocks' | 
  'fileCode' | 'lightbulb' | 'atom' | 'bot' | 'binary' | 'bookOpen' | 'creditCard' | 
  'barChart' | 'lock';

export const iconComponents: Record<IconName, React.ReactNode> = {
  book: <Book className="w-12 h-12" />,
  code: <Code className="w-12 h-12" />,
  globe: <Globe className="w-12 h-12" />,
  database: <Database className="w-12 h-12" />,
  pieChart: <PieChart className="w-12 h-12" />,
  lineChart: <LineChart className="w-12 h-12" />,
  network: <Network className="w-12 h-12" />,
  brain: <Brain className="w-12 h-12" />,
  laptop: <Laptop className="w-12 h-12" />,
  smartphone: <Smartphone className="w-12 h-12" />,
  server: <Server className="w-12 h-12" />,
  cloud: <Cloud className="w-12 h-12" />,
  blocks: <Blocks className="w-12 h-12" />,
  fileCode: <FileCode className="w-12 h-12" />,
  lightbulb: <Lightbulb className="w-12 h-12" />,
  atom: <Atom className="w-12 h-12" />,
  bot: <Bot className="w-12 h-12" />,
  binary: <Binary className="w-12 h-12" />,
  bookOpen: <BookOpen className="w-12 h-12" />,
  creditCard: <CreditCard className="w-12 h-12" />,
  barChart: <BarChart className="w-12 h-12" />,
  lock: <Lock className="w-12 h-12" />
};

export const convertIconNameToComponent = (iconName?: string): React.ReactNode => {
  if (!iconName || !(iconName as IconName in iconComponents)) {
    return iconComponents.book;
  }
  
  return iconComponents[iconName as IconName];
};
