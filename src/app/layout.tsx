
import '@/app/globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { CustomCursor } from '@/components/ui/custom-cursor';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.add(theme);
            } catch (e) {}
          `
        }} />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
