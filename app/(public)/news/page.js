'use client';
import { useState, useEffect, useMemo } from 'react'; // Thêm useMemo
import { usePublicPosts } from '@/hooks/public/usePublicPosts';
import { getImageUrl, formatDate } from '@/lib/utils';
import { postService } from '@/services/postService';
import Container from '@/components/public/ui/Container';
import Link from 'next/link';
import NewsBanner from '@/components/public/news/NewsBanner';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);

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

  // 🎯 Siết lại filter bằng useMemo cho lỳ đòn
  const queryFilters = useMemo(() => {
    const params = { post_type: 'post', limit: 100 };
    if (activeCategory !== null) params.category_id = activeCategory;
    return params;
  }, [activeCategory]);

  const { posts, loading } = usePublicPosts(queryFilters);

  if (loading) return (
    <div className="py-40 text-center font-black animate-pulse text-zinc-400">
      // ĐANG ĐỌC TIN TỨC THÉP...
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <NewsBanner />

      <Container className="py-16 md:py-24">
        {/* Header Truyền Thông */}
        <div className="mb-10 border-l-8 border-black pl-8">
          <span className="text-orange-600 font-black tracking-widest uppercase text-xs">// KÊNH THÔNG TIN</span>
          <h1 className="text-6xl md:text-7xl font-black italic uppercase tracking-tighter mt-2">
            TRUYỀN THÔNG
          </h1>
        </div>

        {/* Bộ lọc Pills - Đỉnh cao của đại ca */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-6 py-2 font-black text-xs uppercase tracking-widest transition-all border-2 border-black ${
              activeCategory === null
                ? 'bg-orange-600 text-white border-orange-600 shadow-[4px_4px_0_0_#000] -translate-x-1 -translate-y-1'
                : 'bg-white text-black hover:bg-zinc-100'
            }`}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 font-black text-xs uppercase tracking-widest transition-all border-2 border-black ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white border-orange-600 shadow-[4px_4px_0_0_#000] -translate-x-1 -translate-y-1'
                  : 'bg-white text-black hover:bg-zinc-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid bài viết Neubrutalism */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group bg-white border-4 border-black shadow-[10px_10px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col h-full"
              >
                <div className="aspect-video overflow-hidden border-b-4 border-black bg-gray-200">
                  <img
                    src={getImageUrl(post.image)}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    alt={post.title}
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <span className="text-[10px] font-black text-orange-600 mb-4 uppercase italic">
                    {formatDate(post.created_at)} // {post.category_name || 'TIN TỨC'}
                  </span>
                  <h3 className="text-2xl font-black italic uppercase leading-tight mb-4 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 font-bold line-clamp-3 mb-6 text-sm">{post.description}</p>
                  <div className="mt-auto font-black italic text-xs border-b-2 border-black inline-block self-start group-hover:text-orange-600 group-hover:border-orange-600 transition-all">
                    ĐỌC TIẾP →
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-20 border-4 border-dashed border-zinc-200 text-zinc-300 font-black uppercase italic text-xl">
              // CHƯA CÓ BẢN TIN PHÙ HỢP
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}