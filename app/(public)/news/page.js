'use client';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePublicPosts } from '@/hooks/public/usePublicPosts';
import { getImageUrl, formatDate } from '@/lib/utils';
import { postService } from '@/services/postService';
import Container from '@/components/public/ui/Container';
import Link from 'next/link';
import NewsBanner from '@/components/public/news/NewsBanner';
import { MdArrowForward } from 'react-icons/md';

const generateSlug = (str) => {
    if (!str) return '';
    return str.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/đ/g, "d").replace(/Đ/g, "d")           
        .replace(/[^a-z0-9]/g, "-")                      
        .replace(/-+/g, "-").replace(/^-|-$/g, "");      
};

function NewsContent() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await postService.getCategories();
        const data = Array.isArray(res) ? res : res?.data || [];
        setCategories(data);
      } catch (error) {
        console.error('Lỗi bốc danh mục:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      if (categoryQuery) {
        const matchedCategory = categories.find(cat => {
          const catSlug = cat.slug || generateSlug(cat.name);
          return String(cat.id) === categoryQuery || catSlug === categoryQuery;
        });
        
        if (matchedCategory) {
          setActiveCategory(matchedCategory.id);
        } else {
          setActiveCategory(null);
        }
      } else {
        setActiveCategory(null);
      }
    }
  }, [categoryQuery, categories]);

  const queryFilters = useMemo(() => {
    const params = { post_type: 'post', limit: 100 };
    if (activeCategory !== null) params.category_id = activeCategory;
    return params;
  }, [activeCategory]);

  const { posts, loading } = usePublicPosts(queryFilters);

  return (
    <Container className="py-20 lg:py-32">
      {/* 🔴 HEADER TRUYỀN THÔNG - Premium Style */}
      <div className="mb-16 space-y-4">
        <div className="flex items-center gap-3">
            <span className="w-12 h-[2px] bg-[#e33127]"></span>
            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">Media Center</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-[#0e2188] leading-none">
          TRUYỀN <span className="text-zinc-300">THÔNG</span>
        </h1>
      </div>

      {/* 🔵 BỘ LỌC CATEGORY - Minimalist Design */}
      <div className="flex flex-wrap gap-4 mb-16">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-8 py-3 rounded-sm font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
            activeCategory === null
              ? 'bg-[#e33127] text-white border-[#e33127] shadow-lg shadow-red-500/20'
              : 'bg-white text-zinc-400 border-zinc-100 hover:border-[#0e2188] hover:text-[#0e2188]'
          }`}
        >
          Tất cả
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-8 py-3 rounded-sm font-bold text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
              activeCategory === cat.id
                ? 'bg-[#e33127] text-white border-[#e33127] shadow-lg shadow-red-500/20'
                : 'bg-white text-zinc-400 border-zinc-100 hover:border-[#0e2188] hover:text-[#0e2188]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 🟢 GRID BÀI VIẾT - Clean Card Layout */}
      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-zinc-100 border-t-[#e33127] rounded-full animate-spin mb-4"></div>
            <p className="font-bold text-[#0e2188] uppercase tracking-widest text-[10px]">Đang tải bản tin...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group flex flex-col h-full bg-white transition-all duration-500"
              >
                {/* Image Wrap */}
                <div className="aspect-[16/10] overflow-hidden rounded-sm bg-zinc-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-zinc-200">
                  <img
                    src={getImageUrl(post.image)}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    alt={post.title}
                  />
                </div>

                {/* Content Wrap */}
                <div className="py-8 flex flex-col flex-grow space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-[#e33127]"></span>
                    <span className="text-[10px] font-bold text-[#e33127] uppercase tracking-widest">
                        {formatDate(post.created_at)} • {post.category_name || 'TIN TỨC'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold uppercase tracking-tight text-[#0e2188] leading-tight group-hover:text-[#e33127] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-zinc-500 font-medium line-clamp-3 text-sm leading-relaxed">
                    {post.description}
                  </p>

                  <div className="pt-4 mt-auto flex items-center gap-3 group/btn">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0e2188] group-hover:text-[#e33127] transition-colors">
                        Đọc tiếp
                    </span>
                    <div className="w-8 h-[1px] bg-zinc-200 group-hover:w-12 group-hover:bg-[#e33127] transition-all"></div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center border border-dashed border-zinc-100 rounded-sm">
              <p className="text-zinc-300 font-bold uppercase tracking-widest text-sm italic">
                // Hiện chưa có bản tin nào trong chuyên mục này
              </p>
            </div>
          )}
        </div>
      )}
    </Container>
  );
}

export default function NewsPage() {
  return (
    <div className="bg-white min-h-screen">
      <NewsBanner />
      <Suspense fallback={
        <div className="py-40 flex justify-center">
            <div className="w-8 h-8 border-2 border-zinc-100 border-t-[#0e2188] rounded-full animate-spin"></div>
        </div>
      }>
        <NewsContent />
      </Suspense>
    </div>
  );
}