
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="bg-destructive/10 p-6 rounded-lg text-center max-w-md">
        <h2 className="text-xl font-bold text-destructive mb-2">Նույնականացման սխալ</h2>
        <p className="mb-4">{message}</p>
        <Button 
          variant="default"
          onClick={onRetry || (() => window.location.href = '/login')}
        >
          Վերադառնալ մուտքի էջ
        </Button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
