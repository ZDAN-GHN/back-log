import type{ ReactNode } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface BasicLayoutProps {
  children: ReactNode;
}

export const BasicLayout = ({ children }: BasicLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-warm">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
