// app/(public)/products/[slug]/page.js
'use client';
import { use } from 'react';
import Container from '@/components/public/ui/Container';
import ProductSpecs from '@/components/public/product/ProductSpecs';
import SEO from '@/components/public/shared/SEO';
import { useProductDetail } from '@/hooks/public/usePublicProducts';
import { getImageUrl } from '@/lib/utils';

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const { product, loading } = useProductDetail(slug);

  if (loading) return <div className="py-20 text-center font-black animate-pulse uppercase">// ĐANG KIỂM ĐỊNH CHẤT LƯỢNG...</div>;
  if (!product) return <div className="py-20 text-center font-black uppercase">KHÔNG TÌM THẤY SẢN PHẨM</div>;

  return (
    <div className="py-20">
      <SEO title={product.name} description={product.description} />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* 🖼️ ẢNH SẢN PHẨM */}
          <div className="border-8 border-black shadow-[20px_20px_0_0_#000]">
            <img 
              src={getImageUrl(product.thumbnail)} 
              alt={product.name} 
              className="w-full grayscale hover:grayscale-0 transition-all duration-700" 
            />
          </div>

          {/* 📝 NỘI DUNG */}
          <div className="space-y-6">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black tracking-widest uppercase">
              {product.category_name || 'STEEL_PRODUCT'}
            </span>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none">{product.name}</h1>
            <p className="text-xl font-bold text-gray-500 italic">{product.description}</p>
            
            {/* 📊 BẢNG THÔNG SỐ ĐỘNG TỪ SQL */}
            <ProductSpecs product={product} />

            <div className="pt-10 flex gap-4">
               <a href="tel:0366638969" className="flex-1 bg-orange-600 text-white text-center py-5 font-black uppercase italic shadow-[8px_8px_0_0_#000]">
                 GỌI BÁO GIÁ NGAY: 0366.638.969
               </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}