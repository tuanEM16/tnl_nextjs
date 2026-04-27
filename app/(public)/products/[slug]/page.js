'use client';
import { use, useEffect } from 'react';
import Container from '@/components/public/ui/Container';
import ProductSpecs from '@/components/public/product/ProductSpecs';
import SEO from '@/components/public/shared/SEO';
import { useProductDetail } from '@/hooks/public/usePublicProducts';
import ProductBanner from '@/components/public/product/ProductBanner';
import { getImageUrl } from '@/lib/utils';

export default function ProductDetailPage({ params }) {
    // 🟢 1. Giải mã slug từ URL
    const { slug } = use(params); 
    
    // 🟢 2. Gọi hook lấy dữ liệu (Hàm này sẽ gọi /api/products/slug/${slug})
    const { product, loading } = useProductDetail(slug);

    if (loading) return (
        <div className="py-40 text-center font-black animate-pulse uppercase tracking-[0.5em]">
            // ĐANG KIỂM ĐỊNH CHẤT LƯỢNG THÉP...
        </div>
    );

    if (!product) return (
        <div className="py-40 text-center font-black uppercase text-red-600">
            KHÔNG TÌM THẤY HỒ SƠ SẢN PHẨM TRÊN HỆ THỐNG
        </div>
    );

    return (
        <div className=" bg-white">
             <ProductBanner />
            <SEO title={product.name} description={product.description} />
            
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    
                    {/* 🖼️ TRÁI: HÌNH ẢNH SẢN PHẨM (NICKELBRONX STYLE) */}
                    <div className="relative group">
                        <div className="border-[10px] border-black shadow-[30px_30px_0_0_#000] overflow-hidden bg-gray-100">
                            <img 
                                src={getImageUrl(product.thumbnail)} 
                                alt={product.name} 
                                className="w-full grayscale hover:grayscale-0 transition-all duration-700" 
                            />
                        </div>
                        {/* Lớp khung trang trí góc */}
                        <div className="absolute -top-6 -left-6 w-24 h-24 border-t-8 border-l-8 border-orange-600 -z-10"></div>
                    </div>

                    {/* 📝 PHẢI: THÔNG TIN CHI TIẾT */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <span className="inline-block bg-black text-white px-4 py-2 text-xs font-black tracking-widest uppercase italic">
                                // {product.category_name || 'STEEL_ITEM'}
                            </span>
                            <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none text-black">
                                {product.name}
                            </h1>
                            <div className="h-2 w-32 bg-orange-600"></div>
                        </div>

                        <p className="text-xl font-bold text-gray-600 leading-relaxed border-l-8 border-black pl-8 italic">
                            {product.description || "Dòng sản phẩm thép chất lượng cao, đáp ứng đầy đủ các tiêu chuẩn kỹ thuật khắt khe nhất của ngành xây dựng."}
                        </p>

                        {/* 📊 BẢNG THÔNG SỐ KỸ THUẬT ĐỘNG (JOIN TỪ SQL) */}
                        <ProductSpecs product={product} />

                        {/* 📞 HÀNH ĐỘNG */}
                        <div className="pt-10 flex flex-wrap gap-6">
                            <a 
                                href="tel:0366638969" 
                                className="flex-1 bg-black text-white text-center py-6 font-black uppercase italic shadow-[10px_10px_0_0_#ea580c] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                            >
                                GỌI BÁO GIÁ: 0366.638.969
                            </a>
                        </div>
                    </div>
                </div>

                {/* PHẦN NỘI DUNG CHI TIẾT (CONTENT) */}
                {product.content && (
                    <div className="mt-32 pt-20 border-t-8 border-black">
                        <h2 className="text-4xl font-black italic uppercase mb-10 tracking-tighter">// CHI TIẾT KỸ THUẬT & ỨNG DỤNG</h2>
                        <div 
                            className="prose prose-xl max-w-none font-medium text-gray-800 leading-loose"
                            dangerouslySetInnerHTML={{ __html: product.content }}
                        />
                    </div>
                )}
            </Container>
        </div>
    );
}