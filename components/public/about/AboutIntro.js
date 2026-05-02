'use client';
import { motion } from 'framer-motion';
import Container from '../ui/Container';
import { getImageUrl } from '@/lib/utils';

export default function AboutIntro({ data, meta }) {
  // Tính năm kinh nghiệm động
  const experienceYears = new Date().getFullYear() - 2007;

  return (
    <section className="py-24 bg-white overflow-hidden font-sans">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* 🔴 KHỐI NỘI DUNG BÊN TRÁI */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-12 h-[2px] bg-[#e33127]"></span>
                <span className="text-[#e33127] font-bold text-xs tracking-[0.3em] uppercase">
                  // LỜI MỞ ĐẦU
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter text-[#0e2188] uppercase italic">
                {data?.title || 'GIỚI THIỆU'}
              </h2>
            </div>

            <div className="space-y-6">
              {/* Slogan lấy từ meta.slogan trong JSON */}
              <p className="text-xl md:text-2xl text-zinc-800 font-bold leading-relaxed border-l-8 border-[#e33127] pl-6 italic">
                {meta?.slogan || data?.description}
              </p>
              
              {/* Nội dung chi tiết lấy từ meta.intro */}
              <div 
            className="..."
            dangerouslySetInnerHTML={{ 
              // Phải dùng meta?.content để lấy chữ "sf" bên trong JSON
              __html: meta?.content || '' 
            }}
          />
        </div>

            {/* Chỉ số kinh nghiệm */}
            <div className="grid grid-cols-2 gap-8 pt-10 border-t-4 border-black">
              <div className="group">
                <span className="block text-6xl font-black tracking-tighter text-[#0e2188] group-hover:text-[#e33127] transition-colors">
                  {experienceYears}+
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  Năm kinh nghiệm
                </span>
              </div>
              <div className="group">
                <span className="block text-6xl font-black tracking-tighter text-[#0e2188] group-hover:text-[#e33127] transition-colors">
                  500+
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  Dự án hoàn thành
                </span>
              </div>
            </div>
          </motion.div>

          {/* 🔴 KHỐI ẢNH BÊN PHẢI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Khung ảnh Brutalism với đổ bóng cứng */}
            <div className="relative aspect-[4/5] border-[10px] border-black shadow-[20px_20px_0_0_#0e2188] overflow-hidden bg-zinc-100">
              <img 
                src={getImageUrl(data?.image)} 
                alt={data?.title} 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Nhãn trang trí đè lên ảnh */}
            <div className="absolute -bottom-8 -left-8 bg-[#e33127] p-8 text-white border-4 border-black shadow-[10px_10px_0_0_#000] z-20">
              <p className="text-sm font-black uppercase tracking-tighter leading-tight">
                Tân Ngọc Lực<br/>Chất lượng bền vững
              </p>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}