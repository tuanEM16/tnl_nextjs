'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MdPhoneInTalk, MdMenu } from 'react-icons/md';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

import { usePublicConfig } from '@/hooks/public/usePublicConfig';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import MobileMenu from './MobileMenu';
import { usePublicMenus } from '@/hooks/public/usePublicMenus';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isInBanner, setIsInBanner] = useState(true);

  const { menus } = usePublicMenus('mainmenu');
  const { config, loading } = usePublicConfig();
  const { scrollY } = useScroll();

  // Đảm bảo menus luôn là mảng để không bị lỗi khi map/filter
  const menuList = Array.isArray(menus) ? menus : [];

  // Lọc menu gốc (parent_id = 0)
  const rootMenus = menuList
    .filter((m) => !m.parent_id || parseInt(m.parent_id) === 0)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Ép kiểu chặt chẽ (parseInt) cả 2 vế để tránh lỗi so sánh string vs number
  const getChildMenus = (parentId) => {
    return menuList
      .filter((m) => parseInt(m.parent_id) === parseInt(parentId))
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  const mobileLinks = rootMenus.map((m) => {
    // Tìm con của từng thằng cha
    const children = (m.children && m.children.length > 0)
      ? m.children
      : getChildMenus(m.id);

    return {
      label: m.name,
      href: m.link || '#',
      // Nhét thêm mảng con vào cho MobileMenu nó render
      children: children.length > 0 ? children.map(c => ({
        label: c.name,
        href: c.link || '#'
      })) : undefined
    };
  });

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
          <div className="flex justify-between items-center h-full">

            {/* LOGO AREA */}
            <Link href="/" className="flex items-center gap-3 group min-w-0 shrink">
              {config?.logo && (
                <img
                  src={getImageUrl(config.logo)}
                  alt={config.site_name}
                  className="h-12 md:h-14 w-auto transition-transform duration-500 group-hover:scale-105 object-contain"
                />
              )}
              <div className="flex flex-col">
                <span className={`text-xl md:text-2xl font-bold uppercase tracking-tighter transition-colors leading-none
                    ${isInBanner ? 'text-white' : 'text-[#0e2188]'}`}>
                  {config?.site_name || 'TÂN NGỌC LỰC'}
                </span>
                <span className={`hidden sm:block text-[9px] font-bold tracking-[0.15em] uppercase mt-1
                    ${isInBanner ? 'text-white/70' : 'text-[#e33127]'}`}>
                  {config?.slogan || 'Steel Construction Unit'}
                </span>
              </div>
            </Link>

            {/* NAVIGATION ĐỘNG */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              {rootMenus.map((menu) => {
                // Hỗ trợ cả 2 dạng: API trả về Tree (có m.children) HOẶC API trả về List phẳng
                const children = (menu.children && menu.children.length > 0)
                  ? menu.children
                  : getChildMenus(menu.id);

                const hasChildren = children.length > 0;

                return (
                  <div key={menu.id} className="relative group py-2">
                    <Link
                      href={menu.link || '#'}
                      className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] relative transition-colors py-2
                        ${isInBanner ? 'text-white' : 'text-[#0e2188] hover:text-[#e33127]'}
                      `}
                    >
                      {menu.name}

                      {hasChildren && (
                        <svg className={`w-3 h-3 transition-transform duration-300 group-hover:-rotate-180 ${isInBanner ? 'text-white/70' : 'text-[#0e2188]/70 group-hover:text-[#e33127]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}

                      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] transition-all duration-300 group-hover:w-full 
                        ${isInBanner ? 'bg-white' : 'bg-[#e33127]'}`}></span>
                    </Link>

                    {/* DROPDOWN MENU CON */}
                    {hasChildren && (
                      <div className="absolute top-[100%] left-0 pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                        <div className="bg-white border border-zinc-100 shadow-[0_10px_40px_rgba(14,33,136,0.08)] flex flex-col py-2 rounded-sm overflow-hidden">
                          {children.map(child => (
                            <Link
                              key={child.id}
                              href={child.link || '#'}
                              className="block px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[#0e2188] hover:bg-zinc-50 hover:text-[#e33127] transition-colors relative group/child"
                            >
                              <span className="relative z-10">{child.name}</span>
                              <span className="absolute left-0 top-0 w-0 h-full bg-[#e33127]/5 group-hover/child:w-full transition-all duration-300 -z-0"></span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ACTION AREA */}
            <div className="flex items-center gap-4 xl:gap-6">
              {!loading && (
                <a
                  href={`tel:${config?.hotline || config?.phone}`}
                  className={`hidden md:flex items-center gap-3 px-6 py-3 rounded-sm transition-all duration-300 text-xs font-bold tracking-widest uppercase
                    ${isInBanner
                      ? 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white hover:text-[#0e2188]'
                      : 'bg-[#e33127] text-white shadow-lg shadow-red-500/20 hover:bg-[#0e2188] hover:shadow-none'}`}
                >
                  <MdPhoneInTalk size={18} />
                  <span>{config?.hotline || config?.phone}</span>
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

      {/* MOBILE MENU */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={mobileLinks}
      />
    </>
  );
}