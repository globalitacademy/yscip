
import React, { ErrorInfo, ReactNode, Component } from 'react';
import { CourseProvider } from '@/components/courses/CourseContext';
import AllCoursesView from '@/components/courses/AllCoursesView';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Error Boundary component to catch and display errors in the course page
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in courses page:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Սխալ դասընթացների էջում</AlertTitle>
          <AlertDescription>
            Դասընթացների էջում խնդիր է առաջացել: Խնդրում ենք թարմացնել էջը կամ կապվել մեզ հետ:
            {this.state.error && (
              <div className="mt-2 text-xs font-mono whitespace-pre-wrap overflow-auto">
                {this.state.error.toString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

const AllCoursesPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <CourseProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Բոլոր դասընթացները</h1>
            <AllCoursesView />
          </main>
          <Footer />
        </div>
      </CourseProvider>
    </ErrorBoundary>
  );
};

export default AllCoursesPage;
