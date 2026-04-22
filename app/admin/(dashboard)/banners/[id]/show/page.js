'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { bannerService } from '@/services/bannerService';
import Link from 'next/link';
import { MdArrowBack, MdEdit, MdLocationOn, MdLayers, MdLink, MdDescription } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ShowBannerPage() {
    const router = useRouter();
    const { id } = useParams();
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);


    const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

    const pageLabels = {
        home: 'TRANG CHỦ',
        product: 'SẢN PHẨM',
        product_detail: 'CHI TIẾT SẢN PHẨM',
        about: 'GIỚI THIỆU',
        project: 'DỰ ÁN',
        news: 'TRUYỀN THÔNG',
        contact: 'LIÊN HỆ',
    };

    useEffect(() => {
        const fetchBanner = async () => {
            try {
                const res = await bannerService.getById(id);
                setBanner(res.data);
            } catch (error) {
                toast.error('KHÔNG TÌM THẤY DỮ LIỆU BANNER');
                router.push('/admin/banners');
            } finally {
                setLoading(false);
            }
        };
        fetchBanner();
    }, [id, router]);

    if (loading) return <div className="p-20 font-black italic animate-pulse uppercase tracking-[0.3em] text-center">Reading Visual Data...</div>;
    if (!banner) return null;

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER - NickelBronx Edition */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Visual Asset Specification</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none text-black">
                        BANNER INFO<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors uppercase tracking-widest"
                    >
                        <MdArrowBack size={20} /> QUAY LẠI
                    </button>
                    <Link 
                        href={`/admin/banners/${id}/edit`} 
                        className="flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-black tracking-[0.2em] shadow-[6px_6px_0px_0px_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        <MdEdit size={18} /> CHỈNH SỬA
                    </Link>
                </div>
            </header>

            {/* MAIN CONTENT - BỐ CỤC ẢNH TRÁI, NỘI DUNG PHẢI */}
            <div className="flex flex-col lg:flex-row gap-12">
                
                {/* CỘT TRÁI: PREVIEW HÌNH ẢNH (1/2) */}
                <div className="lg:w-1/2">
                    <div className="border-4 border-black bg-white p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                        <div className="relative aspect-video bg-gray-100 border-2 border-black overflow-hidden group">
                            <img
                                src={`${imageUrl}/${banner.image}`}
                                alt={banner.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-black italic tracking-widest">
                                LIVE PREVIEW
                            </div>
                        </div>
                    </div>
                    
                    {/* KHỐI TRẠNG THÁI DƯỚI ẢNH */}
                    <div className="mt-8 border-2 border-black p-6 bg-orange-50 flex justify-between items-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <span className="text-[10px] font-black italic">TRẠNG THÁI HỆ THỐNG:</span>
                        <span className={`px-4 py-1 font-black italic text-[10px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                            banner.status === 1 ? 'bg-black text-white' : 'bg-gray-300 text-gray-600 shadow-none'
                        }`}>
                            {banner.status === 1 ? 'ACTIVE / ĐANG HIỂN THỊ' : 'DISABLED / TẠM ẨN'}
                        </span>
                    </div>
                </div>

                {/* CỘT PHẢI: THÔNG SỐ CHI TIẾT (1/2) */}
                <div className="lg:w-1/2 space-y-8">
                    {/* Tên Banner */}
                    <section className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 italic">IDENTIFICATION NAME</label>
                        <h2 className="text-4xl font-black tracking-tighter text-black border-l-8 border-black pl-4 py-1">
                            {banner.name}
                        </h2>
                    </section>

                    {/* Grid Thông số */}
                    <div className="grid grid-cols-2 gap-px bg-black border-2 border-black shadow-sm">
                        <div className="bg-white p-6 space-y-1">
                            <label className="flex items-center gap-2 text-[9px] font-black text-gray-400 italic"><MdLocationOn /> TRANG HIỂN THỊ</label>
                            <p className="font-black text-sm">{pageLabels[banner.page] || banner.page}</p>
                        </div>
                        <div className="bg-white p-6 space-y-1">
                            <label className="flex items-center gap-2 text-[9px] font-black text-gray-400 italic"><MdLayers /> THỨ TỰ ƯU TIÊN</label>
                            <p className="font-black text-sm">LEVEL #{banner.sort_order}</p>
                        </div>
                        <div className="bg-white p-6 space-y-1 md:col-span-2 border-t border-black/10">
                            <label className="flex items-center gap-2 text-[9px] font-black text-gray-400 italic"><MdLink /> ĐƯỜNG DẪN LIÊN KẾT (URL)</label>
                            <p className="font-bold text-xs text-blue-600 break-all lowercase">
                                {banner.link || '--- KHÔNG CÓ LIÊN KẾT ---'}
                            </p>
                        </div>
                    </div>

                    {/* Mô tả */}
                    <section className="space-y-4">
                        <h3 className="text-xs font-black flex items-center gap-2 border-b-2 border-black pb-2 italic uppercase">
                            <MdDescription /> Mô tả nội bộ
                        </h3>
                        <div className="p-6 bg-gray-50 border-2 border-black border-dashed font-bold text-xs normal-case leading-relaxed min-h-[100px]">
                            {banner.description || 'Chưa có thông tin mô tả cho banner này.'}
                        </div>
                    </section>

                    {/* Thời gian */}
                    <div className="text-[9px] font-black text-gray-300 tracking-[0.3em] flex justify-end gap-2">
                        <span>CREATED AT:</span>
                        <span>{new Date(banner.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}