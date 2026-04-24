'use client';
import { use } from 'react';
import { publicService } from '@/services/publicService';
import { getImageUrl } from '@/lib/utils';
import Container from '@/components/public/ui/Container';
import { useProjectDetail } from '@/hooks/public/usePublicPosts'; 

export default function ProjectDetail({ params }) {
  const { slug } = use(params);
  
  // 🟢 ĐỊNH NGHĨA BIẾN PROJECT Ở ĐÂY ĐỂ HẾT LỖI "NOT DEFINED"
  const { project, loading } = useProjectDetail(slug); 

  if (loading) return (
    <div className="py-40 text-center font-black animate-pulse uppercase">
      // ĐANG TRUY XUẤT HỒ SƠ CÔNG TRÌNH...
    </div>
  );

  if (!project) return (
    <div className="py-40 text-center font-black text-red-600 uppercase">
      KHÔNG TÌM THẤY DỮ LIỆU DỰ ÁN
    </div>
  );

  return (
    <div className="py-24 bg-white">
      <Container>
        <div className="max-w-4xl mx-auto space-y-10">
          <h1 className="text-6xl font-black italic uppercase leading-[0.9] border-l-8 border-orange-600 pl-10">
             DỰ ÁN: {project?.title}
          </h1>
          
          <img 
            src={getImageUrl(project?.image)} 
            alt={project?.title}
            className="w-full border-8 border-black shadow-[20px_20px_0_0_#000]" 
          />

          <div 
            className="prose prose-2xl max-w-none font-bold text-black mt-20"
            dangerouslySetInnerHTML={{ __html: project?.content }}
          />
        </div>
      </Container>
    </div>
  );
}