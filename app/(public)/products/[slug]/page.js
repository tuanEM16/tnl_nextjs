'use client';
import { use } from 'react';
import { useProductDetail } from '@/hooks/public/usePublicProducts';
import { getImageUrl } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import ProductSpecs from '@/components/public/product/ProductSpecs';
import SEO from '@/components/public/shared/SEO';
import ProductBanner from '@/components/public/product/ProductBanner';

export default function ProductDetailPage({ params }) {
    const { slug } = use(params); 
    const { product, loading } = useProductDetail(slug);

    if (loading) return (
        <div className="py-40 flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-zinc-100 border-t-[#e33127] rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-[#0e2188] uppercase tracking-[0.3em] text-xs">
                Đang kiểm định chất lượng...
            </p>
        </div>
    );

    if (!product) return (
        <div className="py-40 text-center bg-white">
            <h2 className="text-2xl font-bold text-[#0e2188] uppercase tracking-tighter">
                Không tìm thấy hồ sơ sản phẩm
            </h2>
            <div className="mt-4 w-12 h-1 bg-[#e33127] mx-auto"></div>
        </div>
    );

    return (
        <div className="bg-white font-sans">
            <ProductBanner />
            <SEO title={product.name} description={product.description} />
            
            <Container className="py-20 lg:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    
                    {/* 🖼️ TRÁI: HÌNH ẢNH SẢN PHẨM (PREMIUM MINIMALISM) */}
                    <div className="relative">
                        <div className="relative z-10 aspect-square overflow-hidden rounded-sm bg-zinc-50 shadow-2xl shadow-zinc-200/50">
                            <img 
                                src={getImageUrl(product.thumbnail)} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                            />
                        </div>
                        {/* Decorative Accent */}
                        <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#e33127]/5 -z-0"></div>
                        <div className="absolute -bottom-8 -right-8 text-8xl font-bold text-zinc-50 -z-0 select-none">
                            TNL
                        </div>
                    </div>

                    {/* 📝 PHẢI: THÔNG TIN CHI TIẾT */}
                    <div className="flex flex-col">
                        <div className="space-y-6 mb-10">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-[2px] bg-[#e33127]"></span>
                                <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                                    {product.category_name || 'STEEL SOLUTION'}
                                </span>
                            </div>
                            
                            <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-[1.1] text-[#0e2188]">
                                {product.name}
                            </h1>
                        </div>

                        <div className="mb-10">
                            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed font-medium border-l-4 border-[#e33127] pl-8">
                                {product.description || "Dòng sản phẩm thép chất lượng cao, đáp ứng đầy đủ các tiêu chuẩn kỹ thuật khắt khe nhất của ngành xây dựng."}
                            </p>
                        </div>

                        {/* 📊 BẢNG THÔNG SỐ KỸ THUẬT */}
                        <div className="bg-zinc-50 p-1 rounded-sm border border-zinc-100 mb-10">
                            <ProductSpecs product={product} />
                        </div>

                        {/* 📞 HÀNH ĐỘNG (CTA) */}
                        <div className="pt-6">
                            <a 
                                href="tel:0366638969" 
                                className="inline-flex items-center justify-center w-full md:w-auto px-12 py-5 bg-[#e33127] text-white font-bold uppercase text-xs tracking-[0.2em] rounded-sm transition-all duration-300 hover:bg-[#0e2188] hover:shadow-xl hover:shadow-red-500/20"
                            >
                                Liên hệ báo giá ngay
                            </a>
                        </div>
                    </div>
                </div>

                {/* PHẦN NỘI DUNG CHI TIẾT (CONTENT) */}
                {product.content && (
                    <div className="mt-32 pt-20 border-t border-zinc-100">
                        <div className="flex items-center gap-4 mb-16">
                            <h2 className="text-3xl font-bold uppercase tracking-tight text-[#0e2188]">
                                Chi tiết kỹ thuật & Ứng dụng
                            </h2>
                            <div className="flex-1 h-[1px] bg-zinc-100"></div>
                        </div>
                        
                        <div 
                            className="prose prose-zinc prose-lg md:prose-xl max-w-none 
                                prose-headings:text-[#0e2188] prose-headings:uppercase prose-headings:font-bold
                                prose-p:text-zinc-600 prose-p:leading-loose
                                prose-strong:text-[#0e2188]
                                prose-img:rounded-sm prose-img:shadow-2xl"
                            dangerouslySetInnerHTML={{ __html: product.content }}
                        />
                    </div>
                )}
            </Container>
        </div>
    );
}