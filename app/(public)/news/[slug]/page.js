'use client';
import { use } from 'react';
import { useProjectDetail } from '@/hooks/public/usePublicPosts';
import { getImageUrl, formatDate } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import NewsBanner from '@/components/public/news/NewsBanner';
import Link from 'next/link';

export default function NewsDetailPage({ params }) {
  const { slug } = use(params);
  const { project: post, loading } = useProjectDetail(slug);

  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center gap-6 bg-white">
      <div className="w-12 h-12 border-2 border-zinc-100 border-t-[#e33127] rounded-full animate-spin"></div>
      <p className="font-bold text-zinc-400 uppercase tracking-[0.4em] text-[10px]">Đang tải nội dung...</p>
    </div>
  );

  if (!post) return (
    <div className="py-40 text-center bg-white flex flex-col items-center">
      <h2 className="text-8xl font-bold text-zinc-100 select-none">404</h2>
      <p className="font-bold text-[#0e2188] uppercase tracking-widest text-sm -mt-8">Không tìm thấy bài viết</p>
      <Link href="/news" className="mt-12 text-[10px] font-bold border-b border-[#e33127] pb-1 text-[#e33127] uppercase tracking-widest">
        Quay lại tin tức
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      <NewsBanner />
      
      <Container className="py-20 md:py-32">
        <article className="max-w-4xl mx-auto">
          {/* Header Section */}
          <header className="mb-16 space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#e33127]"></span>
              <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                {post.category_name || 'BẢN TIN TÂN NGỌC LỰC'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[1.05] text-[#0e2188]">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 pt-6 border-t border-zinc-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Ngày đăng bản tin</span>
                <span className="text-sm font-bold text-[#0e2188] uppercase tracking-tight">
                  {formatDate(post.created_at)}
                </span>
              </div>
              <div className="h-10 w-[1px] bg-zinc-100"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Tác giả</span>
                <span className="text-sm font-bold text-[#0e2188] uppercase tracking-tight">Tân Ngọc Lực Editor</span>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <div className="relative mb-20 rounded-sm overflow-hidden shadow-2xl bg-zinc-100">
            <img 
              src={getImageUrl(post.image)} 
              className="w-full h-auto object-cover transform transition-transform duration-1000 hover:scale-105" 
              alt={post.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e2188]/10 to-transparent pointer-events-none" />
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-zinc prose-lg md:prose-xl max-w-none 
              prose-headings:text-[#0e2188] prose-headings:uppercase prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-zinc-600 prose-p:leading-relaxed prose-p:mb-8 prose-p:font-normal
              prose-strong:text-[#0e2188] prose-strong:font-bold
              prose-img:rounded-sm prose-img:shadow-xl prose-img:border prose-img:border-zinc-50
              prose-blockquote:border-l-[#e33127] prose-blockquote:bg-zinc-50 prose-blockquote:py-2 prose-blockquote:px-8 prose-blockquote:italic
              prose-a:text-[#e33127] prose-a:no-underline hover:prose-a:underline transition-all
              prose-li:text-zinc-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Article Footer */}
          <footer className="mt-24 pt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Chia sẻ bài viết</span>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-[#e33127] hover:border-[#e33127] cursor-pointer transition-all">f</div>
                <div className="w-8 h-8 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-[#e33127] hover:border-[#e33127] cursor-pointer transition-all">in</div>
              </div>
            </div>
            
            <Link 
              href="/news" 
              className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#0e2188] hover:text-[#e33127] transition-all"
            >
              <span className="w-8 h-[1px] bg-[#e33127] transition-all group-hover:w-12"></span>
              Quay lại danh sách
            </Link>
          </footer>
        </article>
      </Container>
    </div>
  );
}