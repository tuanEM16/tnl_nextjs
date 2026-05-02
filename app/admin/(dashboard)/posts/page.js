'use client';

import { usePosts } from '@/hooks/usePosts';
import { getImageUrl } from '@/lib/utils';
// 🟢 BỔ SUNG IMPORT ABOUT_LAYOUTS
import { GLOBAL_STATUS, ABOUT_LAYOUTS } from '@/types';

// TRIỆU HỒI VŨ KHÍ NICKELBRONX
import PageHeader from '@/components/admin/ui/PageHeader';
import AdminModal from '@/components/admin/ui/AdminModal';

import { MdAdd, MdSearch, MdCategory, MdVisibility, MdEdit, MdDelete, MdDragIndicator, MdSettings } from 'react-icons/md';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { postService } from '@/services/postService';

export default function PostsPage() {
    const postTypeLabels = {
        post: 'TIN TỨC',
        page: 'TRANG TĨNH',
        project: 'DỰ ÁN',
    };

    // 1. TRIỆU HỒI HOOK
    const {
        posts, categories, pageCategories, loading, filters,
        setFilter, handleTypeChange, handleDelete
    } = usePosts({ post_type: 'post', category_id: '', keyword: '' });

    // 2. QUẢN LÝ TRẠNG THÁI KÉO THẢ (Optimistic UI)
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Đồng bộ items khi dữ liệu từ hook posts thay đổi
    useEffect(() => {
        setItems(posts);
    }, [posts]);

    const handleReorder = async (newOrder) => {
        setItems(newOrder);

        try {
            const ids = newOrder.map(item => item.id);
            const res = await postService.updatePostsOrder(ids);

            if (res.success) {
                console.log("%c ✅ ĐÃ CHỐT VỊ TRÍ TRÊN DB", "color: green; font-weight: bold;");
            }
        } catch (error) {
            console.error("LỖI KHÔNG LƯU ĐƯỢC VỊ TRÍ:", error);
            setItems(posts);
        }
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase text-black">
            {/* 🔴 HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-black pb-10">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-3 italic">Content Management System</p>
                    <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">BÀI VIẾT<span className="text-orange-600">.</span></h1>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Link href="/admin/posts/categories" className="flex items-center gap-2 border-2 border-black px-4 py-3 text-[10px] font-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]">
                        <MdCategory size={16} /> DANH MỤC TIN
                    </Link>

                    <Link href="/admin/posts/page-categories" className="flex items-center gap-2 border-2 border-black px-4 py-3 text-[10px] font-black bg-zinc-100 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_0_#000]">
                        <MdSettings size={16} /> VỊ TRÍ WEB
                    </Link>

                    <Link href="/admin/posts/add" className="flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] font-black shadow-[4px_4px_0_0_#ea580c] hover:bg-orange-600 transition-all">
                        <MdAdd size={18} /> THÊM MỚI
                    </Link>
                </div>
            </header>

            {/* 🔴 BỘ LỌC */}
            <div className="bg-white border-2 border-black p-6 flex flex-wrap items-center gap-12 shadow-[8px_8px_0_0_#000]">
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

                <div className={`flex flex-col gap-2 ${filters.post_type !== 'post' ? 'opacity-30 pointer-events-none' : ''}`}>
                    <span className="text-[9px] font-black text-gray-400 italic">DANH MỤC TIN</span>
                    <select
                        value={filters.category_id}
                        onChange={(e) => setFilter('category_id', e.target.value)}
                        className="border-b-4 border-black bg-transparent py-2 text-[10px] font-black outline-none min-w-[200px] cursor-pointer"
                    >
                        <option value="">TẤT CẢ DANH MỤC</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                
                {filters.post_type === 'page' && (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-gray-400 italic">VỊ TRÍ HIỂN THỊ</span>
                            <Link href="/admin/posts/page-categories" className="text-orange-600 hover:scale-110 transition-transform">
                                <MdAdd size={14} />
                            </Link>
                        </div>
                        <select
                            value={filters.page_category_id}
                            onChange={(e) => setFilter('page_category_id', e.target.value)}
                            className="border-b-4 border-black bg-transparent py-2 text-[10px] font-black outline-none min-w-[200px] cursor-pointer"
                        >
                            <option value="">-- TẤT CẢ VỊ TRÍ --</option>
                            {pageCategories.map((pc) => (
                                <option key={pc.id} value={pc.id}>{pc.name}</option>
                            ))}
                        </select>
                    </div>
                )}
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

            {/* 🔴 BẢNG KÉO THẢ NICKELBRONX STYLE */}
            <div className="border-4 border-black bg-white shadow-[12px_12px_0_0_#000]">
                {/* Header Bảng */}
                <div className="grid grid-cols-12 gap-4 bg-black text-white p-4 font-black text-[10px] tracking-widest uppercase">
                    <div className="col-span-1 text-center">DRAG</div>
                    <div className="col-span-2">MEDIA</div>
                    <div className="col-span-4">TIÊU ĐỀ & SLUG</div>
                    <div className="col-span-2">PHÂN LOẠI</div>
                    <div className="col-span-1 text-center">TRẠNG THÁI</div>
                    <div className="col-span-2 text-right">THAO TÁC</div>
                </div>

                {loading ? (
                    <div className="p-20 text-center font-black animate-pulse uppercase tracking-[0.5em]">ĐANG TRIỆU HỒI DỮ LIỆU...</div>
                ) : (
                    <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="divide-y-2 divide-black">
                        {items.map((row) => (
                            <Reorder.Item
                                key={row.id}
                                value={row}
                                className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-zinc-50 transition-colors cursor-default"
                            >
                                {/* 🔘 Nút cầm kéo */}
                                <div className="col-span-1 flex justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-black transition-colors">
                                    <MdDragIndicator size={28} />
                                </div>

                                {/* Media */}
                                <div className="col-span-2">
                                    <div className="w-24 h-16 bg-gray-100 border-2 border-black overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-[4px_4px_0_0_#000]">
                                        <img src={getImageUrl(row.image)} alt={row.title} className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                {/* Tiêu đề */}
                                <div className="col-span-4 space-y-1">
                                    <Link href={`/admin/posts/${row.id}/show`} className="block font-black text-2xl tracking-tighter uppercase leading-none hover:text-orange-600 transition-colors line-clamp-1">
                                        {row.title}
                                    </Link>
                                    <p className="text-[9px] font-black text-gray-400 uppercase italic">ID: {row.id} / SLUG: {row.slug}</p>
                                </div>

                                {/* 🟢 PHÂN LOẠI (NÂNG CẤP ĐỂ HIỂN THỊ THÊM KHỐI ABOUT) */}
                                <div className="col-span-2 flex flex-col items-start gap-1">
                                    <div className="flex flex-wrap items-center gap-1">
                                        <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase">
                                            {postTypeLabels[row.post_type]}
                                        </span>
                                        {/* 🎯 NẾU LÀ ABOUT PAGE THÌ HIỆN THÊM LOẠI KHỐI (HERO, VISION...) */}
                                        {row.post_type === 'page' && ABOUT_LAYOUTS[row.layout] && (
                                            <span className="text-[8px] font-black bg-orange-100 text-orange-800 border border-orange-400 px-1.5 py-0.5 uppercase shadow-[2px_2px_0_0_#ea580c]">
                                                {ABOUT_LAYOUTS[row.layout]}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-orange-600 italic tracking-tighter mt-0.5 block">
                                        {row.post_type === 'page'
                                            ? (row.page_category_name || 'CHƯA GÁN VỊ TRÍ')
                                            : (row.category_name || 'CHƯA PHÂN LOẠI')
                                        }
                                    </span>
                                </div>

                                {/* Trạng thái */}
                                <div className="col-span-1 text-center">
                                    <span className={`inline-flex px-3 py-1 text-[10px] font-black italic border-2 border-black ${row.status === 1 ? 'bg-green-500 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 text-gray-400 border-gray-200 shadow-none'}`}>
                                        {row.status === 1 ? 'LIVE' : 'DRAFT'}
                                    </span>
                                </div>

                                {/* Thao tác */}
                                <div className="col-span-2 flex justify-end gap-6 text-black">
                                    <Link href={`/admin/posts/${row.id}/show`} className="hover:text-orange-600 transition-transform hover:scale-125"><MdVisibility size={22} /></Link>
                                    <Link href={`/admin/posts/${row.id}/edit`} className="hover:text-indigo-600 transition-transform hover:scale-125"><MdEdit size={22} /></Link>
                                    <button onClick={() => { setItemToDelete(row); setIsModalOpen(true); }} className="hover:text-red-600 transition-transform hover:scale-125">
                                        <MdDelete size={22} />
                                    </button>
                                </div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </div>

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