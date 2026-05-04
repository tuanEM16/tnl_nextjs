'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MdPhoneInTalk, MdMenu } from 'react-icons/md';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

import { usePublicConfig } from '@/hooks/public/usePublicConfig';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isInBanner, setIsInBanner] = useState(true);

  const { config, loading } = usePublicConfig();
  const { scrollY } = useScroll();

  const navLinks = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/products' },
    { label: 'Giới thiệu', href: '/about' },
    { label: 'Dự án', href: '/projects' },
    { label: 'Dự toán', href: '/estimate' },
    { label: 'Tin tức', href: '/news' },
    { label: 'Liên hệ', href: '/contact' },
  ];

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    if (latest < 700) {
      setIsInBanner(true);
    } else {
      setIsInBanner(false);
    }

    if (latest > previous && latest > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans
          ${isInBanner
            ? 'bg-transparent text-white py-8' 
            : 'bg-white text-[#0e2188] py-4 shadow-sm border-b border-zinc-100'} 
        `}
      >
        <Container>
          <div className="flex justify-between items-center h-full px-4 md:px-0">

            {/* LOGO AREA */}
            <Link href="/" className="flex items-center gap-4 group">
              {config.logo && (
                <img
                  src={getImageUrl(config.logo)}
                  alt={config.site_name}
                  className="h-12 md:h-14 w-auto transition-transform duration-500 group-hover:scale-105 object-contain"
                />
              )}
              <div className="flex flex-col">
                <span className={`text-xl md:text-2xl font-bold uppercase tracking-tighter transition-colors leading-none
                    ${isInBanner ? 'text-white' : 'text-[#0e2188]'}`}>
                  {config.site_name || 'TÂN NGỌC LỰC'}
                </span>
                <span className={`text-[9px] font-bold tracking-[0.3em] uppercase mt-1
                    ${isInBanner ? 'text-white/70' : 'text-[#e33127]'}`}>
                  {config.slogan || 'Steel Construction Unit'}
                </span>
              </div>
            </Link>

            {/* NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] relative group transition-colors
                    ${isInBanner ? 'text-white' : 'text-[#0e2188] hover:text-[#e33127]'}
                  `}
                >
                  {link.label}
                  <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover:w-full 
                    ${isInBanner ? 'bg-white' : 'bg-[#e33127]'}`}></span>
                </Link>
              ))}
            </nav>

            {/* ACTION AREA */}
            <div className="flex items-center gap-4 xl:gap-6">
              {!loading && (
                <a
                  href={`tel:${config.hotline || config.phone}`}
                  className={`hidden md:flex items-center gap-3 px-6 py-3 rounded-sm transition-all duration-300 text-xs font-bold tracking-widest uppercase
                    ${isInBanner
                      ? 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-[#0e2188]'
                      : 'bg-[#e33127] text-white shadow-lg shadow-red-500/20 hover:bg-[#0e2188] hover:shadow-none'}`}
                >
                  <MdPhoneInTalk size={18} />
                  <span>{config.hotline || config.phone}</span>
                </a>
              )}

              <button
                onClick={() => setIsMenuOpen(true)}
                className={`lg:hidden p-2 rounded-full transition-all border
                  ${isInBanner 
                    ? 'border-white/30 text-white hover:bg-white hover:text-[#0e2188]' 
                    : 'border-zinc-200 text-[#0e2188] hover:border-[#e33127] hover:text-[#e33127]'}`}
              >
                <MdMenu size={24} />
              </button>
            </div>

          </div>
        </Container>
      </motion.header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={navLinks}
      />
    </>
  );
}