'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories'; // 🟢 Dùng Hook đã fix lặp vô tận
import { getImageUrl } from '@/lib/utils';

// VŨ KHÍ UI NICKELBRONX
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdAdd, MdEdit, MdDelete, MdVisibility, MdLayers, MdImageNotSupported } from 'react-icons/md';

export default function CategoriesPage() {
  // 🟢 QUAN TRỌNG: Dùng useMemo để khóa object params, tránh lỗi ERR_INSUFFICIENT_RESOURCES
  const categoryParams = useMemo(() => ({ tree: true }), []);
  
  // 1. TRIỆU HỒI NỘI CÔNG
  const { categories, loading, deleteCategory } = useCategories(categoryParams);
  
  // 2. QUẢN LÝ MODAL XÓA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const triggerDelete = (cat) => {
    setItemToDelete(cat);
    setIsModalOpen(true);
  };

  // 3. HÀM ĐỆ QUY VẼ CÂY DANH MỤC (NICKELBRONX EDITION)
  const renderTreeRows = (nodes, level = 0) => {
    return nodes.map((node) => (
      <React.Fragment key={node.id}>
        <tr className="group hover:bg-orange-50/50 transition-colors border-b-4 border-black/10">
          {/* CỘT 1: NHẬN DIỆN HÌNH ẢNH */}
          <td className="p-6 w-32 border-r-4 border-black">
            <div className="relative w-20 h-14 border-2 border-black overflow-hidden bg-gray-100 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
              {node.image ? (
                <img
                  src={getImageUrl(node.image)}
                  alt={node.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-300 bg-white">
                  <MdImageNotSupported size={20} />
                </div>
              )}
            </div>
          </td>

          {/* CỘT 2: TÊN DANH MỤC & PHÂN CẤP */}
          <td className="p-6 border-r-4 border-black">
            <div className="flex items-center gap-3" style={{ paddingLeft: `${level * 40}px` }}>
              {level > 0 ? (
                <span className="text-orange-600 font-black text-2xl">↳</span>
              ) : (
                <div className="bg-black text-white p-1.5 shadow-[3px_3px_0_0_#ea580c]">
                    <MdLayers size={16} />
                </div>
              )}
              <div className="flex flex-col">
                <span className={`font-black tracking-tighter uppercase leading-none ${level === 0 ? 'text-2xl' : 'text-lg text-gray-700'}`}>
                    {node.name}
                </span>
                <span className="text-[10px] font-black text-gray-400 italic tracking-widest mt-1 lowercase">
                    id: {node.id} // slug: {node.slug}
                </span>
              </div>
            </div>
          </td>

          {/* CỘT 3: THỨ TỰ */}
          <td className="p-6 text-center border-r-4 border-black">
            <span className="inline-block px-3 py-1 bg-gray-100 border-2 border-black font-black text-xs shadow-[3px_3px_0_0_#000]">
                ORD#{node.sort_order}
            </span>
          </td>

          {/* CỘT 4: TRẠNG THÁI */}
          <td className="p-6 border-r-4 border-black text-center">
            <span className={`px-4 py-1 text-[10px] font-black uppercase italic border-2 border-black shadow-[4px_4px_0_0_#000] ${
              node.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 shadow-none'
            }`}>
              {node.status === 1 ? 'ACTIVE' : 'HIDDEN'}
            </span>
          </td>

          {/* CỘT 5: THAO TÁC */}
          <td className="p-6 text-right">
            <div className="flex justify-end gap-3 text-black">
              <Link href={`/admin/categories/${node.id}/show`} className="p-2 border-2 border-black hover:bg-blue-500 hover:text-white transition-all shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1">
                <MdVisibility size={20} />
              </Link>
              <Link href={`/admin/categories/${node.id}/edit`} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1">
                <MdEdit size={20} />
              </Link>
              <button 
                onClick={() => triggerDelete(node)}
                className="p-2 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </td>
        </tr>
        {node.children && node.children.length > 0 && renderTreeRows(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  if (loading) return (
    <div className="p-32 flex flex-col items-center justify-center space-y-6">
       <div className="w-20 h-20 border-[10px] border-black border-t-orange-600 animate-spin shadow-[8px_8px_0_0_#000]"></div>
       <p className="font-black italic animate-pulse uppercase tracking-[0.4em]">Syncing Category Hierarchy...</p>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 font-archivo uppercase animate-in fade-in duration-500">
      {/* 🔴 HEADER ĐỒNG BỘ */}
      <PageHeader 
        title="DANH MỤC" 
        subTitle="Product Hierarchy & Classification" 
        btnText="THÊM PHÂN LOẠI" 
        btnHref="/admin/categories/add" 
      />

      {/* 🔴 BẢNG DỮ LIỆU CÔNG NGHIỆP */}
      <div className="border-[6px] border-black bg-white shadow-[20px_20px_0_0_#000] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-white text-[10px] tracking-[0.3em]">
            <tr>
              <th className="p-6 border-r border-white/10 uppercase">Asset</th>
              <th className="p-6 border-r border-white/10 uppercase">Hierarchy Structure</th>
              <th className="p-6 border-r border-white/10 text-center w-32 uppercase">Order</th>
              <th className="p-6 border-r border-white/10 text-center w-40 uppercase">Status</th>
              <th className="p-6 text-right w-56 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-black">
            {categories.length > 0 ? (
              renderTreeRows(categories)
            ) : (
              <tr>
                <td colSpan="5" className="p-32 text-center">
                    <p className="font-black text-2xl italic text-gray-300 tracking-widest">DATABASE EMPTY. NO CATEGORIES DETECTED.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔴 MODAL XÓA DÙNG CHUNG */}
      <AdminModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
            deleteCategory(itemToDelete.id, itemToDelete.name);
            setIsModalOpen(false);
        }}
        title="THU HỒI PHÂN LOẠI"
        message={`CẨN TRỌNG: BẠN SẮP XÓA DANH MỤC "${itemToDelete?.name?.toUpperCase()}". HÀNH ĐỘNG NÀY CÓ THỂ LÀM MẤT LIÊN KẾT CỦA CÁC SẢN PHẨM TRONG HỆ THỐNG.`}
      />
    </div>
  );
}