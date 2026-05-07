'use client';
import { use, useState, useEffect, useMemo } from 'react';
import { useProjectDetail, usePublicPosts } from '@/hooks/public/usePublicPosts';
import { getImageUrl, formatDate } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import NewsBanner from '@/components/public/news/NewsBanner';
import Link from 'next/link';
import { useTrackView } from '@/hooks/public/useTrackView';
import 'react-quill-new/dist/quill.snow.css';

// Component con hiển thị bài viết liên quan (cùng danh mục)
// Component RelatedPosts - Style Premium (Armenia Travel)
function RelatedPosts({ categoryId, currentId }) {
  const { posts, loading } = usePublicPosts({
    post_type: 'post',
    category_id: categoryId,
    limit: 4,
  });

  const filtered = (posts || [])
    .filter((p) => p.id !== currentId)
    .slice(0, 3);

  if (loading) {
    return (
      <section className="mt-32 pt-20 border-t border-zinc-100">
        <div className="flex items-center gap-4 mb-12">
            <div className="w-10 h-[2px] bg-[#e33127]"></div>
            <h2 className="text-3xl font-bold uppercase tracking-tight text-[#0e2188]">Đang tải...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[16/10] bg-zinc-50 animate-pulse rounded-sm" />
              <div className="h-4 bg-zinc-50 animate-pulse w-1/3" />
              <div className="h-6 bg-zinc-50 animate-pulse w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!filtered.length) return null;

  return (
    <section className="mt-32 pt-20 border-t border-zinc-100">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-[2px] bg-[#e33127]"></div>
        <h2 className="text-3xl font-bold uppercase tracking-tight text-[#0e2188]">
          Bài viết liên quan
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/news/${p.slug}`}
            className="group flex flex-col h-full transition-all duration-500"
          >
            {/* Hình ảnh - Grayscale sang Color khi hover */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-zinc-50 border border-zinc-100 mb-6 shadow-sm group-hover:shadow-2xl group-hover:shadow-zinc-200 transition-all duration-700">
              <img
                src={getImageUrl(p.image)}
                alt={p.title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-[#0e2188]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Thông tin bài viết */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#e33127] uppercase tracking-[0.2em]">
                  {formatDate(p.created_at)}
                </span>
              </div>
              <h4 className="text-lg font-bold uppercase leading-tight text-[#0e2188] group-hover:text-[#e33127] transition-colors duration-300 line-clamp-2">
                {p.title}
              </h4>
              <div className="pt-2 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#0e2188]">Xem chi tiết</span>
                <div className="w-6 h-[1px] bg-[#e33127]"></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function NewsDetailPage({ params }) {
  const { slug } = use(params);
  const { project: post, loading } = useProjectDetail(slug);
  const [headings, setHeadings] = useState([]);
useTrackView({ page_type: 'post', ref_id: post?.id, ref_slug: post?.slug }); // 🟢 Thêm đây
  // Xử lý nội dung & mục lục (giữ nguyên)
  const processedContent = useMemo(() => {
    if (!post?.content) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const headingElements = doc.querySelectorAll('h2, h3');

    const extracted = [];
    headingElements.forEach((el, index) => {
      const id = `tnl-section-${index}`;
      el.id = id;
      extracted.push({
        id,
        text: el.innerText,
        level: el.tagName.toLowerCase(),
      });
    });

    setHeadings(extracted);
    return doc.body.innerHTML;
  }, [post?.content]);

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center gap-6 bg-white uppercase font-black italic animate-pulse text-zinc-400">
        <div className="w-12 h-12 border-4 border-zinc-100 border-t-[#e33127] rounded-full animate-spin"></div>
        // ĐANG TRUY XUẤT DỮ LIỆU THÉP...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-40 text-center bg-white flex flex-col items-center">
        <h2 className="text-8xl font-bold text-zinc-100 select-none">404</h2>
        <p className="font-bold text-[#0e2188] uppercase tracking-widest text-sm -mt-8">Không tìm thấy bản tin</p>
        <Link href="/news" className="mt-12 text-[10px] font-bold border-b-2 border-[#e33127] pb-1 text-[#e33127] uppercase tracking-[0.3em]">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans">
      <NewsBanner />

      <style>{`
        .news-content.ql-editor h2, 
        .news-content.ql-editor h3 { 
          scroll-margin-top: 120px; 
          color: #0e2188; font-weight: 700; text-transform: uppercase; margin-top: 3.5rem; margin-bottom: 1.5rem;
        }
        .news-content.ql-editor { padding: 0; font-size: 18px; line-height: 1.85; color: #52525b; white-space: normal; }
        .news-content.ql-editor p { margin-bottom: 1.75rem; }
        .news-content.ql-editor .ql-align-center { text-align: center; }
        .news-content.ql-editor .ql-align-right { text-align: right; }
        .news-content.ql-editor img { display: inline-block; max-width: 100%; height: auto; margin: 2rem 0; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .toc-link {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
          text-align: left;
          line-height: 1.4;
          transition: all 0.3s;
          margin-bottom: 4px;
        }
        .toc-link:hover { 
          color: #e33127; 
          transform: translateX(4px); 
        }
      `}</style>

      <Container className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto relative">
          {/* Sidebar mục lục */}
          <aside className="absolute right-full mr-20 top-0 h-full hidden xl:block w-[260px]">
            <div className="sticky top-32 space-y-8 border-l-2 border-zinc-100 pl-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">// Nội dung bài</span>
                <h4 className="text-[#0e2188] font-black italic uppercase text-2xl tracking-tighter">Mục lục</h4>
              </div>
              <nav className="flex flex-col gap-5">
                {headings.length > 0 ? headings.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => scrollToHeading(h.id)}
                    className={`toc-link text-[11px] font-bold uppercase tracking-widest ${h.level === 'h3' ? 'pl-5 text-zinc-400 font-medium' : 'text-zinc-600'}`}
                  >
                    {h.text}
                  </button>
                )) : (
                  <p className="text-[10px] italic text-zinc-300">Đang cập nhật mục lục...</p>
                )}
              </nav>
              <div className="pt-12">
                <div className="p-6 bg-zinc-50 border-l-4 border-[#e33127]">
                  <p className="text-[9px] font-bold text-[#0e2188] leading-relaxed uppercase tracking-wider">
                    Bản tin kỹ thuật <br /> <span className="text-[#e33127]">Tân Ngọc Lực Steel</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Nội dung bài viết */}
          <article className="w-full">
            <header className="mb-20 space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-16 h-[3px] bg-[#e33127]"></span>
                <span className="text-[#e33127] font-black text-xs tracking-[0.5em] uppercase">
                  {post.category_name || 'TNL NEWS'}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-[0.95] text-[#0e2188]">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 pt-8 border-t border-zinc-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Publishing Date</span>
                  <span className="text-xs font-black text-[#0e2188] uppercase">{formatDate(post.created_at)}</span>
                </div>
                <div className="h-8 w-[1px] bg-zinc-200"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Author Source</span>
                  <span className="text-xs font-black text-[#0e2188] uppercase">TNL Editor Group</span>
                </div>
              </div>
            </header>

            {/* Ảnh đại diện */}
            {post.image && (
              <div className="relative mb-24 rounded-sm overflow-hidden shadow-[30px_30px_0_0_rgba(14,33,136,0.03)] border-4 border-zinc-50">
                <img
                  src={getImageUrl(post.image)}
                  className="w-full h-auto object-cover"
                  alt={post.title}
                />
              </div>
            )}

            {/* Nội dung bài viết */}
            <div
              className="ql-editor news-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            {/* Footer bài viết (share + back) */}
            <footer className="mt-32 pt-16 border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Share via:</span>
                <div className="flex gap-4">
                  <button className="w-10 h-10 border-2 border-zinc-100 flex items-center justify-center font-bold hover:bg-[#0e2188] hover:text-white transition-all">FB</button>
                  <button className="w-10 h-10 border-2 border-zinc-100 flex items-center justify-center font-bold hover:bg-[#0e2188] hover:text-white transition-all">LN</button>
                </div>
              </div>
              <Link
                href="/news"
                className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-[#0e2188]"
              >
                <span className="w-12 h-[2px] bg-[#e33127] group-hover:w-20 transition-all"></span>
                Quay lại danh sách
              </Link>
            </footer>
          </article>
        </div>

        {/* Bài viết liên quan - nằm ngoài article để tách biệt, vẫn trong container */}
        {post && (
          <RelatedPosts categoryId={post.category_id} currentId={post.id} />
        )}
      </Container>
    </div>
  );
}