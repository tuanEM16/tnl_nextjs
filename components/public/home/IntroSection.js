// components/public/home/IntroSection.js
'use client';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { getImageUrl } from '@/lib/utils';

export default function IntroSection({ data, config, projectsCount }) {
  // 🟢 TỰ ĐỘNG TÍNH NĂM KINH NGHIỆM (Công thức: Năm hiện tại - 2007)
  const experienceYears = new Date().getFullYear() - 2007;

  return (
    <section className="py-32 bg-white overflow-hidden font-archivo">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <span className="inline-block bg-black text-white px-5 py-1 font-black text-[10px] tracking-[0.4em] uppercase skew-x-[-15deg]">
                // {config?.site_name || 'TÂN NGỌC LỰC'}
              </span>
              
              {/* Tiêu đề bài viết từ Admin */}
              <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.85] tracking-tighter text-black">
                {data.title}
              </h2>
            </div>
            
            <div className="space-y-6 text-zinc-600 font-bold leading-relaxed text-xl max-w-xl">
              <p className="border-l-8 border-orange-600 pl-8 uppercase">
                {data.description}
              </p>
              {/* Nội dung chi tiết Render từ Database */}
              <div className="text-sm normal-case font-medium text-zinc-400" 
                   dangerouslySetInnerHTML={{ __html: data.content }}>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0 border-4 border-black">
              <div className="p-8 border-r-4 border-black bg-zinc-50">
                <span className="block text-6xl font-black italic tracking-tighter text-orange-600">
                  {experienceYears}+
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Năm kinh nghiệm</span>
              </div>
              <div className="p-8 bg-zinc-50">
                <span className="block text-6xl font-black italic tracking-tighter text-black">
                  {projectsCount}+
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Dự án hoàn thành</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] border-[12px] border-black overflow-hidden shadow-[30px_30px_0_0_#ea580c]">
              <img 
                src={getImageUrl(data.image)} 
                alt={data.title} 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}