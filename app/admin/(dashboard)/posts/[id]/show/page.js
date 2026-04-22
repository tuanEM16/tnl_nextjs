'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePost } from '@/hooks/usePosts'; // 🟢 Dùng Hook "não bộ" đã đúc
import { getImageUrl, formatDate } from '@/lib/utils';
import { POST_TYPES, GLOBAL_STATUS } from '@/types';

// TRIỆU HỒI VŨ KHÍ UI
import PageHeader from '@/components/admin/ui/PageHeader';

import { MdEdit, MdCategory, MdAccessTime, MdLabelImportant, MdRemoveRedEye, MdOutlineDescription, MdHistoryEdu } from 'react-icons/md';
import Link from 'next/link';

export default function ShowPostPage() {
    const { id } = useParams();
    const router = useRouter();

    // 1. TRIỆU HỒI HOOK (Dọn sạch useState & useEffect rườm rà)
    const { post, loading } = usePost(id);

    // 2. MÀN HÌNH CHỜ (CỰC LÌ)
    if (loading) return (
        <div className="p-32 text-center font-black italic animate-pulse uppercase tracking-[0.4em]">
            SYNCHRONIZING CONTENT DATA...
        </div>
    );

    if (!post) return null;

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* 🔴 HEADER NICKELBRONX */}
            <PageHeader 
                title="XEM BÀI VIẾT" 
                subTitle="Internal Publication View" 
                btnText="CHỈNH SỬA" 
                btnHref={`/admin/posts/${id}/edit`}
                isBack={true} 
                backHref="/admin/posts"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                
                {/* 🔵 CỘT TRÁI: METADATA PANEL (1/4) */}
                <aside className="space-y-8">
                    <div className="border-4 border-black p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
                        <h3 className="text-sm font-black flex items-center gap-2 border-b-4 border-black pb-3 italic uppercase">
                            <MdLabelImportant size={20} className="text-orange-600" /> Hồ sơ bài viết
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 italic">TRẠNG THÁI HỆ THỐNG</p>
                                <div className={`w-full p-3 font-black text-center italic border-4 border-black shadow-[4px_4px_0_0_#000] ${
                                    post.status === 1 ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'
                                }`}>
                                    {post.status === 1 ? 'LIVE / ĐANG HIỂN THỊ' : 'DRAFT / BẢN NHÁP'}
                                </div>
                            </div>

                            <div className="space-y-1 border-t-2 border-black pt-4">
                                <p className="text-[10px] font-black text-gray-400 italic text-right">PHÂN LOẠI</p>
                                <div className="flex items-center justify-end gap-2 font-black text-sm">
                                    <MdCategory className="text-orange-600" size={18} />
                                    {POST_TYPES[post.post_type]}
                                </div>
                            </div>

                            {post.category_name && (
                                <div className="space-y-1 border-t-2 border-black pt-4">
                                    <p className="text-[10px] font-black text-gray-400 italic text-right">DANH MỤC TIN</p>
                                    <p className="font-black text-sm text-black text-right">{post.category_name}</p>
                                </div>
                            )}

                            <div className="space-y-1 border-t-2 border-black pt-4">
                                <p className="text-[10px] font-black text-gray-400 italic text-right">THỜI GIAN KHỞI TẠO</p>
                                <div className="flex items-center justify-end gap-2 font-black text-xs">
                                    <MdAccessTime className="text-gray-400" />
                                    {formatDate(post.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-4 border-black border-dashed bg-gray-50 flex gap-4 items-start shadow-[6px_6px_0_0_#000]">
                         <MdRemoveRedEye size={24} className="shrink-0" />
                         <p className="text-[9px] font-black leading-relaxed italic">
                            MẸO: KIỂM TRA HIỂN THỊ TRÊN MOBILE TRƯỚC KHI SHARE LINK BÀI VIẾT LÊN CÁC NỀN TẢNG MXH.
                         </p>
                    </div>
                </aside>

                {/* 🟠 CỘT PHẢI: CHI TIẾT NỘI DUNG (3/4) */}
                <div className="lg:col-span-3 space-y-12">
                    
                    {/* KHỐI TIÊU ĐỀ LỚN */}
                    <div className="space-y-4">
                        <h2 className="text-6xl font-black tracking-tighter leading-[0.9] text-black uppercase break-words">
                            {post.title}
                        </h2>
                        <div className="h-2 w-32 bg-orange-600 shadow-[4px_4px_0_0_#000]"></div>
                    </div>

                    {/* ẢNH ĐẠI DIỆN */}
                    {post.image && (
                        <div className="border-[6px] border-black bg-white p-3 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
                            <div className="relative aspect-video bg-gray-100 border-2 border-black overflow-hidden group">
                                <img
                                    src={getImageUrl(post.image)}
                                    alt={post.title}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute top-4 left-4 bg-black text-white px-4 py-1 text-[10px] font-black italic tracking-widest border-2 border-white/20 shadow-lg">
                                    MAIN_VISUAL_ASSET
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MÔ TẢ NGẮN (SAPO) */}
                    {post.description && (
                        <section className="bg-orange-50 border-4 border-black p-10 shadow-[10px_10px_0_0_#ea580c] relative overflow-hidden">
                            <MdOutlineDescription className="absolute -right-4 -top-4 text-orange-200" size={120} />
                            <h3 className="text-[10px] font-black text-orange-600 tracking-[0.3em] mb-4 uppercase italic flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-orange-600"></span> Editorial Summary
                            </h3>
                            <p className="text-2xl font-black italic text-black leading-tight normal-case relative z-10">
                                "{post.description}"
                            </p>
                        </section>
                    )}

                    {/* NỘI DUNG CHÍNH */}
                    <section className="space-y-8">
                        <h2 className="flex items-center gap-4 text-2xl font-black border-l-[12px] border-black pl-6 bg-gray-100 py-4 italic uppercase shadow-sm">
                            <MdHistoryEdu size={32} className="text-orange-600" /> Chi tiết nội dung
                        </h2>
                        
                        <div className="border-4 border-black p-12 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
                            {/* Dùng prose để style cho các thẻ HTML từ Editor */}
                            <article 
                                className="prose prose-xl max-w-none prose-orange normal-case leading-relaxed font-medium text-black
                                            prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
                                            prose-img:border-4 prose-img:border-black prose-img:shadow-xl" 
                                dangerouslySetInnerHTML={{ __html: post.content }} 
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}