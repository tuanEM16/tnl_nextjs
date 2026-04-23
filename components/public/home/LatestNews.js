// components/public/home/LatestNews.js
'use client';
import Container from '../ui/Container';
import SectionTitle from '../ui/SectionTitle';
import Link from 'next/link';
import { formatDate, getImageUrl } from '@/lib/utils';
import { usePublicPosts } from '@/hooks/public/usePublicPosts';

export default function LatestNews() {
  const { posts, loading } = usePublicPosts({ post_type: 'post' });

  if (loading) return null;

  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <SectionTitle subtitle="Truyền thông" title="Tin tức mới nhất" align="center" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link href={`/news/${post.slug}`} key={post.id} className="group bg-white border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <div className="aspect-video overflow-hidden border-b-4 border-black">
                <img src={getImageUrl(post.thumbnail)} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">// {formatDate(post.created_at)}</span>
                <h3 className="text-xl font-black italic uppercase leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">{post.title}</h3>
                <p className="text-gray-500 text-sm font-medium line-clamp-2">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}