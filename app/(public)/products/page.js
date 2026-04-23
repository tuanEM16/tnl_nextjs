'use client';
import Container from '@/components/public/ui/Container';
import ProductCard from '@/components/public/product/ProductCard';
import ProductFilter from '@/components/public/product/ProductFilter';
import { usePublicProducts } from '@/hooks/public/usePublicProducts';
import { usePublicCategories } from '@/hooks/public/usePublicCategories';
import SEO from '@/components/public/shared/SEO';

export default function ProductsPage() {
  const { categories } = usePublicCategories();
  const { products, loading, filters, updateFilter } = usePublicProducts();

  return (
    <div className="py-16">
      <SEO title="Sản phẩm thép xây dựng" description="Danh mục thép tấm, thép hình, thép xây dựng chất lượng cao tại Tân Ngọc Lực." />
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* SIDEBAR BÊN TRÁI: BỘ LỌC */}
          <div className="lg:col-span-1">
            <ProductFilter 
              categories={categories}
              currentCategory={filters.category_id}
              onCategoryChange={(val) => updateFilter('category_id', val)}
            />
          </div>

          {/* DANH SÁCH BÊN PHẢI: GRID SẢN PHẨM */}
          <div className="lg:col-span-3 space-y-12">
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                  KHO HÀNG NIÊM YẾT
                </h1>
                <span className="text-[10px] font-black bg-black text-white px-3 py-1">
                  {products.length} UNITS
                </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-20">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-[3/4] bg-gray-200 animate-pulse border-4 border-black"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map(item => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            )}

            {products.length === 0 && !loading && (
              <div className="py-20 text-center border-4 border-dashed border-gray-100">
                <p className="font-black italic text-gray-300 tracking-widest uppercase">
                  KHÔNG TÌM THẤY DỮ LIỆU PHÙ HỢP VỚI BỘ LỌC
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}