
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-6">Էջը չի գտնվել</h2>
      <p className="text-center text-gray-600 mb-8 max-w-md">
        Ձեր փնտրած էջը գոյություն չունի կամ հասանելի չէ: Խնդրում ենք ստուգել URL հասցեն կամ վերադառնալ գլխավոր էջ:
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/')}>
          Գլխավոր էջ
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Վերադառնալ նախորդ էջ
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
