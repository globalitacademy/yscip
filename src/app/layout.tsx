
import '@/app/globals.css';
import { CustomCursor } from '@/components/ui/custom-cursor';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="h-full bg-background text-foreground">
        {/* CustomCursor will internally check if it's on homepage */}
        <CustomCursor showVirtualPointers={true} virtualUsersCount={4} />
        {children}
      </body>
    </html>
  );
}
