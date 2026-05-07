'use client';
import { use } from 'react';
import { getImageUrl } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import { useProjectDetail } from '@/hooks/public/usePublicPosts'; 
import ProjectBanner from '@/components/public/project/ProjectBanner';
import ProjectMap from '@/components/public/project/ProjectMap';
import { useTrackView } from '@/hooks/public/useTrackView';

export default function ProjectDetail({ params }) {
  const { slug } = use(params);
  const { project, loading } = useProjectDetail(slug); 
  
  useTrackView({ page_type: 'project', ref_id: project?.id, ref_slug: project?.slug });

  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center bg-white gap-6">
      <div className="w-12 h-12 border-4 border-zinc-100 border-t-[#e33127] rounded-full animate-spin"></div>
      <p className="font-bold text-[#0e2188] uppercase tracking-[0.3em] text-xs">Truy xuất hồ sơ công trình...</p>
    </div>
  );

  if (!project) return (
    <div className="py-40 text-center bg-white flex flex-col items-center">
      <h2 className="text-8xl font-bold text-zinc-100 select-none">404</h2>
      <p className="font-bold text-[#0e2188] uppercase tracking-widest text-sm -mt-8">Dữ liệu dự án không tồn tại</p>
    </div>
  );

  return (
    <div className="bg-white font-sans overflow-hidden">
      <ProjectBanner />
           
      <Container className="py-20 lg:py-32">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* 🔴 HEADER DỰ ÁN */}
          <header className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[2px] bg-[#e33127]"></span>
              <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                Featured Project
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[1.05] text-[#0e2188]">
              {project?.title}
            </h1>
          </header>

          {/* 🖼️ HÌNH ẢNH ĐẠI DIỆN */}
          <div className="relative rounded-sm overflow-hidden shadow-2xl shadow-zinc-200">
            <img 
              src={getImageUrl(project?.image)} 
              alt={project?.title}
              className="w-full h-auto object-cover" 
            />
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#e33127]/10 -mr-8 -mt-8 rotate-45"></div>
          </div>

          {/* 📝 NỘI DUNG CHI TIẾT */}
          <div className="pt-10">
            <div 
              className="prose prose-zinc prose-lg md:prose-xl max-w-none 
                prose-headings:text-[#0e2188] prose-headings:uppercase prose-headings:font-bold
                prose-p:text-zinc-600 prose-p:leading-loose
                prose-strong:text-[#0e2188]
                prose-img:rounded-sm prose-img:shadow-xl"
              dangerouslySetInnerHTML={{ __html: project?.content }}
            />
          </div>
        </div>
      </Container>

      {/* 🗺️ BẢN ĐỒ DỰ ÁN */}
      <div className="bg-zinc-50 border-t border-zinc-100">
        <ProjectMap />
      </div>

      {/* Trang trí chân trang */}
      <div className="py-10 flex justify-center opacity-10 grayscale pointer-events-none select-none">
          <span className="text-8xl font-black uppercase tracking-tighter text-[#0e2188]">Tân Ngọc Lực</span>
      </div>
    </div>
  );
}