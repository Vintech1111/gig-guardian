import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  enableSnapScroll?: boolean;
}

export function Layout({ children, enableSnapScroll = false }: LayoutProps) {
  return (
    <div className={`min-h-screen bg-background flex flex-col ${enableSnapScroll ? 'snap-container' : ''}`}>
      <Navbar />
      <main className={`flex-1 pt-16 ${enableSnapScroll ? '' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
