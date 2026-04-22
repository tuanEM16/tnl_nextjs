'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bannerService } from '@/services/bannerService';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdFilterList, MdSearch } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const [filters, setFilters] = useState({
    page: '',
    keyword: ''
  });

  const pageLabels = {
    home: 'TRANG CHỦ',
    product: 'SẢN PHẨM',
    product_detail: 'CHI TIẾT SP',
    about: 'GIỚI THIỆU',
    project: 'DỰ ÁN',
    news: 'TRUYỀN THÔNG',
    contact: 'LIÊN HỆ',
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {

      const res = await bannerService.getAll(filters);
      setBanners(res.data || []);
    } catch (error) {
      toast.error('LỖI TRUY XUẤT DỮ LIỆU BANNER');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBanners();
  }, [filters]);

  const handleDelete = async (id, name) => {
    if (!confirm(`XÁC NHẬN GỠ BỎ BANNER: ${name.toUpperCase()}?`)) return;
    try {
      await bannerService.delete(id);
      toast.success('ĐÃ LOẠI BỎ');
      fetchBanners();
    } catch (error) {
      toast.error('GỠ BỎ THẤT BẠI');
    }
  };

  return (
    <div className="space-y-12 pb-20 font-archivo uppercase">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-10">
        <div>
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">Visual Asset Management</p>
          <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">
            BANNER<span className="text-orange-600">.</span>
          </h1>
        </div>
        <Link
          href="/admin/banners/add"
          className="flex items-center gap-2 bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <MdAdd size={20} /> THÊM MỚI BANNER
        </Link>
      </header>

      {/* 🔥 BỘ LỌC - NICKELBRONX CONTROL PANEL */}
      <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lọc theo Vị trí trang */}
        <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                <MdFilterList /> VỊ TRÍ HIỂN THỊ
            </label>
            <select 
                value={filters.page}
                onChange={(e) => setFilters({...filters, page: e.target.value})}
                className="w-full border-2 border-black p-4 font-black text-xs outline-none bg-orange-50 focus:bg-orange-100 transition-all cursor-pointer"
            >
                <option value="">-- TẤT CẢ VỊ TRÍ --</option>
                {Object.entries(pageLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
        </div>

        {/* Tìm kiếm theo tên */}
        <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                <MdSearch /> TÌM KIẾM THEO TÊN
            </label>
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="NHẬP TÊN BANNER CẦN TÌM..."
                    value={filters.keyword}
                    onChange={(e) => setFilters({...filters, keyword: e.target.value})}
                    className="w-full border-2 border-black p-4 font-black text-xs outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-200"
                />
                {filters.keyword && (
                    <button 
                        onClick={() => setFilters({...filters, keyword: ''})}
                        className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-[10px] hover:text-orange-600"
                    >
                        CLEAR
                    </button>
                )}
            </div>
        </div>
      </div>

      {/* DANH SÁCH BẢNG */}
      <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10">PREVIEW</th>
              <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10">TÊN BANNER</th>
              <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10 text-center">VỊ TRÍ</th>
              <th className="p-6 text-[10px] font-black tracking-widest uppercase border-r border-white/10 text-center">TRẠNG THÁI</th>
              <th className="p-6 text-[10px] font-black tracking-widest uppercase text-right">QUẢN LÝ</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {loading ? (
                <tr>
                    <td colSpan="5" className="p-20 text-center font-black italic animate-pulse">Filtering Assets...</td>
                </tr>
            ) : banners.length > 0 ? (
              banners.map((banner) => (
                <tr key={banner.id} className="group hover:bg-orange-50 transition-colors">
                  <td className="p-6 border-r border-black/5">
                    <div className="w-32 h-16 bg-gray-100 border-2 border-black overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${banner.image}`}
                        alt={banner.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-6 border-r border-black/5 font-black text-xl tracking-tighter italic">
                    {banner.name}
                  </td>
                  <td className="p-6 border-r border-black/5 text-center">
                    <span className="text-[10px] font-black bg-gray-100 px-3 py-1 border border-black italic">
                      {pageLabels[banner.page] || banner.page}
                    </span>
                  </td>
                  <td className="p-6 border-r border-black/5 text-center">
                    <span className={`inline-flex items-center px-4 py-1 text-[10px] font-black italic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                        banner.status === 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500 shadow-none'
                    }`}>
                      {banner.status === 1 ? 'LIVE' : 'HIDDEN'}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-end gap-6 text-black">
                      <Link href={`/admin/banners/${banner.id}/show`} className="hover:text-orange-600 transition-transform hover:scale-125"><MdVisibility size={22} /></Link>
                      <Link href={`/admin/banners/${banner.id}/edit`} className="hover:text-indigo-600 transition-transform hover:scale-125"><MdEdit size={22} /></Link>
                      <button onClick={() => handleDelete(banner.id, banner.name)} className="hover:text-red-600 transition-transform hover:scale-125"><MdDelete size={22} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-32 text-center">
                    <p className="font-black text-2xl italic tracking-widest opacity-20">NO BANNER FOUND IN THIS CATEGORY</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}