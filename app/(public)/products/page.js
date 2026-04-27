'use client';
import Container from '@/components/public/ui/Container';
import ProductCard from '@/components/public/product/ProductCard';
import ProductFilter from '@/components/public/product/ProductFilter';
import { usePublicProducts } from '@/hooks/public/usePublicProducts';
import { usePublicCategories } from '@/hooks/public/usePublicCategories';
import ProductBanner from '@/components/public/product/ProductBanner';
import SEO from '@/components/public/shared/SEO';

export default function ProductsPage() {
  const { categories } = usePublicCategories();
  const { products, loading, filters, updateFilter } = usePublicProducts();

  return (
    <main className="min-h-screen bg-white">
      {/* 🔴 1. BANNER TRÀN VIÊN - ĐẶT NGOÀI CONTAINER ĐỂ DẠT TRÁI MAX TẦM */}
      <ProductBanner />
      
      {/* 🟢 2. SEO ENGINE */}
      <SEO 
        title="KHO THÉP NIÊM YẾT | TÂN NGỌC LỰC" 
        description="Cung cấp các dòng thép tấm, thép hình, thép xây dựng chất lượng cao. Báo giá nhanh chóng, vận chuyển tận công trình tại Tây Ninh." 
      />
      
      {/* 🔵 3. PHẦN NỘI DUNG CHÍNH - CÁCH BANNER MỘT KHOẢNG (py-20) */}
      <section className="">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            
            {/* SIDEBAR BÊN TRÁI: BỘ LỌC (Sticky để khi lướt sản phẩm vẫn thấy) */}
            <aside className="lg:col-span-1 lg:sticky lg:top-32 space-y-8">
              <div className="border-l-4 border-orange-600 pl-4 mb-6">
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Bộ lọc thép</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phân loại theo quy cách</p>
              </div>
              
              <ProductFilter 
                categories={categories}
                currentCategory={filters.category_id}
                onCategoryChange={(val) => updateFilter('category_id', val)}
              />
            </aside>

            {/* DANH SÁCH BÊN PHẢI: GRID SẢN PHẨM */}
            <div className="lg:col-span-3 space-y-12">
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

              {/* GRID HIỂN THỊ */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse border-2 border-black/5"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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

          </div>
        </Container>
      </section>
    </main>
  );
}