// app/(public)/layout.js
import Header from '@/components/public/layout/Header';
import Footer from '@/components/public/layout/Footer';
import '@/app/globals.css';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-black selection:bg-orange-600 selection:text-white">
      {/* 🔴 Hotline của Tân Ngọc Lực: 0366638969 luôn hiện ở trên cùng [cite: 9, 74] */}
      <div className="bg-black text-white py-2 text-center text-[10px] font-black tracking-[0.5em] uppercase">
        Hotline hỗ trợ 24/7: 0366638969
      </div>

      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}