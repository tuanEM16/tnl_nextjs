'use client';

import { use } from 'react';
import { useCategory } from '@/hooks/useCategories'; // 🟢 Triệu hồi Hook "nội công"
import { getImageUrl, formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// TRIỆU HỒI VŨ KHÍ UI
import PageHeader from '@/components/admin/ui/PageHeader';

import { MdEdit, MdHistory, MdPerson, MdLayers, MdLink, MdDescription, MdSettings, MdSync } from 'react-icons/md';

export default function ShowCategoryPage({ params }) {
    // 1. UNWRAP PARAMS (Next.js 15 Style)
    const { id } = use(params);
    const router = useRouter();

    // 2. DÙNG HOOK (Dọn sạch code thủ công)
    const { category, loading } = useCategory(id);

    // 3. MÀN HÌNH CHỜ TRUY XUẤT
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-in fade-in duration-500">
            <div className="w-20 h-20 border-[10px] border-black border-t-orange-600 animate-spin shadow-[8px_8px_0_0_#000]"></div>
            <p className="font-black uppercase italic tracking-[0.4em] text-xl">Extracting Taxonomy Data...</p>
        </div>
    );

    if (!category) return (
        <div className="text-center p-32 space-y-6">
            <h1 className="text-9xl font-black opacity-10 italic">404</h1>
            <p className="font-black text-red-600 uppercase tracking-widest text-2xl text-center">Liên kết danh mục đã bị gãy hoặc không tồn tại!</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 font-archivo uppercase animate-in fade-in zoom-in-95 duration-500">
            
            {/* 🔴 HEADER ĐIỀU HƯỚNG */}
            <PageHeader 
                title="HỒ SƠ DANH MỤC" 
                subTitle={`Master Classification / ID: ${id}`} 
                btnText="CHỈNH SỬA" 
                btnHref={`/admin/categories/${id}/edit`}
                isBack={true}
                backHref="/admin/categories"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* 🔵 CỘT TRÁI: VISUAL & STATUS (4/12) */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="border-[6px] border-black p-1 bg-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] group">
                        <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                            {category.image ? (
                                <img
                                    src={getImageUrl(category.image)}
                                    alt={category.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-200">
                                    <MdLayers size={80} />
                                    <span className="font-black italic text-2xl mt-4">NO_ASSET</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* STATUS BLOCK */}
                    <div className="border-4 border-black p-8 bg-gray-50 space-y-6 shadow-[8px_8px_0_0_#000]">
                        <div className="flex justify-between items-center border-b-2 border-black/10 pb-4">
                            <span className="text-[10px] font-black text-gray-400 italic">SYSTEM STATUS</span>
                            <span className={`px-5 py-1 text-[10px] font-black tracking-[0.2em] border-2 border-black shadow-[3px_3px_0_0_#000] ${
                                category.status === 1 ? 'bg-green-500 text-white' : 'bg-red-600 text-white shadow-none'
                            }`}>
                                {category.status === 1 ? 'ACTIVE' : 'DISABLED'}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black text-gray-400 italic block">SORT SEQUENCE</span>
                                <span className="font-black text-4xl italic leading-none">{category.sort_order?.toString().padStart(2, '0')}</span>
                            </div>
                            <MdSettings size={32} className="text-black/10" />
                        </div>
                    </div>
                </div>

                {/* 🟠 CỘT PHẢI: INFORMATION GRID (8/12) */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* TIÊU ĐỀ LỚN */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-orange-600">
                            <MdLayers size={24} />
                            <span className="text-[11px] font-black tracking-[0.4em]">Primary Classification Label</span>
                        </div>
                        <h2 className="text-7xl font-black tracking-tighter leading-[0.85] text-black break-words">
                            {category.name}
                        </h2>
                        <div className="h-3 w-40 bg-orange-600 shadow-[4px_4px_0_0_#000]"></div>
                    </div>

                    {/* TECHNICAL DATA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdLink className="text-black" /> URL_SLUG_PATH
                            </label>
                            <div className="font-black text-lg bg-gray-100 p-5 border-l-[12px] border-black shadow-sm lowercase">
                                /{category.slug}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 italic flex items-center gap-2">
                                <MdLayers className="text-black" /> HIERARCHY_LEVEL
                            </label>
                            <div className="font-black text-lg p-5 border-b-4 border-black/10 bg-orange-50/50">
                                {category.parent_id === 0 ? '● MASTER_ROOT' : `● SUB_CATEGORY (ID: ${category.parent_id})`}
                            </div>
                        </div>
                    </div>

                    {/* DESCRIPTION BOX */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 italic tracking-widest flex items-center gap-2">
                            <MdDescription className="text-black" /> ARCHITECTURAL DESCRIPTION
                        </label>
                        <div className="bg-white border-4 border-black p-10 font-medium normal-case leading-relaxed text-black shadow-[10px_10px_0_0_rgba(0,0,0,0.05)] relative min-h-[200px]">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 flex items-center justify-center border-l-4 border-b-4 border-black font-black italic text-gray-300">
                                DOC
                            </div>
                            <p className="text-lg italic text-gray-800">
                                {category.description || 'HỆ THỐNG CHƯA CẬP NHẬT DỮ LIỆU MÔ TẢ CHI TIẾT CHO PHÂN LOẠI NÀY.'}
                            </p>
                        </div>
                    </div>

                    {/* FOOTER METADATA */}
                    <footer className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t-[6px] border-black">
                        <div className="flex items-center gap-5 group">
                            <div className="bg-black text-white p-4 shadow-[4px_4px_0_0_#ea580c] group-hover:rotate-12 transition-transform">
                                <MdHistory size={24}/>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 italic uppercase tracking-widest">Initialization Date</p>
                                <p className="font-black text-lg">{formatDate(category.created_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 group">
                            <div className="bg-orange-600 text-white p-4 shadow-[4px_4px_0_0_#000] group-hover:-rotate-12 transition-transform">
                                <MdPerson size={24}/>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-400 italic uppercase tracking-widest">Operational Controller</p>
                                <p className="font-black text-lg underline decoration-4 decoration-orange-600/30">ADMIN_UUID_{category.created_by || 'SYS'}</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}