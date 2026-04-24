'use client';
import { usePublicPosts } from '@/hooks/public/usePublicPosts';
import { getImageUrl, formatDate } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import Link from 'next/link';
import NewsBanner from '@/components/public/news/NewsBanner';
export default function NewsPage() {
  // 🟢 Gọi hook lấy tin tức (post_type mặc định là post)
  const { posts, loading } = usePublicPosts({ post_type: 'post' });

  if (loading) return <div className="py-40 text-center font-black animate-pulse">// ĐANG ĐỌC TIN TỨC THÉP...</div>;

  return (

    <div className=" bg-gray-50">
        <NewsBanner />
      <Container>
        
        <div className="mb-16 border-l-8 border-black pl-8">
          <span className="text-orange-600 font-black tracking-widest uppercase text-xs">// KÊNH THÔNG TIN</span>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter mt-2">TIN TỨC THỊ TRƯỜNG</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link key={post.id} href={`/news/${post.slug}`} className="group bg-white border-4 border-black shadow-[10px_10px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col h-full">
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
                <p className="text-gray-600 font-bold line-clamp-3 mb-6">
                  {post.description}
                </p>
                <div className="mt-auto font-black italic text-sm border-b-2 border-black inline-block self-start">
                  ĐỌC TIẾP →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}