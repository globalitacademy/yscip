
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
const Footer: React.FC = () => {
  return <footer className="border-t border-border bg-card py-12 mt-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-medium flex items-center space-x-2 mb-4">
              <span className="bg-primary text-primary-foreground rounded-md p-1 transform -rotate-6">PΘ</span>
              <span>Պրոեկտների Թեմաներ</span>
            </Link>
            <p className="text-muted-foreground max-w-md text-left">
              Ընտրված 100 ժամանակակից պրոեկտի թեմաներ՝ ոգեշնչելու ծրագրավորողներին և օգնելու նրանց ընտրել իրենց հաջորդ ծրագրավորման մարտահրավերը։
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div className="text-left">
            <h3 className="font-medium mb-4">Նավիգացիա</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Գլխավոր
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Կատեգորիաներ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Մեր մասին
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Կապ
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-left">
            <h3 className="font-medium mb-4">Ռեսուրսներ</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Ծրագրավորման ռեսուրսներ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Դիզայնի ոգեշնչում
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Ուսումնական ուղիներ
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Նորություններ
                </a>
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
    </footer>;
};
export default Footer;
