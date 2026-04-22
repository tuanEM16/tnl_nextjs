'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/services/productService';
import { MdArrowBack, MdEdit, MdInventory, MdRule, MdDashboard, MdCalendarToday } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function ShowProductPage() {
    const router = useRouter();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}`;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.getById(id);
                setProduct(res.data);
            } catch (error) {
                toast.error('KHÔNG TÌM THẤY DỮ LIỆU SẢN PHẨM');
                router.push('/admin/products');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);

    if (loading) return <div className="p-20 font-black italic animate-pulse uppercase tracking-[0.3em]">Decoding Product Data...</div>;
    if (!product) return null;

    return (
        <div className="space-y-12 pb-20 font-archivo uppercase">
            {/* HEADER - NickelBronx Style */}
            <header className="flex justify-between items-end border-b-4 border-black pb-8">
                <div>
                    <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 italic mb-2">Technical Specification Sheet</p>
                    <h1 className="text-7xl font-black tracking-tighter leading-none">{product.name}<span className="text-orange-600">.</span></h1>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => router.back()} className="flex items-center gap-2 font-black text-xs hover:text-orange-600 transition-colors uppercase">
                        <MdArrowBack size={20} /> QUAY LẠI
                    </button>
                    <Link href={`/admin/products/${id}/edit`} className="flex items-center gap-2 bg-black text-white px-6 py-3 text-xs font-black tracking-widest hover:bg-orange-600 transition-all shadow-[4px_4px_0px_0px_rgba(234,88,12,1)]">
                        <MdEdit size={18}/> CHỈNH SỬA
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* CỘT TRÁI: HÌNH ẢNH VÀ TRẠNG THÁI */}
                <div className="space-y-8">
                    <div className="border-4 border-black bg-white p-2 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                        <div className="relative aspect-square bg-gray-50 border-2 border-black overflow-hidden">
                            {product.thumbnail ? (
                                <img src={`${imageUrl}/${product.thumbnail}`} alt={product.name} className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex items-center justify-center h-full font-black text-gray-300">NO IMAGE</div>
                            )}
                        </div>
                    </div>

                    <div className="border-2 border-black p-6 space-y-4 bg-gray-50">
                        <h3 className="text-xs font-black flex items-center gap-2 border-b-2 border-black pb-2 italic"><MdInventory /> LOGISTICS INFO</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-400">TRẠNG THÁI:</span>
                                <span className={`px-3 py-1 font-black italic ${product.status === 1 ? 'bg-orange-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-300 text-gray-600'}`}>
                                    {product.status === 1 ? 'AVAILABLE / CÔNG KHAI' : 'HIDDEN / LƯU KHO'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-400">DANH MỤC:</span>
                                <span className="font-black">{product.category_name}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-gray-400">NGÀY CẬP NHẬT:</span>
                                <span className="font-black italic">{new Date(product.created_at).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: CHI TIẾT KỸ THUẬT */}
                <div className="lg:col-span-2 space-y-12">
                    {/* SECTION: THÔNG SỐ KỸ THUẬT */}
                    <section className="space-y-6">
                        <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-orange-600 pl-4 bg-gray-50 py-3">
                            <MdRule size={24}/> THÔNG SỐ KỸ THUẬT CHI TIẾT
                        </h2>
                        {product.attributes?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                                {product.attributes.map(attr => (
                                    <div key={attr.id} className="flex bg-white group hover:bg-orange-50 transition-colors">
                                        <span className="w-1/2 p-4 text-[10px] font-black text-gray-400 border-r border-black/10 group-hover:text-black">{attr.attribute_name}</span>
                                        <span className="w-1/2 p-4 font-black text-xs">{attr.value}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs italic text-gray-400 p-4 border-2 border-dashed border-gray-200 text-center">Không có thông số kỹ thuật được ghi nhận.</p>
                        )}
                    </section>

                    {/* SECTION: TIÊU CHUẨN & ỨNG DỤNG */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-2 italic">TIÊU CHUẨN</h3>
                            <p className="text-xs font-bold leading-relaxed bg-gray-100 p-4 border-l-4 border-black">{product.standard || 'CHƯA CẬP NHẬT'}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-black flex items-center gap-2 border-b-2 border-black pb-2 italic">ỨNG DỤNG</h3>
                            <p className="text-xs font-bold leading-relaxed bg-gray-100 p-4 border-l-4 border-black">{product.application || 'CHƯA CẬP NHẬT'}</p>
                        </div>
                    </section>

                    {/* SECTION: THƯ VIỆN ẢNH */}
                    {product.images?.length > 0 && (
                        <section className="space-y-6">
                            <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3">
                                <MdDashboard size={24}/> THƯ VIỆN HÌNH ẢNH
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {product.images.map(img => (
                                    <div key={img.id} className="border-2 border-black p-1 bg-white hover:scale-105 transition-transform shadow-sm">
                                        <img src={`${imageUrl}/${img.image}`} alt="" className="w-full h-32 object-cover border border-black/10" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SECTION: NỘI DUNG CHI TIẾT */}
                    {product.content && (
                        <section className="space-y-6">
                            <h2 className="flex items-center gap-3 text-xl font-black border-l-8 border-black pl-4 bg-gray-50 py-3 italic">MÔ TẢ CHI TIẾT SẢN PHẨM</h2>
                            <div className="border-2 border-black p-8 bg-white normal-case leading-loose font-medium shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                                <div className="prose max-w-none prose-orange" dangerouslySetInnerHTML={{ __html: product.content }} />
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}