
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/use-theme';

interface CourseDetailSkeletonProps {
  type: 'loading' | 'not-found';
}

const CourseDetailSkeleton: React.FC<CourseDetailSkeletonProps> = ({ type }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  if (type === 'loading') {
    return (
      <div className={`flex justify-center items-center min-h-[calc(100vh-100px)] ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="text-center">
          <Loader2 className={`w-12 h-12 animate-spin mx-auto mb-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Բեռնում...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex justify-center items-center min-h-[calc(100vh-100px)] ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
      <div className={`text-center p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800/80 shadow-lg' : 'bg-white shadow-md'}`}>
        <h1 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Դասընթացը չի գտնվել</h1>
        <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Հնարավոր է դասընթացը ջնջվել է կամ հասանելի չէ այս պահին
        </p>
        <Button 
          onClick={() => navigate('/courses')}
          className={theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Վերադառնալ դասընթացների էջ
        </Button>
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;
