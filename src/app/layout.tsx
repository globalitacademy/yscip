
import '@/app/globals.css';
import { CustomCursor } from '@/components/ui/custom-cursor';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
