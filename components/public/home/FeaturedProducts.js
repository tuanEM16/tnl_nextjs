'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from '../ui/Container';
import { usePublicProducts } from '@/hooks/public/usePublicProducts';
import { getImageUrl } from '@/lib/utils';
import Link from 'next/link';

export default function FeaturedProducts() {
  const { products, loading } = usePublicProducts({ featured: 1 });
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    if (products?.length > 0 && !hoveredProduct) {
      setHoveredProduct(products[0]);
    }
  }, [products, hoveredProduct]);

  if (loading || !products?.length) return null;

  return (
    <section className="py-32 bg-white font-sans border-y border-zinc-100 select-none">
      <Container>
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-12 h-[2px] bg-[#e33127]"></span>
            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
              Technical Solutions
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#0e2188]">
            SẢN PHẨM <span className="text-zinc-300">CỐT LÕI</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between min-h-[600px]">
          
          {/* 🟠 CỘT 1 (TRÁI): ENGINEERING_SPECS */}
          <div className="lg:w-[45%] sticky top-32">
            <AnimatePresence mode="wait">
              {hoveredProduct && (
                <motion.div
                  key={hoveredProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[#e33127] font-bold text-lg">/</span>
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-[#0e2188]">
                      Thông số kỹ thuật
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 border border-zinc-100 rounded-sm overflow-hidden shadow-sm">
                    {hoveredProduct.attributes?.length > 0 ? (
                      <>
                        {hoveredProduct.attributes.map((attr, idx) => (
                          <div 
                            key={attr.id || idx} 
                            className="flex flex-col p-6 border-b border-r border-zinc-100 hover:bg-zinc-50 transition-colors group"
                          >
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 group-hover:text-[#e33127] transition-colors">
                              {attr.attribute_name}
                            </span>
                            <span className="font-bold text-xl text-[#0e2188] tracking-tight">
                              {attr.value}
                            </span>
                          </div>
                        ))}
                        {/* Empty fill for odd numbers */}
                        {hoveredProduct.attributes.length % 2 !== 0 && (
                          <div className="hidden md:block bg-zinc-50/50 border-b border-zinc-100"></div>
                        )}
                      </>
                    ) : (
                      <div className="col-span-2 p-12 text-center font-medium text-zinc-300 italic">
                        Dữ liệu đang được cập nhật...
                      </div>
                    )}
                  </div>

                  <Link 
                    href={`/products/${hoveredProduct.slug}`} 
                    className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-[#0e2188] group"
                  >
                    <span className="border-b-2 border-[#e33127] pb-1 group-hover:text-[#e33127] transition-all">
                      Xem chi tiết sản phẩm
                    </span>
                    <span className="text-[#e33127] group-hover:translate-x-2 transition-transform">→</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🟢 CỘT 2 (GIỮA): UNIT VISUAL */}
          <div className="lg:w-[28%] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {hoveredProduct && (
                <motion.div 
                  key={`img-${hoveredProduct.id}`} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }} 
                  transition={{ duration: 0.6 }}
                  className="relative w-full aspect-[3/4] bg-zinc-100 rounded-sm overflow-hidden shadow-2xl"
                >
                  <img 
                    src={getImageUrl(hoveredProduct.thumbnail)} 
                    className="w-full h-full object-cover transition-transform duration-1000" 
                    alt={hoveredProduct.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e2188]/40 to-transparent" />
                  
                  {/* Decorative corner */}
                  <div className="absolute bottom-0 left-0 bg-[#e33127] p-4">
                     <div className="w-6 h-6 border-l-2 border-b-2 border-white"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 🔵 CỘT 3 (PHẢI): MASTER_LIST */}
          <div className="lg:w-[22%] h-[600px] flex flex-col">
            <div className="bg-[#0e2188] text-white p-5 rounded-t-sm">
                <h3 className="font-bold uppercase text-[10px] tracking-[0.3em]">Danh mục sản phẩm</h3>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar border-x border-b border-zinc-100 bg-white">
              <div className="divide-y divide-zinc-50">
                {products.map((p) => (
                  <button 
                    key={p.id} 
                    onMouseEnter={() => setHoveredProduct(p)} 
                    className={`w-full text-left py-6 px-6 transition-all group flex items-center justify-between ${
                      hoveredProduct?.id === p.id ? 'bg-zinc-50' : 'hover:bg-zinc-50/50'
                    }`}
                  >
                    <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                      hoveredProduct?.id === p.id ? 'text-[#e33127]' : 'text-[#0e2188]/60 group-hover:text-[#0e2188]'
                    }`}>
                      {p.name}
                    </span>
                    {hoveredProduct?.id === p.id && (
                      <motion.span layoutId="activeArrow" className="text-[#e33127]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 text-[10px] text-zinc-300 font-bold uppercase tracking-widest text-right">
              Scroll to browse all units
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}