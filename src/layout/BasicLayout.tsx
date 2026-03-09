import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const BasicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-warm">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
