'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/services/productService';
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import { contactService } from '@/services/contactService';
import {
  MdInventory, MdCategory, MdArticle, MdContactPhone,
  MdArrowForward, MdSettings, MdNotificationsActive, MdMarkEmailUnread, MdHistory, MdAccessTime
} from 'react-icons/md';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({
    products: 0,
    categories: 0,
    totalPosts: 0,
    contacts: 0,
    unreadContacts: 0
  });
  const [recentContacts, setRecentContacts] = useState([]); // 🟢 Thêm danh sách liên hệ mới nhất
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  // 1. ĐỒNG HỒ HỆ THỐNG (Tăng độ "ngầu" cho Command Center)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('vi-VN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. FETCH DATA CHIẾN THUẬT
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, postRes, contactRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        postService.getAll({ post_type: '' }),
        contactService.getAll()
      ]);

      // Bốc dữ liệu lì lợm chấp mọi tầng lồng res.data.data
      const prods = prodRes?.data?.data || prodRes?.data || prodRes || [];
      const cats = catRes?.data?.data || catRes?.data || catRes || [];
      const posts = postRes?.data?.data || postRes?.data || postRes || [];
      const contacts = contactRes?.data?.data || contactRes?.data || contactRes || [];

      const unread = contacts.filter(c => Number(c.status) === 0);

      setCounts({
        products: prods.length,
        categories: cats.length,
        totalPosts: posts.length,
        contacts: contacts.length,
        unreadContacts: unread.length
      });

      // Lấy 3 liên hệ mới nhất để hiển thị
      setRecentContacts(contacts.slice(0, 3));

    } catch (error) {
      console.error("Lỗi đồng bộ Command Center:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    { label: 'SẢN PHẨM TRONG KHO', value: counts.products, icon: MdInventory, href: '/admin/products', color: 'border-black' },
    { label: 'PHÂN LOẠI HÀNG', value: counts.categories, icon: MdCategory, href: '/admin/categories', color: 'border-black' },
    { label: 'TỔNG NỘI DUNG', value: counts.totalPosts, icon: MdArticle, href: '/admin/posts', color: 'border-black' },
    { label: 'YÊU CẦU LIÊN HỆ', value: counts.contacts, icon: MdContactPhone, href: '/admin/contacts', color: counts.unreadContacts > 0 ? 'border-orange-600' : 'border-black' },
  ];

  if (loading) return (
    <div className="p-32 flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 border-[10px] border-black border-t-orange-600 animate-spin shadow-[8px_8px_0_0_#000]"></div>
      <p className="font-black italic animate-pulse uppercase tracking-[0.4em] text-black">Initialising Command Center Buffer...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 font-archivo uppercase">
      {/* 🔴 HEADER - INDUSTRIAL STYLE */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b-[6px] border-black pb-10 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-black text-white w-fit px-4 py-1 italic shadow-[4px_4px_0_0_#ea580c]">
            <MdAccessTime />
            <span className="text-xs font-black tracking-widest">{currentTime} // SYSTEM_TIME</span>
          </div>

          {/* 🟢 FIX Ở ĐÂY: Bỏ cái .split(' ')[0] đi để hiện đầy đủ QUẢN TRỊ VIÊN */}
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-black">
            <span className="text-orange-600">{user?.name || 'ADMIN'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/admin/contacts" className="relative group">
            <div className={`p-6 border-4 border-black transition-all shadow-[8px_8px_0_0_#000] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none ${counts.unreadContacts > 0 ? 'bg-orange-600 animate-pulse' : 'bg-white'
              }`}>
              <MdNotificationsActive size={40} className={counts.unreadContacts > 0 ? 'text-white' : 'text-black'} />
            </div>
            {counts.unreadContacts > 0 && (
              <div className="absolute -top-4 -right-4 bg-black text-white text-sm font-black w-10 h-10 flex items-center justify-center border-[4px] border-white shadow-[4px_4px_0_0_#ea580c]">
                {counts.unreadContacts}
              </div>
            )}
          </Link>
          <div className="hidden sm:block bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0_0_#ea580c]">
            <p className="text-[10px] font-black tracking-[0.3em]">SECURE_CONNECTION: ACTIVE</p>
            <p className="text-[10px] font-black tracking-[0.3em] text-orange-600">ENCRYPTION: AES-256</p>
          </div>
        </div>
      </header>

      {/* 🔴 STATS GRID */}
      {/* 🔴 STATS GRID - ĐÃ THÊM HIỆU ỨNG NHẢY LÌ LỢM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              // 🟢 CHỖ NÀY NÈ: shadow dày 12px, hover thì dịch chuyển đúng 12px và mất shadow
              className={`group bg-white border-[6px] ${stat.color} p-8 
                   shadow-[12px_12px_0_0_#000] transition-all duration-200
                   hover:translate-x-[12px] hover:translate-y-[12px] hover:shadow-none 
                   relative overflow-hidden cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-10">
                <p className="text-[10px] font-black text-gray-400 tracking-[0.2em]">{stat.label}</p>
                <Icon size={32} className="group-hover:text-orange-600 transition-colors" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-7xl font-black tracking-tighter leading-none text-black">
                  {stat.value.toString().padStart(2, '0')}
                </span>
                <div className="flex flex-col items-end">
                  <div className="w-12 h-2 bg-black mb-2 shadow-[2px_2px_0_0_#ea580c]"></div>
                  <span className="text-[9px] font-black italic opacity-30">LIVE_DATA</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 🔴 MAIN DASHBOARD SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LAUNCHER + RECENT ACTIVITY */}
        <div className="lg:col-span-2 space-y-12">

          {/* QUICK LAUNCHER */}
          <section className="bg-white border-4 border-black p-10 shadow-[15px_15px_0_0_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black italic mb-8 border-l-[12px] border-orange-600 pl-6 flex items-center gap-3">
              MANUAL OVERRIDE <MdSettings className="animate-spin-slow" />
            </h3>
            {/* QUICK LAUNCHER - CŨNG PHẢI NHẢY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Link href="/admin/products/add"
                className="flex items-center justify-between p-8 bg-black text-white border-4 border-black 
                   shadow-[8px_8px_0_0_#ea580c] transition-all duration-200
                   hover:translate-x-[8px] hover:translate-y-[8px] hover:shadow-none
                   font-black text-lg group">
                NHẬP KHO THÉP <MdArrowForward className="group-hover:translate-x-3 transition-transform" />
              </Link>

              <Link href="/admin/posts/add"
                className="flex items-center justify-between p-8 bg-white text-black border-4 border-black 
                   shadow-[8px_8px_0_0_#000] transition-all duration-200
                   hover:translate-x-[8px] hover:translate-y-[8px] hover:shadow-none
                   font-black text-lg group">
                BIÊN TẬP MỚI <MdArrowForward className="group-hover:translate-x-3 transition-transform" />
              </Link>
            </div>
          </section>

          {/* RECENT CONTACTS TABLE (Dòng chảy dữ liệu thực tế) */}
          <section className="border-[6px] border-black bg-white shadow-[15px_15px_0_0_#000] overflow-hidden">
            <div className="bg-black text-white p-4 font-black italic tracking-widest text-xs flex justify-between">
              <span>INCOMING_SIGNALS // RECENT_CONTACTS</span>
              <span className="text-orange-600">LIVE_FEED</span>
            </div>
            <div className="divide-y-4 divide-black">
              {recentContacts.length > 0 ? recentContacts.map((contact) => (
                <div key={contact.id} className="p-6 flex items-center justify-between hover:bg-orange-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-black text-xl tracking-tighter uppercase">{contact.name}</span>
                    <span className="text-[10px] font-bold text-gray-400">{contact.email}</span>
                  </div>
                  <Link href="/admin/contacts" className="p-3 border-2 border-black bg-white shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    <MdMarkEmailUnread size={20} />
                  </Link>
                </div>
              )) : (
                <div className="p-10 text-center font-black italic text-gray-300">NO RECENT SIGNALS DETECTED.</div>
              )}
            </div>
          </section>
        </div>

        {/* 🟠 SYSTEM LOGS & HEALTH */}
        <aside className="space-y-8">
          <div className="border-[6px] border-black p-10 bg-white shadow-[20px_20px_0_0_#ea580c] space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-600/10 -rotate-45 translate-x-12 -translate-y-12"></div>

            <h3 className="text-3xl font-black italic text-black uppercase leading-none border-b-4 border-black pb-4">
              Core<br /><span className="text-orange-600">Status</span>
            </h3>

            <div className="space-y-6">
              {[
                { label: 'DATABASE', status: 'STABLE', color: 'text-green-600' },
                { label: 'STORAGE', status: 'OPTIMIZED', color: 'text-green-600' },
                { label: 'UPLOADS', status: 'READY', color: 'text-black' },
                { label: 'LATENCY', status: '0.04ms', color: 'text-orange-600 font-mono' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-end border-b-2 border-black/10 pb-2">
                  <span className="text-[10px] font-black text-gray-400 tracking-widest">{item.label}:</span>
                  <span className={`text-xs font-black italic ${item.color} underline decoration-2`}>{item.status}</span>
                </div>
              ))}
            </div>

            <button
              onClick={fetchDashboardData}
              className="group relative w-full flex items-center justify-center gap-4 bg-black text-white py-6 font-black text-sm tracking-[0.3em] transition-all hover:bg-orange-600 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              <MdHistory size={24} className="group-hover:rotate-180 transition-transform duration-700" />
              RE-SYNC CORE
              <div className="absolute inset-0 translate-x-2 translate-y-2 border-2 border-black -z-10 bg-white"></div>
            </button>
          </div>

          {/* WARNING BLOCK */}
          <div className="p-8 border-4 border-black border-dashed bg-yellow-50 flex gap-4 shadow-[10px_10px_0_0_#000]">
            <MdMarkEmailUnread size={40} className="shrink-0 animate-bounce" />
            <p className="text-[10px] font-black leading-relaxed italic">
              NOTIFICATION: YOU HAVE {counts.unreadContacts} UNPROCESSED CONTACT REQUESTS. PLEASE VERIFY IMMEDIATELY TO MAINTAIN SYSTEM KPI.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}