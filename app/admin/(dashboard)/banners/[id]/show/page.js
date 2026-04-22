'use client';

import { useParams } from 'next/navigation';
import { useBanner } from '@/hooks/useBanners'; // Triệu hồi "não bộ"
import { BANNER_PAGES } from '@/types';
import { getImageUrl, formatDate } from '@/lib/utils';

// "VŨ KHÍ" UI DÙNG CHUNG
import PageHeader from '@/components/admin/ui/PageHeader';
import { MdLocationOn, MdLayers, MdLink, MdDescription } from 'react-icons/md';

export default function ShowBannerPage() {
    const { id } = useParams();
    
    // 1. CHỈ CẦN 1 DÒNG NÀY LÀ CÓ ĐỦ DỮ LIỆU & LOADING
    const { banner, loading } = useBanner(id);

    // 2. MÀN HÌNH CHỜ (LOADING) ĐÚNG CHẤT NICKELBRONX
    if (loading || !banner) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-black border-t-orange-600 animate-spin shadow-[4px_4px_0_0_#000]"></div>
                <p className="font-black italic uppercase tracking-widest animate-pulse">
                    RETRIEVING ASSET #{id}...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER SẠCH BONG */}
            <PageHeader
                title="BANNER INFO"
                subTitle="Visual Asset Specification"
                btnText="CHỈNH SỬA"
                btnHref={`/admin/banners/${id}/edit`}
                isBack={true} 
            />

            {/* MAIN CONTENT */}
            <div className="flex flex-col lg:flex-row gap-12">

                {/* CỘT TRÁI: PREVIEW HÌNH ẢNH */}
                <div className="lg:w-1/2">
                    <div className="border-4 border-black bg-white p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <div className="relative aspect-video bg-gray-100 border-2 border-black overflow-hidden group">
                            <img
                                src={getImageUrl(banner.image)}
                                alt={banner.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-black italic tracking-widest border-2 border-white/20">
                                LIVE PREVIEW
                            </div>
                        </div>
                    </div>

                    {/* KHỐI TRẠNG THÁI HỆ THỐNG */}
                    <div className="mt-8 border-4 border-black p-6 bg-orange-50 flex justify-between items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-black italic tracking-widest text-gray-500">SYSTEM STATUS:</span>
                        <span className={`px-4 py-2 font-black italic text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black ${
                            banner.status === 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-400 shadow-none'
                        }`}>
                            {banner.status === 1 ? 'ACTIVE / ĐANG HIỂN THỊ' : 'DISABLED / TẠM ẨN'}
                        </span>
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG SỐ CHI TIẾT */}
                <div className="lg:w-1/2 space-y-8">
                    {/* Tên Banner - Header Level 2 */}
                    <section className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 italic tracking-[0.2em]">IDENTIFICATION NAME</label>
                        <h2 className="text-5xl font-black tracking-tighter text-black border-l-[12px] border-black pl-6 py-2 bg-white">
                            {banner.name}
                        </h2>
                    </section>

                    {/* Grid Thông số - Bảng Thép Style */}
                    <div className="grid grid-cols-2 gap-px bg-black border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.1)]">
                        <div className="bg-white p-6 space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 italic uppercase">
                                <MdLocationOn size={16} /> TRANG HIỂN THỊ
                            </label>
                            <p className="font-black text-lg tracking-tight">
                                {BANNER_PAGES[banner.page] || banner.page}
                            </p>
                        </div>
                        <div className="bg-white p-6 space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 italic uppercase">
                                <MdLayers size={16} /> THỨ TỰ ƯU TIÊN
                            </label>
                            <p className="font-black text-lg tracking-tight italic">LEVEL #{banner.sort_order}</p>
                        </div>
                        <div className="bg-white p-6 space-y-2 col-span-2 border-t-2 border-black">
                            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 italic uppercase">
                                <MdLink size={16} /> REDIRECT URL
                            </label>
                            <p className="font-bold text-sm text-blue-600 break-all lowercase underline decoration-2 underline-offset-4">
                                {banner.link || '--- KHÔNG CÓ LIÊN KẾT ---'}
                            </p>
                        </div>
                    </div>

                    {/* Mô tả nội bộ - Documentation Style */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black flex items-center gap-2 border-b-4 border-black pb-3 italic uppercase text-black">
                            <MdDescription size={20} /> Internal Documentation
                        </h3>
                        <div className="p-8 bg-gray-50 border-4 border-black border-dashed font-bold text-sm normal-case leading-relaxed min-h-[120px] shadow-inner text-black">
                            {banner.description || 'Chưa có thông tin mô tả chi tiết cho visual asset này.'}
                        </div>
                    </section>

                    {/* Metadata Footer */}
                    <div className="pt-4 flex justify-between items-center border-t-2 border-black/5">
                        <div className="text-[9px] font-black text-gray-300 tracking-[0.4em] flex gap-4 uppercase">
                            <span>ASSET ID: {id}</span>
                            <span>DATABASE STATUS: SYNCED</span>
                        </div>
                        <div className="text-[10px] font-black text-black bg-yellow-400 px-3 py-1 border-2 border-black italic shadow-[3px_3px_0_0_#000]">
                            CREATED: {formatDate(banner.created_at)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}