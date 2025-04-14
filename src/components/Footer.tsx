
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Book, Info, Phone, Image, BookOpen, Layers, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card py-12 mt-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-medium flex items-center space-x-2 mb-4">
              <span className="bg-primary text-primary-foreground rounded-md p-1 transform -rotate-6">PΘ</span>
              <span>Ուսուցում Առանց Սահմանների</span>
            </Link>
            <p className="text-muted-foreground max-w-md text-left">Հարթակը միավորում է ուսանողներին, դասախոսներին և գործատուներին՝ ստեղծելով կրթության նոր ճանապարհ, որը հարմարեցված է ձեր կարիքներին։</p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
              <a href="mailto:info@learningplatform.am" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="text-left">
            <h3 className="font-medium mb-4">Նավիգացիա</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Layers className="mr-2 h-4 w-4" />
                  Գլխավոր
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Layers className="mr-2 h-4 w-4" />
                  Կատեգորիաներ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Մեր մասին
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Կապ
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Նորություններ
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="font-medium mb-4">Ռեսուրսներ</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/programming-resources" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Book className="mr-2 h-4 w-4" />
                  Ծրագրավորման ռեսուրսներ
                </Link>
              </li>
              <li>
                <Link to="/design-inspiration" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <Image className="mr-2 h-4 w-4" />
                  Դիզայնի ոգեշնչում
                </Link>
              </li>
              <li>
                <Link to="/learning-paths" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ուսումնական ուղիներ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-start">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0 text-left">
            © {new Date().getFullYear()} Պրոեկտների Թեմաներ: Բոլոր իրավունքները պաշտպանված են։
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Գաղտնիության քաղաքականություն
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Ծառայության պայմաններ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
