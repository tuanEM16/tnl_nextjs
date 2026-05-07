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
  
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category');

  useEffect(() => {
    if (categoryQuery && categories.length > 0) {
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
  }, [categoryQuery, categories]); 

  return (
    <section className="py-20 lg:py-32 bg-white font-sans">
      <Container>
        <div className="space-y-16">
          {/* 🔴 HEADER SECTION: Premium Minimalism */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="w-12 h-[2px] bg-[#e33127]"></span>
                    <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">Inventory List</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter leading-none text-[#0e2188]">
                  KHO HÀNG <span className="text-zinc-300">NIÊM YẾT</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sẵn có trong kho</span>
                <span className="text-2xl font-bold text-[#0e2188] italic tracking-tighter">
                  {products.length.toString().padStart(2, '0')} <span className="text-xs uppercase not-italic text-zinc-400">Mã hàng</span>
                </span>
              </div>
          </div>

          {/* 🟢 PRODUCT GRID: 4 Columns desktop */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="aspect-square bg-zinc-50 animate-pulse rounded-sm"></div>
                    <div className="h-4 bg-zinc-50 animate-pulse w-2/3"></div>
                    <div className="h-6 bg-zinc-50 animate-pulse w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {products.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          )}

          {/* 🟡 EMPTY STATE */}
          {products.length === 0 && !loading && (
            <div className="py-32 text-center border border-dashed border-zinc-100 rounded-sm flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-zinc-50 flex items-center justify-center text-3xl opacity-50">🏗️</div>
              <p className="font-bold text-zinc-300 tracking-[0.2em] uppercase text-sm italic">
                Chưa có dữ liệu sản phẩm trong mục này
              </p>
              <button 
                onClick={() => updateFilter('category_id', null)}
                className="group flex items-center gap-3 text-[#e33127] font-bold uppercase text-[10px] tracking-widest transition-all"
              >
                <span className="border-b border-[#e33127] pb-1 group-hover:text-[#0e2188] group-hover:border-[#0e2188]">Xóa bộ lọc để quay lại</span>
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
      <Suspense fallback={
        <div className="py-60 flex flex-col items-center justify-center bg-white">
            <div className="w-10 h-10 border-2 border-zinc-100 border-t-[#e33127] rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-[#0e2188] uppercase tracking-[0.3em] text-[10px]">Đang kết nối kho dữ liệu...</p>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </main>
  );
}