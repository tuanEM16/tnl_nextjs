'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/useProducts'; // 🟢 Triệu hồi nội công đại ca đã đúc
import { getImageUrl } from '@/lib/utils';

// VŨ KHÍ UI NICKELBRONX
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdAdd, MdEdit, MdDelete, MdVisibility, MdSearch, MdInventory, MdLayers } from 'react-icons/md';

export default function ProductsPage() {
    // 1. TRIỆU HỒI HOOK (Sạch bóng đống useEffect cũ)
    const { products, categories, loading, filters, setFilter, handleDelete } = useProducts();

    // 2. QUẢN LÝ MODAL XÓA (Uy tín hơn confirm mặc định)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const triggerDelete = (prod) => {
        setItemToDelete(prod);
        setIsModalOpen(true);
    };

    // 3. ĐỊNH NGHĨA CỘT BẢNG (CHUYÊN NGHIỆP)
    const columns = [
        {
            header: 'ASSET / MEDIA',
            render: (row) => (
                <div className="relative w-24 h-16 border-2 border-black bg-gray-100 overflow-hidden group/img shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]">
                    <img 
                        src={getImageUrl(row.thumbnail)} 
                        alt={row.name} 
                        className="w-full h-full object-cover grayscale group-hover/img:grayscale-0 transition-all duration-500 scale-110 group-hover/img:scale-100"
                        onError={(e) => e.target.src = 'https://placehold.co/200x150?text=STEEL_TNL'}
                    />
                </div>
            )
        },
        {
            header: 'THÔNG TIN KỸ THUẬT',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    <Link href={`/admin/products/${row.id}/edit`} className="font-black text-2xl tracking-tighter hover:text-orange-600 transition-colors uppercase leading-none">
                        {row.name}
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black bg-black text-white px-2 py-0.5 italic tracking-widest">STD: {row.standard || 'TCVN'}</span>
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><MdLayers size={14}/> {row.category_name || 'CHƯA PHÂN LOẠI'}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'TRẠNG THÁI',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => (
                <span className={`px-4 py-1 text-[9px] font-black uppercase italic border-2 border-black shadow-[4px_4px_0_0_#000] ${
                    row.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 shadow-none'
                }`}>
                    {row.status === 1 ? 'AVAILABLE' : 'HIDDEN'}
                </span>
            )
        },
        {
            header: 'QUẢN LÝ KHO',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-3 text-black">
                    <Link href={`/admin/products/${row.id}/show`} className="p-2 border-2 border-black hover:bg-blue-500 hover:text-white transition-all shadow-[3px_3px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        <MdVisibility size={20} />
                    </Link>
                    <Link href={`/admin/products/${row.id}/edit`} className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all shadow-[3px_3px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">
                        <MdEdit size={20} />
                    </Link>
                    <button 
                        onClick={() => triggerDelete(row)}
                        className="p-2 border-2 border-black text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-[3px_3px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <MdDelete size={20} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase animate-in fade-in duration-500">
            {/* 🔴 HEADER NICKELBRONX ĐỈNH CAO */}
            <PageHeader 
                title="sản phẩm" 
                subTitle="Industrial Inventory Management" 
                btnText="NHẬP THÉP MỚI" 
                btnHref="/admin/products/add" 
            />

            {/* 🔴 BỘ LỌC CHIẾN THUẬT */}
            <div className="bg-white border-[6px] border-black flex flex-col md:flex-row shadow-[12px_12px_0_0_#000]">
                <div className="md:w-72 border-b-4 md:border-b-0 md:border-r-4 border-black relative bg-orange-50">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <MdLayers className="text-black" />
                    </div>
                    <select
                        value={filters.category_id}
                        onChange={(e) => setFilter('category_id', e.target.value)}
                        className="w-full p-6 pl-12 font-black text-xs tracking-widest bg-transparent focus:outline-none cursor-pointer appearance-none"
                    >
                        <option value="">TẤT CẢ DANH MỤC</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name.toUpperCase()}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex-1 flex items-center px-8 gap-4 bg-white focus-within:bg-orange-50/30 transition-colors">
                    <MdSearch size={28} className="text-black" />
                    <input
                        type="text"
                        placeholder="TRUY QUÉT MÃ THÉP, TÊN SẢN PHẨM..."
                        value={filters.keyword}
                        onChange={(e) => setFilter('keyword', e.target.value)}
                        className="w-full py-6 font-black text-lg outline-none bg-transparent placeholder:text-gray-200"
                    />
                </div>
            </div>

            {/* 🔴 BẢNG DỮ LIỆU NẶNG ĐÔ */}
            <div className="border-[6px] border-black bg-white shadow-[20px_20px_0_0_#000] overflow-hidden">
                <AdminTable 
                    columns={columns} 
                    data={products} 
                    loading={loading} 
                    emptyText="KHO HÀNG TRỐNG RỖNG - CHƯA PHÁT HIỆN DỮ LIỆU THÉP."
                />
            </div>

            {/* 🔴 MODAL XÁC NHẬN TIÊU HỦY */}
            <AdminModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    handleDelete(itemToDelete.id, itemToDelete.name);
                    setIsModalOpen(false);
                }}
                title="TIÊU HỦY DỮ LIỆU"
                message={`CẨN TRỌNG: HÀNH ĐỘNG NÀY SẼ XÓA VĨNH VIỄN SẢN PHẨM "${itemToDelete?.name?.toUpperCase()}" KHỎI HỆ THỐNG KHO. KHÔNG THỂ PHỤC HỒI.`}
            />
        </div>
    );
}