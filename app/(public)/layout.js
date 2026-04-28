// app/(public)/layout.js
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import '@/app/globals.css';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-black selection:bg-orange-600 selection:text-white">


      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}