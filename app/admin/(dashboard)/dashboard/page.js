'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/services/productService';
import { postService } from '@/services/postService';
import { categoryService } from '@/services/categoryService';
import { contactService } from '@/services/contactService';
import {
  MdInventory, MdCategory, MdArticle, MdContactPhone,
  MdArrowForward, MdSettings, MdNotificationsActive, MdMarkEmailUnread, MdHistory, MdAccessTime,
  MdAddCircleOutline, MdEditDocument
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
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  // 1. ĐỒNG HỒ HỆ THỐNG
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('vi-VN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. FETCH DATA
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, postRes, contactRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        postService.getAll({ post_type: '' }),
        contactService.getAll()
      ]);

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

      setRecentContacts(contacts.slice(0, 4)); // Lấy 4 liên hệ cho cân đối layout

    } catch (error) {
      console.error("Lỗi đồng bộ Dashboard:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = [
    { label: 'Sản phẩm', value: counts.products, icon: MdInventory, href: '/admin/products', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Danh mục', value: counts.categories, icon: MdCategory, href: '/admin/categories', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Bài viết', value: counts.totalPosts, icon: MdArticle, href: '/admin/posts', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Liên hệ', value: counts.contacts, icon: MdContactPhone, href: '/admin/contacts', color: counts.unreadContacts > 0 ? 'text-red-600' : 'text-orange-600', bg: counts.unreadContacts > 0 ? 'bg-red-50' : 'bg-orange-50' },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0e2188] rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Đang tải dữ liệu tổng quan...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 font-sans">
      
      {/* 🟢 HEADER - MODERN & CLEAN */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Xin chào, <span className="text-[#0e2188]">{user?.name || 'Quản trị viên'}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm">
            Dưới đây là tổng quan tình hình hoạt động của website hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full shadow-sm text-sm font-medium">
            <MdAccessTime className="text-gray-400" size={18} />
            <span>{currentTime}</span>
          </div>

          <Link href="/admin/contacts" className="relative">
            <div className={`p-2.5 rounded-full border transition-colors ${
              counts.unreadContacts > 0 
                ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
              <MdNotificationsActive size={20} />
            </div>
            {counts.unreadContacts > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {counts.unreadContacts}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* 🟢 STATS GRID - SOFT UI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#0e2188] group-hover:text-white transition-colors">
                  <MdArrowForward size={16} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value.toString().padStart(2, '0')}
                </h3>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 MAIN LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* LỐI TẮT (QUICK LAUNCHER) */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MdSettings className="text-gray-400" /> Thao tác nhanh
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/admin/products/add"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#0e2188]/30 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#0e2188]/10 text-[#0e2188] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MdAddCircleOutline size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Thêm Sản phẩm</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Cập nhật kho hàng mới</p>
                </div>
              </Link>

              <Link href="/admin/posts/add"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-500/30 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MdEditDocument size={22} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Viết Bài mới</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Đăng tin tức, dự án</p>
                </div>
              </Link>
            </div>
          </section>

          {/* LIÊN HỆ GẦN ĐÂY */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">Liên hệ mới nhất</h3>
              <Link href="/admin/contacts" className="text-sm font-medium text-[#0e2188] hover:underline">
                Xem tất cả
              </Link>
            </div>
            
            <div className="divide-y divide-gray-100">
              {recentContacts.length > 0 ? recentContacts.map((contact) => (
                <div key={contact.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                  <Link 
                    href="/admin/contacts" 
                    className="p-2 text-gray-400 hover:text-[#0e2188] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Xem chi tiết"
                  >
                    <MdArrowForward size={20} />
                  </Link>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-500">
                  Chưa có liên hệ nào gần đây.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 🟢 SIDEBAR (RIGHT COLUMN) */}
        <aside className="space-y-6">

          {/* CẢNH BÁO NẾU CÓ LIÊN HỆ CHƯA ĐỌC */}
          {counts.unreadContacts > 0 && (
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 flex gap-4">
              <div className="text-orange-500 shrink-0">
                <MdMarkEmailUnread size={28} />
              </div>
              <div>
                <h4 className="font-bold text-orange-800 mb-1">Cần xử lý</h4>
                <p className="text-sm text-orange-700 leading-relaxed">
                  Bạn có <strong>{counts.unreadContacts}</strong> yêu cầu liên hệ chưa được xử lý. Vui lòng kiểm tra để hỗ trợ khách hàng kịp thời.
                </p>
                <Link href="/admin/contacts" className="inline-block mt-3 text-sm font-bold text-orange-600 hover:text-orange-800">
                  Xử lý ngay &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* TRẠNG THÁI HỆ THỐNG */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Trạng thái máy chủ
            </h3>

            <div className="space-y-5">
              {[
                { label: 'Cơ sở dữ liệu', status: 'Ổn định', color: 'bg-green-500' },
                { label: 'Lưu trữ (Storage)', status: 'Tối ưu', color: 'bg-green-500' },
                { label: 'Hệ thống Upload', status: 'Sẵn sàng', color: 'bg-blue-500' },
                { label: 'Độ trễ (Latency)', status: '0.04ms', color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{item.status}</span>
                    <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={fetchDashboardData}
              className="mt-8 w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-3 rounded-xl font-medium transition-colors group"
            >
              <MdHistory size={20} className="text-gray-400 group-hover:text-[#0e2188] group-hover:-rotate-180 transition-all duration-500" />
              Đồng bộ lại dữ liệu
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}