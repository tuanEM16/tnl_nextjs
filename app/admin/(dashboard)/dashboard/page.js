'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/services/productService';
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import { contactService } from '@/services/contactService';
import {
  MdInventory, MdCategory, MdArticle, MdContactPhone,
  MdArrowForward, MdSettings, MdNotificationsActive, MdMarkEmailUnread, MdHistory
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
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {

      const [prodRes, catRes, postRes, contactRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        postService.getAll({ post_type: '' }), // 🟢 Thử gửi 'all' hoặc bỏ trống tùy Backend con viết
        contactService.getAll()
      ]);


      const unreadCount = contactRes.data?.filter(c => Number(c.status) === 0).length || 0;

      setCounts({
        products: prodRes.data?.length || 0,
        categories: catRes.data?.length || 0,
        totalPosts: postRes.data?.length || 0, // 🟢 Giờ đây là tổng xịn
        contacts: contactRes.data?.length || 0,
        unreadContacts: unreadCount
      });
    } catch (error) {
      console.error("Lỗi đồng bộ dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { label: 'SẢN PHẨM TRONG KHO', value: counts.products, icon: MdInventory, href: '/admin/products', color: 'border-black' },
    { label: 'PHÂN LOẠI HÀNG', value: counts.categories, icon: MdCategory, href: '/admin/categories', color: 'border-black' },
    { label: 'TỔNG NỘI DUNG', value: counts.totalPosts, icon: MdArticle, href: '/admin/posts', color: 'border-black' },
    { label: 'YÊU CẦU LIÊN HỆ', value: counts.contacts, icon: MdContactPhone, href: '/admin/contacts', color: counts.unreadContacts > 0 ? 'border-orange-600' : 'border-black' },
  ];

  if (loading) return <div className="p-20 font-black italic animate-pulse uppercase tracking-[0.3em] text-center text-black">Initialising Industrial Command Center...</div>;

  return (
    <div className="space-y-12 pb-20 font-archivo uppercase">
      {/* HEADER - Gắn Chuông Báo Động Industrial */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-10">
        <div>
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 mb-3 italic">OPERATIONAL COMMAND CENTER</p>
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">
            HELLO, <span className="text-orange-600">{user?.name || 'ADMIN'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* 🔥 CỤM CHUÔNG THÔNG BÁO - SIÊU NỔI BẬT */}
          <Link href="/admin/contacts" className="relative group">
            <div className={`p-5 border-4 border-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-[4px] group-hover:translate-y-[4px] ${counts.unreadContacts > 0 ? 'bg-orange-600 animate-pulse' : 'bg-white'
              }`}>
              <MdNotificationsActive
                size={32}
                className={`${counts.unreadContacts > 0 ? 'text-white' : 'text-black'}`}
              />
            </div>

            {/* Badge số lượng đỏ rực */}
            {counts.unreadContacts > 0 && (
              <div className="absolute -top-3 -right-3 bg-black text-white text-xs font-black w-8 h-8 flex items-center justify-center border-4 border-white rounded-none shadow-[4px_4px_0px_0px_rgba(234,88,12,1)] animate-bounce">
                {counts.unreadContacts}
              </div>
            )}
          </Link>

          <div className="bg-black text-white px-8 py-5 shadow-[8px_8px_0px_0px_#ea580c]">
            <p className="text-[10px] font-black tracking-[0.2em] italic">STATION: ONLINE</p>
          </div>
        </div>
      </header>

      {/* THỐNG KÊ CHIẾN LƯỢC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isContact = stat.label === 'YÊU CẦU LIÊN HỆ';

          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group bg-white border-4 ${stat.color} p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none relative overflow-hidden`}
            >
              {/* Tag báo tin chưa check ngay trên Card */}
              {isContact && counts.unreadContacts > 0 && (
                <div className="absolute top-0 right-0 bg-orange-600 text-white px-4 py-1 font-black text-[10px] italic shadow-sm flex items-center gap-2">
                  <MdMarkEmailUnread size={14} /> {counts.unreadContacts} UNREAD
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-black text-gray-400 tracking-widest">{stat.label}</p>
                <Icon size={28} className={`transition-colors ${isContact && counts.unreadContacts > 0 ? 'text-orange-600' : 'text-black group-hover:text-orange-600'}`} />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-6xl font-black tracking-tighter leading-none">
                  {stat.value.toString().padStart(2, '0')}
                </span>
                <span className="bg-black text-white text-[9px] font-black px-2 py-1 italic shadow-[3px_3px_0px_0px_#ea580c]">
                  SENSORS ACTIVE
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* THÔNG TIN PHỤ TRỢ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        {/* Cột trái: Nút hành động nhanh */}
        <div className="lg:col-span-2 bg-gray-50 border-2 border-black p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
          <h3 className="text-xl font-black italic mb-8 border-l-8 border-black pl-4">QUICK LAUNCHER</h3>
          <div className="grid grid-cols-2 gap-6">
            <Link href="/admin/products/add" className="flex items-center justify-between p-6 bg-white border-2 border-black hover:bg-black hover:text-white transition-all font-black text-sm group">
              NHẬP KHO THÉP <MdArrowForward className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/admin/posts/add" className="flex items-center justify-between p-6 bg-white border-2 border-black hover:bg-black hover:text-white transition-all font-black text-sm group">
              SOẠN THẢO MỚI <MdArrowForward className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Cột phải: Trạng thái Server */}
        <div className="border-4 border-black p-10 bg-white shadow-[10px_10px_0px_0px_#ea580c] space-y-8">
          <h3 className="text-xl font-black italic text-orange-600 uppercase">System Logs</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black border-b border-black/10 pb-2">
              <span className="text-gray-400">DATABASE STATUS:</span>
              <span className="text-green-600 italic underline">CONNECTED</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black border-b border-black/10 pb-2">
              <span className="text-gray-400">LAST SYNC:</span>
              <span className="text-black italic">JUST NOW</span>
            </div>
          </div>
          <button
            onClick={fetchDashboardData}
            className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 font-black text-xs tracking-widest hover:bg-orange-600 transition-colors shadow-[4px_4px_0px_0px_#ea580c] active:shadow-none active:translate-x-[2px]"
          >
            <MdHistory size={20} /> RE-SYNC DATA
          </button>
        </div>
      </div>
    </div>
  );
}