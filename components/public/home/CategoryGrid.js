// components/public/home/CategoryGrid.js
'use client';
import Link from 'next/link';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import { usePublicCategories } from '@/hooks/public/usePublicCategories';
import { MdArrowForward } from 'react-icons/md';
// 🟢 1. PHẢI IMPORT HÀM CHUẨN ĐÃ SIẾT Ở ĐÂY
import { getImageUrl } from '@/lib/utils'; 

export default function CategoryGrid() {
  const { categories, loading } = usePublicCategories();

  if (loading) return null;

  return (
    <section className="py-24 bg-gray-50 border-y-8 border-black">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <SectionTitle 
            subtitle="Danh mục thép" 
            title="Dòng sản phẩm chủ lực" 
          />
          <Link 
            href="/products" 
            className="mb-4 font-black italic border-b-4 border-orange-600 hover:text-orange-600 transition-colors flex items-center gap-2"
          >
            TẤT CẢ SẢN PHẨM <MdArrowForward />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/products?category=${cat.id}`}
              className="group relative aspect-square bg-black border-4 border-black overflow-hidden shadow-[10px_10px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              {/* 🟢 2. DÙNG HÀM CHUẨN: getImageUrl(cat.image) */}
              <img 
                src={getImageUrl(cat.image)} 
                alt={cat.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 grayscale group-hover:grayscale-0"
              />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-orange-500 font-black text-xs tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity uppercase">
                  // Explore Category
                </span>
                <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter leading-tight">
                  {cat.name}
                </h3>
                <div className="w-12 h-2 bg-orange-600 mt-4 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}