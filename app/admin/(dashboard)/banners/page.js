'use client';

import { useState } from 'react';
import { useBanners } from '@/hooks/useBanners';
import { BANNER_PAGES } from '@/types';
import { getImageUrl } from '@/lib/utils';
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminModal from '@/components/admin/ui/AdminModal';
import Link from 'next/link';
import { MdEdit, MdDelete, MdVisibility, MdFilterList, MdSearch } from 'react-icons/md';

export default function BannersPage() {
    // 1. Quản lý bộ lọc (State duy nhất còn sót lại ở page)
    const [filters, setFilters] = useState({ page: '', keyword: '' });
    
    // 2. Quản lý Modal xác nhận xóa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState(null);

    // 3. Sử dụng Hook logic để lấy dữ liệu
    const { banners, loading, deleteBanner } = useBanners(filters);

    // 4. Định nghĩa cấu trúc các cột cho bảng Neobrutalism
    const columns = [
        {
            header: 'PREVIEW',
            render: (row) => (
                <div className="w-32 h-16 bg-gray-100 border-2 border-black overflow-hidden group">
                    <img 
                        src={getImageUrl(row.image)} 
                        alt={row.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                </div>
            )
        },
        { 
            header: 'TÊN BANNER', 
            accessor: 'name', 
            cellClassName: 'font-black text-xl tracking-tighter italic uppercase' 
        },
        { 
            header: 'VỊ TRÍ', 
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => (
                <span className="text-[10px] font-black bg-gray-100 px-3 py-1 border border-black italic">
                    {BANNER_PAGES[row.page] || row.page}
                </span>
            )
        },
        {
            header: 'TRẠNG THÁI',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => (
                <span className={`inline-flex items-center px-4 py-1 text-[10px] font-black italic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                    row.status === 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500 shadow-none'
                }`}>
                    {row.status === 1 ? 'LIVE' : 'HIDDEN'}
                </span>
            )
        },
        {
            header: 'QUẢN LÝ',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-6 text-black">
                    <Link href={`/admin/banners/${row.id}/show`} className="hover:text-orange-600 transition-transform hover:scale-125">
                        <MdVisibility size={22} />
                    </Link>
                    <Link href={`/admin/banners/${row.id}/edit`} className="hover:text-indigo-600 transition-transform hover:scale-125">
                        <MdEdit size={22} />
                    </Link>
                    <button 
                        onClick={() => {
                            setBannerToDelete(row);
                            setIsModalOpen(true);
                        }} 
                        className="hover:text-red-600 transition-transform hover:scale-125"
                    >
                        <MdDelete size={22} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER DÙNG CHUNG */}
            <PageHeader 
                title="BANNER" 
                subTitle="Visual Asset Management" 
                btnText="THÊM MỚI BANNER" 
                btnHref="/admin/banners/add" 
            />

            {/* 🔥 BỘ LỌC - NICKELBRONX CONTROL PANEL */}
            <div className="bg-white border-4 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                        <MdFilterList /> LỌC VỊ TRÍ
                    </label>
                    <select 
                        value={filters.page}
                        onChange={(e) => setFilters({...filters, page: e.target.value})}
                        className="w-full border-2 border-black p-4 font-black text-xs outline-none bg-orange-50 focus:bg-orange-100 transition-all cursor-pointer"
                    >
                        <option value="">-- TẤT CẢ VỊ TRÍ --</option>
                        {Object.entries(BANNER_PAGES).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                        ))}
                    </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                        <MdSearch /> TÌM KIẾM THEO TÊN
                    </label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="NHẬP TÊN BANNER CẦN TRUY XUẤT..." 
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

            {/* 🔴 BẢNG DỮ LIỆU DÙNG CHUNG */}
            <AdminTable 
                columns={columns} 
                data={banners} 
                loading={loading} 
                emptyText="KHÔNG TÌM THẤY BANNER NÀO TRONG DATABASE"
            />

            {/* 🔴 MODAL XÁC NHẬN XÓA */}
            <AdminModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => deleteBanner(bannerToDelete.id, bannerToDelete.name)}
                title="XÁC NHẬN GỠ BỎ"
                message={`HỆ THỐNG SẼ LOẠI BỎ BANNER: ${bannerToDelete?.name}. HÀNH ĐỘNG NÀY KHÔNG THỂ HOÀN TÁC!`}
            />
        </div>
    );
}