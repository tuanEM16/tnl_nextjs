// components/admin/layout/AdminSidebar.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { configService } from '@/services/configService';
import { MdSettingsSuggest, MdDashboard, MdInventory2, MdCategory, MdArticle, MdViewCarousel, MdMenu, MdContactPhone, MdPeople, MdSettings } from 'react-icons/md';
// 🟢 1. Dùng máy hàn đường dẫn chuẩn
import { getImageUrl } from '@/lib/utils'; 

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const [config, setConfig] = useState({
    site_name: 'TÂN NGỌC LỰC',
    logo: ''
  });

  // 🟢 2. Danh sách Menu (Phải khai báo đầy đủ để map không bị crash)
  const menuItems = [
    { label: 'TỔNG QUAN', href: '/admin/dashboard', icon: <MdDashboard size={20} /> },
    { label: 'SẢN PHẨM', href: '/admin/products', icon: <MdInventory2 size={20} /> },
    { label: 'DANH MỤC', href: '/admin/categories', icon: <MdCategory size={20} /> },
    { label: 'BÀI VIẾT', href: '/admin/posts', icon: <MdArticle size={20} /> },
    { label: 'BANNER', href: '/admin/banners', icon: <MdViewCarousel size={20} /> },
    { label: 'QUẢN LÝ MENU', href: '/admin/menus', icon: <MdMenu size={20} /> },
    { label: 'LIÊN HỆ', href: '/admin/contacts', icon: <MdContactPhone size={20} /> },
    { label: 'NHÂN SỰ', href: '/admin/users', icon: <MdPeople size={20} /> },
    { label: 'CẤU HÌNH', href: '/admin/configs', icon: <MdSettings size={20} /> },
  ];

  useEffect(() => {
    const fetchSidebarConfig = async () => {
      try {
        const res = await configService.show();
        const data = res.data || res;
        if (data) {
          setConfig({
            site_name: data.site_name || 'TÂN NGỌC LỰC',
            logo: data.logo || '' //
          });
        }
      } catch (error) {
        console.error('Sidebar config fetch failed');
      }
    };
    fetchSidebarConfig();
  }, [pathname]); // Cập nhật khi chuyển trang để đồng bộ logo mới nhất

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`relative flex flex-col h-full border-r border-white/10 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-72'
      }`}
      style={{
        background: 'linear-gradient(180deg, #0B1F4F 0%, #1a3a8a 100%)' // Đổi màu gradient cho chuyên nghiệp hơn
      }}
    >
      {/* 🔴 Logo Area */}
      <div className={`transition-all duration-300 flex flex-col items-center ${
        collapsed ? 'p-4' : 'p-8'
      } bg-white border-b-4 border-black`}>
        <div className={`mb-4 flex items-center justify-center overflow-hidden transition-all duration-300 ${
          collapsed ? 'w-10 h-10' : 'w-24 h-16'
        }`}>
          {/* 🟢 3. Hiển thị Logo từ Backend */}
          {config.logo ? (
            <img 
              src={getImageUrl(config.logo)} 
              alt={config.site_name} 
              className="w-full h-full object-contain"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          ) : (
            <MdSettingsSuggest 
              className="text-orange-600" 
              size={collapsed ? 30 : 40} 
            />
          )}
        </div>

        {!collapsed && (
          <h2 className="text-lg font-black tracking-tighter leading-none text-[#0B1F4F] uppercase text-center w-full">
            {config.site_name}<span className="text-orange-600">.</span>
          </h2>
        )}
      </div>

      {/* 🔵 Navigation */}
      <nav className={`flex-1 py-6 px-4 space-y-1 overflow-y-auto ${collapsed ? 'px-2' : ''}`}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center ${
                collapsed ? 'justify-center' : 'justify-start gap-4'
              } px-4 py-4 text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${
                isActive
                  ? 'bg-orange-600 text-white shadow-[4px_4px_0_0_#000] -translate-y-1'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className={isActive ? 'text-white' : 'text-orange-600/50 group-hover:text-orange-600'}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && isActive && <span className="ml-auto text-white">→</span>}
            </Link>
          );
        })}
      </nav>

      {/* ⚪ Footer */}
      <div className={`p-6 border-t border-white/10 ${collapsed ? 'hidden' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[9px] font-bold tracking-widest uppercase text-gray-400">System Online</span>
        </div>
        <p className="text-[8px] font-bold text-gray-500 opacity-60 tracking-widest italic uppercase">
          Steel Management v1.0
        </p>
      </div>
    </aside>
  );
}