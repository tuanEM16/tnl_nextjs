'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { postService } from '@/services/postService';
import Link from 'next/link';
import { MdArrowBack, MdEdit, MdCategory, MdAccessTime, MdLabelImportant, MdRemoveRedEye } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ShowPostPage() {
    const router = useRouter();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}`;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await postService.getById(id);
                setPost(res.data);
            } catch (error) {
                toast.error('KHÔNG TÌM THẤY DỮ LIỆU BÀI VIẾT');
                router.push('/admin/posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, router]);

    if (loading) return <div className="p-20 font-black italic animate-pulse uppercase tracking-[0.3em] text-center">Syncing Content Data...</div>;
    if (!post) return null;

    const postTypeLabels = { 
        post: 'TIN TỨC / BLOG', 
        page: 'TRANG TĨNH / STATIC', 
        project: 'DỰ ÁN / PROJECT' 
    };

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER - NickelBronx Edition */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Internal Publication View</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none text-black break-words max-w-4xl">
                        {post.title}<span className="text-orange-600">.</span>
                    </h1>
                </div>
                <div className="flex gap-4 shrink-0">
                    <button 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors uppercase tracking-widest"
                    >
                        <MdArrowBack size={20} /> QUAY LẠI
                    </button>
                    <Link 
                        href={`/admin/posts/${id}/edit`} 
                        className="flex items-center gap-2 bg-black text-white px-8 py-4 text-xs font-black tracking-[0.2em] hover:bg-orange-600 transition-all shadow-[6px_6px_0_0_#ea580c] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    >
                        <MdEdit size={18} /> CHỈNH SỬA
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* CỘT TRÁI: METADATA & STATUS (1/4) */}
                <div className="space-y-8">
                    {/* KHỐI TRẠNG THÁI */}
                    <div className="border-2 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
                        <h3 className="text-xs font-black flex items-center gap-2 border-b-2 border-black pb-2 italic"><MdLabelImportant /> HỒ SƠ BÀI VIẾT</h3>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-400">TRẠNG THÁI XUẤT BẢN:</span>
                                <span className={`w-fit px-3 py-1 font-black italic text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                                    post.status === 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500 shadow-none'
                                }`}>
                                    {post.status === 1 ? 'LIVE / ĐANG HIỂN THỊ' : 'DRAFT / BẢN NHÁP'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-gray-400">PHÂN LOẠI:</span>
                                <div className="flex items-center gap-2 font-black text-xs">
                                    <MdCategory className="text-orange-600" />
                                    {postTypeLabels[post.post_type]}
                                </div>
                            </div>

                            {post.category_name && (
                                <div className="flex flex-col gap-1 border-t border-black/5 pt-3">
                                    <span className="text-[9px] font-black text-gray-400">DANH MỤC:</span>
                                    <span className="font-black text-xs text-black">{post.category_name}</span>
                                </div>
                            )}

                            <div className="flex flex-col gap-1 border-t border-black/5 pt-3">
                                <span className="text-[9px] font-black text-gray-400">THỜI GIAN ĐĂNG:</span>
                                <div className="flex items-center gap-2 font-black text-xs">
                                    <MdAccessTime className="text-gray-400" />
                                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KHỐI XEM TRƯỚC URL (Nếu cần) */}
                    <div className="p-6 border-2 border-black border-dashed opacity-50 bg-gray-50">
                         <p className="text-[9px] font-black flex items-center gap-2"><MdRemoveRedEye size={14}/> TIP: NÊN KIỂM TRA LẠI CHÍNH TẢ TRƯỚC KHI CÔNG KHAI.</p>
                    </div>
                </div>

                {/* CỘT PHẢI: NỘI DUNG CHI TIẾT (3/4) */}
                <div className="lg:col-span-3 space-y-12">
                    {/* ẢNH ĐẠI DIỆN */}
                    {post.image && (
                        <div className="border-4 border-black bg-white p-2 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group">
                            <div className="relative aspect-video bg-gray-100 border-2 border-black overflow-hidden">
                                <img
                                    src={`${imageUrl}/${post.image}`}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* MÔ TẢ NGẮN (SAPO) */}
                    {post.description && (
                        <section className="bg-orange-50 border-l-8 border-orange-600 p-8 shadow-sm">
                            <h3 className="text-[10px] font-black text-orange-600 tracking-widest mb-2 uppercase">Mô tả tóm lược (Sapo)</h3>
                            <p className="text-xl font-black italic text-[#0B1F4F] leading-relaxed normal-case">
                                "{post.description}"
                            </p>
                        </section>
                    )}

                    {/* NỘI DUNG CHÍNH */}
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 italic uppercase">
                            Nội dung bài viết chi tiết
                        </h2>
                        <div className="border-2 border-black p-10 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
                            <article 
                                className="prose prose-lg max-w-none prose-orange normal-case leading-loose font-medium" 
                                dangerouslySetInnerHTML={{ __html: post.content }} 
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}