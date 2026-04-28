'use client';
import Container from '../ui/Container';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';
import { usePublicPosts } from '@/hooks/public/usePublicPosts';
import { MdArrowForward } from 'react-icons/md';

export default function LatestNews() {
  const { posts, loading } = usePublicPosts({ post_type: 'post', limit: 4 });

  if (loading || !posts?.length) return null;

  return (
    <section className="py-32 bg-white font-sans">
      <Container>
        
        {/* Header: Title Left - Action Right */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-[#e33127]"></span>
              <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                Insights & Updates
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-[#0e2188]">
              TIN TỨC <span className="text-zinc-300">& SỰ KIỆN</span>
            </h2>
          </div>

          <Link 
            href="/news" 
            className="group flex items-center gap-3 text-[#0e2188] font-bold tracking-widest text-[10px] uppercase transition-all hover:text-[#e33127]"
          >
            XEM TẤT CẢ BÀI VIẾT
            <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:border-[#e33127] transition-all">
              <MdArrowForward className="text-lg" />
            </div>
          </Link>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {posts.map((post) => (
            <Link 
              href={`/news/${post.slug}`} 
              key={post.id} 
              className="group flex flex-col bg-white transition-all duration-500"
            >
              {/* Thumbnail with Hover Effect */}
              <div className="aspect-[4/3] overflow-hidden rounded-sm relative bg-zinc-100">
                <img 
                  src={getImageUrl(post.image)} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-90" 
                />
                <div className="absolute inset-0 bg-[#0e2188]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content Section */}
              <div className="py-6 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#e33127] uppercase tracking-[0.2em]">
                    {post.category?.name || 'Kỹ thuật'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <h3 className="text-xl font-bold leading-tight text-[#0e2188] group-hover:text-[#e33127] transition-colors line-clamp-2 uppercase tracking-tight">
                  {post.title}
                </h3>

                <div 
                  className="text-zinc-500 text-sm leading-relaxed line-clamp-3 font-normal overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Read More Link */}
                <div className="pt-4 mt-auto">
                  <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#0e2188] uppercase tracking-widest group-hover:gap-4 transition-all">
                    <span>Chi tiết</span>
                    <span className="w-6 h-[1px] bg-[#e33127]"></span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}