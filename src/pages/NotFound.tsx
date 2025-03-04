
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from '@/components/Header';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="text-center max-w-md px-4">
          <div className="inline-block p-6 mb-6 rounded-full bg-primary/10">
            <p className="text-8xl font-bold text-primary">404</p>
          </div>
          <h1 className="text-3xl font-bold mb-4">Էջը չի գտնվել</h1>
          <p className="text-muted-foreground mb-8">
            Էջը, որը փնտրում եք, գոյություն չունի կամ տեղափոխվել է այլ վայր։
          </p>
          <Link 
            to="/" 
            className="inline-flex px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-primary/20"
          >
            Վերադառնալ Գլխավոր էջ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
