'use client';

import { usePosts } from '@/hooks/usePosts';
import { getImageUrl } from '@/lib/utils';
import { GLOBAL_STATUS } from '@/types';

// TRIỆU HỒI VŨ KHÍ NICKELBRONX
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminTable from '@/components/admin/ui/AdminTable';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdAdd, MdSearch, MdCategory, MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import Link from 'next/link';
import { useState } from 'react';

export default function PostsPage() {
    // 1. CHỈ SỬ DỤNG 3 LOẠI BÀI VIẾT CHUẨN
    const postTypeLabels = {
        post: 'TIN TỨC',
        page: 'TRANG TĨNH',
        project: 'DỰ ÁN',
    };

    // 2. TRIỆU HỒI HOOK (Não bộ xử lý Filter & Data)
    const {
        posts, categories, loading, filters,
        setFilter, handleTypeChange, handleDelete
    } = usePosts({ post_type: 'post', category_id: '', keyword: '' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // 3. ĐỊNH NGHĨA CỘT BẢNG (COLUMNS)
    const columns = [
        {
            header: 'MEDIA',
            render: (row) => (
                <div className="w-24 h-16 bg-gray-100 border-2 border-black overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-[4px_4px_0_0_#000]">
                    <img src={getImageUrl(row.image)} alt={row.title} className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            header: 'TIÊU ĐỀ & SLUG',
            render: (row) => (
                <div className="space-y-1">
                    <Link href={`/admin/posts/${row.id}/show`} className="block font-black text-2xl tracking-tighter uppercase leading-none hover:text-orange-600 transition-colors line-clamp-1">
                        {row.title}
                    </Link>
                    <p className="text-[9px] font-black text-gray-400 uppercase italic">
                        ID: {row.id} / SLUG: {row.slug}
                    </p>
                </div>
            )
        },
        {
            header: 'PHÂN LOẠI',
            render: (row) => (
                <div className="flex flex-col gap-1">
                    {/* Loại bài: TIN TỨC / TRANG TĨNH / DỰ ÁN */}
                    <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 w-fit uppercase">
                        {postTypeLabels[row.post_type]}
                    </span>

                    {/* Danh mục: Bốc từ nhiều nguồn để tránh bị mất */}
                    <span className="text-[10px] font-black text-orange-600 italic tracking-tighter">
                        {row.category_name || row.category?.name || (row.post_type === 'post' ? 'CHƯA PHÂN LOẠI' : '---')}
                    </span>
                </div>
            )
        },
        {
            header: 'TRẠNG THÁI',
            className: 'text-center',
            cellClassName: 'text-center',
            render: (row) => (
                <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black italic shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black ${row.status === 1 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400 shadow-none border-gray-200'
                    }`}>
                    {row.status === 1 ? 'LIVE' : 'DRAFT'}
                </span>
            )
        },
        {
            header: 'THAO TÁC',
            className: 'text-right',
            render: (row) => (
                <div className="flex justify-end gap-6 text-black">
                    <Link href={`/admin/posts/${row.id}/show`} className="hover:text-orange-600 transition-transform hover:scale-125"><MdVisibility size={22} /></Link>
                    <Link href={`/admin/posts/${row.id}/edit`} className="hover:text-indigo-600 transition-transform hover:scale-125"><MdEdit size={22} /></Link>
                    <button
                        onClick={() => { setItemToDelete(row); setIsModalOpen(true); }}
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
            {/* 🔴 HEADER SẠCH BONG */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">Content Management System</p>
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">BÀI VIẾT<span className="text-orange-600">.</span></h1>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/posts/categories" className="flex items-center gap-2 border-2 border-black px-6 py-3 text-[10px] font-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]">
                        <MdCategory size={16} /> DANH MỤC
                    </Link>
                    <Link href="/admin/posts/add" className="flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] font-black shadow-[4px_4px_0_0_#ea580c] hover:bg-orange-600 transition-all">
                        <MdAdd size={18} /> THÊM MỚI
                    </Link>
                </div>
            </header>

            {/* 🔴 BỘ LỌC CHUẨN 3 LOẠI */}
            <div className="bg-white border-2 border-black p-6 flex flex-wrap items-center gap-12 shadow-[8px_8px_0_0_#000]">
                {/* Selector Loại bài */}
                <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-gray-400 italic">PHÂN LOẠI</span>
                    <div className="flex border-2 border-black p-1 gap-1 bg-gray-50">
                        {Object.keys(postTypeLabels).map((type) => (
                            <button
                                key={type}
                                onClick={() => handleTypeChange(type)}
                                className={`px-6 py-2 text-[10px] font-black transition-all ${filters.post_type === type
                                    ? 'bg-black text-white shadow-[2px_2px_0_0_#ea580c]'
                                    : 'text-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {postTypeLabels[type]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh mục (Chỉ hiện khi là Tin tức) */}
                <div className={`flex flex-col gap-2 ${filters.post_type !== 'post' ? 'opacity-30 pointer-events-none' : ''}`}>
                    <span className="text-[9px] font-black text-gray-400 italic">DANH MỤC TIN</span>
                    <select
                        value={filters.category_id}
                        onChange={(e) => setFilter('category_id', e.target.value)}
                        className="border-b-4 border-black bg-transparent py-2 text-[10px] font-black outline-none min-w-[200px] cursor-pointer"
                    >
                        <option value="">TẤT CẢ DANH MỤC</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                                </option>
                        ))}
                    </select>
                </div>

                {/* Ô tìm kiếm */}
                <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                    <span className="text-[9px] font-black text-gray-400 italic">TÌM KIẾM TIÊU ĐỀ</span>
                    <div className="relative">
                        <MdSearch className="absolute left-0 top-1/2 -translate-y-1/2" size={20} />
                        <input
                            type="text"
                            placeholder="GÕ TỪ KHÓA..."
                            value={filters.keyword}
                            onChange={(e) => setFilter('keyword', e.target.value)}
                            className="w-full pl-8 py-2 border-b-4 border-black bg-transparent text-sm font-black focus:border-orange-600 outline-none transition-colors placeholder:text-gray-200"
                        />
                    </div>
                </div>
            </div>

            {/* 🔴 BẢNG DỮ LIỆU DÙNG CHUNG */}
            <AdminTable columns={columns} data={posts} loading={loading} />

            {/* 🔴 MODAL XÁC NHẬN XÓA */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => handleDelete(itemToDelete.id, itemToDelete.title)}
                title="TIÊU HỦY NỘI DUNG"
                message={`HÀNH ĐỘNG NÀY SẼ GỠ BỎ VĨNH VIỄN BÀI VIẾT: ${itemToDelete?.title}.`}
            />
        </div>
    );
}