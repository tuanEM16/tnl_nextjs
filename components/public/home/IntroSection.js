'use client';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { getImageUrl } from '@/lib/utils';

export default function IntroSection({ data, config, projectsCount }) {
  // 🟢 TỰ ĐỘNG TÍNH NĂM KINH NGHIỆM (Công thức: Năm hiện tại - 2007)
  const experienceYears = new Date().getFullYear() - 2007;

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden font-sans">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-12 h-[2px] bg-[#e33127]"></span>
                <span className="text-[#e33127] font-bold text-xs tracking-[0.3em] uppercase">
                  {config?.site_name || 'TÂN NGỌC LỰC'}
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight text-[#0e2188]">
                {data.title}
              </h2>
            </div>
            
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-zinc-800 font-medium leading-relaxed border-l-4 border-[#e33127] pl-6">
                {data.description}
              </p>
              
              <div 
                className="text-zinc-500 leading-loose text-base md:text-lg max-w-xl prose prose-zinc"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
              <div className="space-y-2">
                <span className="block text-5xl font-bold tracking-tighter text-[#0e2188]">
                  {experienceYears}+
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#e33127]">
                  Năm kinh nghiệm
                </span>
              </div>
              <div className="space-y-2">
                <span className="block text-5xl font-bold tracking-tighter text-[#0e2188]">
                  {projectsCount}+
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#e33127]">
                  Dự án hoàn thành
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            {/* Decorative Element */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#0e2188]/5 rounded-full -z-10" />
            
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
              <img 
                src={getImageUrl(data.image)} 
                alt={data.title} 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-out" 
              />
              
              {/* Overlay Pattern theo phong cách du lịch cao cấp */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e2188]/20 to-transparent pointer-events-none" />
            </div>

            {/* Accent Box */}
            <div className="absolute -bottom-8 -left-8 hidden md:block bg-[#0e2188] p-8 text-white max-w-[200px]">
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">
                Cam kết chất lượng bền vững
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}