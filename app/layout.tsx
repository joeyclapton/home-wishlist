import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Home Wishlist',
  description: 'Organize your home shopping lists together',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}