'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MdPhoneInTalk, MdMenu } from 'react-icons/md';
import { usePublicConfig } from '@/hooks/public/usePublicConfig'; // 🟢 Triệu hồi nội công
import { getImageUrl } from '@/lib/utils'; // 🟢 Máy hàn đường dẫn
import Container from '../ui/Container';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { config, loading } = usePublicConfig(); // 🟢 Bốc dữ liệu từ bảng config

  const navLinks = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Dự án', href: '/projects' },
    { label: 'Tin tức', href: '/news' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-[6px] border-black shadow-[0_4px_0_0_rgba(0,0,0,0.1)]">
      <Container>
        <div className="flex justify-between items-center h-24">
          
          {/* 🔴 LOGO AREA - TỰ ĐỘNG THAY ĐỔI */}
          <Link href="/" className="flex items-center gap-3 group">
            {config.logo ? (
              <img 
                src={getImageUrl(config.logo)} 
                alt={config.site_name} 
                className="h-14 w-auto object-contain transition-transform group-hover:scale-110" 
              />
            ) : null}
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter leading-none italic uppercase">
                {config.site_name || 'TÂN NGỌC LỰC'}
              </span>
              <span className="text-[9px] font-black tracking-[0.2em] text-orange-600 uppercase">
                {config.slogan || 'Steel Construction Unit'}
              </span>
            </div>
          </Link>

          {/* 🔵 DESKTOP MENU */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-black text-sm uppercase tracking-widest hover:text-orange-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-black group-hover:w-full transition-all"></span>
              </Link>
            ))}
          </nav>

          {/* 🟠 HOTLINE - ĐỔ TỪ DATABASE */}
          <div className="flex items-center gap-4">
            {!loading && (
              <a 
                href={`tel:${config.hotline || config.phone}`} 
                className="hidden md:flex items-center gap-3 bg-black text-white px-6 py-3 shadow-[4px_4px_0_0_#ea580c] hover:-translate-y-1 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <MdPhoneInTalk size={20} className="text-orange-500" />
                <span className="font-black italic">
                  {config.hotline || config.phone || '0366.638.969'}
                </span>
              </a>
            )}

            {/* MOBILE TOGGLE */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 border-4 border-black active:bg-black active:text-white transition-all"
            >
              <MdMenu size={28} />
            </button>
          </div>
        </div>
      </Container>

      {/* MOBILE MENU COMPONENT */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        links={navLinks} 
      />
    </header>
  );
}