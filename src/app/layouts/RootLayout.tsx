import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Toaster } from '../components/ui/sonner';
import { ScrollToTop } from '../components/ScrollToTop';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-[#050607] flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <Toaster richColors theme="dark" />
    </div>
  );
}
