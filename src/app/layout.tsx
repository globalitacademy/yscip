
import '@/app/globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { useLocation } from 'react-router-dom';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full bg-background text-foreground">
        <ThemeProvider>
          {/* CustomCursor will internally check if it's on homepage */}
          <CustomCursor showVirtualPointers={true} virtualUsersCount={4} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
