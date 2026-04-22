'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { configService } from '@/services/configService';
import { MdSettingsSuggest } from 'react-icons/md';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const [config, setConfig] = useState({
    site_name: 'TÂN NGỌC LỰC',
    logo: ''
  });

  const getLogoUrl = () => {
    if (!config.logo) return null;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${config.logo}`;
  };

  useEffect(() => {
    const fetchSidebarConfig = async () => {
      try {
        const res = await configService.show();
        if (res.data) {
          setConfig({
            site_name: res.data.site_name || 'TÂN NGỌC LỰC',
            logo: res.data.logo || ''
          });
        }
      } catch (error) {
        console.error('Sidebar config fetch failed');
      }
    };
    fetchSidebarConfig();
  }, [pathname]);

  // 🟢 DANH SÁCH MENU PHẲNG (Đã thêm Quản lý Menu)
  const menuItems = [
    { label: 'TỔNG QUAN', href: '/admin/dashboard' },
    { label: 'SẢN PHẨM', href: '/admin/products' },
    { label: 'DANH MỤC', href: '/admin/categories' },
    { label: 'BÀI VIẾT', href: '/admin/posts' },
    { label: 'BANNER', href: '/admin/banners' },
    { label: 'QUẢN LÝ MENU', href: '/admin/menus' }, // 🔥 Nút mới nằm đây em ơi
    { label: 'LIÊN HỆ', href: '/admin/contacts' },
    { label: 'NHÂN SỰ', href: '/admin/users' },
    { label: 'CẤU HÌNH', href: '/admin/configs' },
  ];

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`relative flex flex-col h-full border-r border-white/10 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-72'
      }`}
      style={{
        background: 'linear-gradient(180deg, #8C001A 0%, #0B1F4F 35%, #5B1F5A 65%, #8C001A 100%)'
      }}
    >
      {/* 🔴 Logo Area */}
      <div className={`transition-all duration-300 flex flex-col items-center ${
        collapsed ? 'p-4' : 'p-8'
      } bg-white border-b-4 border-black`}>
        <div className={`mb-4 flex items-center justify-center overflow-hidden transition-all duration-300 ${
          collapsed ? 'w-10 h-10' : 'w-24 h-16'
        }`}>
          {config.logo ? (
            <img 
              src={getLogoUrl()} 
              alt="" 
              className="w-full h-full object-contain"
            />
          ) : null}
          <MdSettingsSuggest 
            className={`text-orange-600 ${config.logo ? 'hidden' : 'block'}`} 
            size={collapsed ? 30 : 40} 
          />
        </div>

        {!collapsed && (
          <h2 className="text-xl font-black tracking-tighter leading-none text-[#0B1F4F] uppercase text-center w-full">
            {config.site_name}<span className="text-orange-600">.</span>
          </h2>
        )}
        
        {collapsed && (
            <div className="text-xl font-black text-orange-600 uppercase">
              {config.site_name.charAt(0)}
            </div>
        )}
      </div>

      {/* 🔵 Navigation (Danh sách phẳng) */}
      <nav className={`flex-1 py-6 px-4 space-y-1 overflow-y-auto ${collapsed ? 'px-2' : ''}`}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center ${
                collapsed ? 'justify-center' : 'justify-between'
              } px-4 py-4 text-xs font-black tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? 'bg-amber-500 text-[#0A1E2F] shadow-[4px_4px_0_0_#000] -translate-y-1'
                  : 'text-[#8AA9C9] hover:bg-white/5 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span>{collapsed ? item.label.charAt(0) : item.label}</span>
              {!collapsed && (
                <span className={`text-[10px] transition-all duration-300 ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
                }`}>
                  →
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ⚪ Footer */}
      <div className={`p-6 border-t border-white/10 ${collapsed ? 'hidden' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#8AA9C9]">System Online</span>
        </div>
        <p className="text-[9px] font-bold text-[#8AA9C9] opacity-40 tracking-widest italic uppercase">
          Steel Admin / {config.site_name}
        </p>
      </div>
    </aside>
  );
}