'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '@/components/public/ui/Container';
import ProductCard from '@/components/public/product/ProductCard';
import { usePublicProducts } from '@/hooks/public/usePublicProducts';
import { usePublicCategories } from '@/hooks/public/usePublicCategories';
import ProductBanner from '@/components/public/product/ProductBanner';
import SEO from '@/components/public/shared/SEO';

function ProductsContent() {
  const { categories } = usePublicCategories();
  const { products, loading, updateFilter } = usePublicProducts();
  
  // 1. ĐỌC URL TỪ TRÊN THANH ĐỊA CHỈ
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category');

  // 2. TỰ ĐỘNG GỌI HÀM LỌC KHI URL THAY ĐỔI
  useEffect(() => {
    if (categoryQuery && categories.length > 0) {
      // Tìm ID chuẩn từ slug hoặc ID trên URL
      const matchedCategory = categories.find(
        (c) => c.slug === categoryQuery || String(c.id) === categoryQuery
      );
      
      if (matchedCategory) {
        updateFilter('category_id', matchedCategory.id);
      } else {
        updateFilter('category_id', null);
      }
    } else if (!categoryQuery) {
      updateFilter('category_id', null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryQuery, categories]); 

  return (
    <section className="pb-20">
      <Container>
        {/* Đã bỏ <aside>, cho danh sách sản phẩm bung full width */}
        <div className="space-y-12">
          <div className="flex justify-between items-end border-b-4 border-black pb-4">
              <div className="flex flex-col">
                <span className="text-orange-600 font-black text-[10px] tracking-[0.3em] uppercase">// INVENTORY LIST</span>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none mt-1">
                  KHO HÀNG NIÊM YẾT
                </h2>
              </div>
              <span className="text-xs font-black bg-black text-white px-4 py-2 italic shadow-[4px_4px_0_0_#ea580c]">
                {products.length} MÃ HÀNG
              </span>
          </div>

          {/* GRID HIỂN THỊ CẬP NHẬT THÀNH 4 CỘT (Do đã bỏ sidebar) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse border-2 border-black/5"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}

          {/* TRƯỜNG HỢP KHÔNG CÓ HÀNG */}
          {products.length === 0 && !loading && (
            <div className="py-32 text-center border-4 border-dashed border-gray-100 flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl opacity-10">🏗️</div>
              <p className="font-black italic text-gray-300 tracking-widest uppercase text-xl">
                CHƯA CÓ DỮ LIỆU SẢN PHẨM PHÙ HỢP
              </p>
              <button 
                onClick={() => updateFilter('category_id', null)}
                className="text-orange-600 font-black uppercase text-xs border-b-2 border-orange-600 hover:text-black hover:border-black transition-all"
              >
                XÓA BỘ LỌC ĐỂ QUAY LẠI
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <ProductBanner />
      <SEO 
        title="KHO THÉP NIÊM YẾT | TÂN NGỌC LỰC" 
        description="Cung cấp các dòng thép tấm, thép hình, thép xây dựng chất lượng cao. Báo giá nhanh chóng, vận chuyển tận công trình tại Tây Ninh." 
      />
      {/* Next.js yêu cầu code có useSearchParams() phải được bọc trong Suspense */}
      <Suspense fallback={<div className="py-40 text-center font-black animate-pulse text-[#0e2188] tracking-widest uppercase">ĐANG KẾT NỐI KHO DỮ LIỆU...</div>}>
        <ProductsContent />
      </Suspense>
    </main>
  );
}