'use client';
import { use } from 'react';
import { useProjectDetail } from '@/hooks/public/usePublicPosts'; // 🟢 Dùng chung hook lấy detail
import { getImageUrl, formatDate } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import NewsBanner from '@/components/public/news/NewsBanner';
export default function NewsDetailPage({ params }) {
  const { slug } = use(params);
  const { project: post, loading } = useProjectDetail(slug); // Đổi tên 'project' thành 'post' để dùng cho tin tức

  if (loading) return <div className="py-40 text-center font-black animate-pulse uppercase">// ĐANG TẢI NỘI DUNG...</div>;
  if (!post) return <div className="py-40 text-center font-black text-red-600">KHÔNG TÌM THẤY BÀI VIẾT</div>;

  return (
    <div className=" bg-white">
        <NewsBanner />
      <Container>
        <article className="max-w-4xl mx-auto">
          <header className="mb-12 space-y-6">
            <span className="bg-black text-white px-4 py-2 text-xs font-black italic uppercase tracking-widest">
              // {post.category_name || 'BẢN TIN TÂN NGỌC LỰC'}
            </span>
            <h1 className="text-6xl font-black italic uppercase leading-none tracking-tighter">
              {post.title}
            </h1>
            <p className="text-gray-400 font-bold italic tracking-widest uppercase text-sm">
              ĐĂNG NGÀY: {formatDate(post.created_at)}
            </p>
          </header>

          <img 
            src={getImageUrl(post.image)} 
            className="w-full border-[10px] border-black shadow-[25px_25px_0_0_#000] mb-20" 
            alt={post.title}
          />

          <div 
            className="prose prose-2xl max-w-none font-medium text-black leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </Container>
    </div>
  );
}