'use client';
import { 
  MdVerified, 
  MdEngineering, 
  MdMilitaryTech, 
  MdHandshake, 
  MdLightbulb, 
  MdStar 
} from 'react-icons/md';
import { motion } from 'framer-motion';
import Container from '../ui/Container';

export default function CoreValues({ data }) {
  const values = Array.isArray(data) ? data : [];
  if (values.length === 0) return null;

  const renderIcon = (iconName) => {
    switch(iconName?.toLowerCase()) {
      case 'quality': return <MdVerified size={32} />;
      case 'engineering': return <MdEngineering size={32} />;
      case 'military': return <MdMilitaryTech size={32} />;
      case 'innovation': return <MdLightbulb size={32} />;
      case 'star': return <MdStar size={32} />;
      default: return <MdHandshake size={32} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="py-24 md:py-32 bg-white font-sans">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* 🔴 HEADER SECTION */}
          <motion.div variants={headerVariants} className="text-center mb-20 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <span className="w-12 h-[2px] bg-[#e33127]"></span>
              <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                Our Foundation
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-[#0e2188]">
              GIÁ TRỊ <span className="text-zinc-300">CỐT LÕI</span>
            </h2>
          </motion.div>

          {/* 🔴 GRID 3 CỘT */}
          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {values.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="relative group p-10 md:p-12 bg-white border border-zinc-100 rounded-sm hover:shadow-2xl hover:shadow-zinc-200 transition-all duration-500 overflow-hidden flex flex-col h-full"
              >
                {/* Số thứ tự watermark */}
                <div className="absolute top-0 right-0 text-[120px] font-bold text-zinc-50 group-hover:text-zinc-100 transition-colors pointer-events-none select-none leading-none -mr-4 -mt-4 opacity-50">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Icon Container */}
                  <div className="text-[#e33127] mb-10 w-16 h-16 rounded-sm bg-zinc-50 flex items-center justify-center group-hover:bg-[#e33127] group-hover:text-white transition-all duration-500 shadow-sm">
                    {renderIcon(item.icon)}
                  </div>

                  {/* Tiêu đề */}
                  <h3 className="text-2xl font-bold uppercase tracking-tight text-[#0e2188] mb-6 leading-tight group-hover:text-[#e33127] transition-colors duration-500">
                    {item.title}
                  </h3>

                  {/* Nội dung mô tả */}
                  <div className="mt-auto">
                    <div 
                      className="font-medium text-zinc-500 leading-relaxed text-sm md:text-base transition-colors prose prose-zinc prose-strong:text-[#0e2188]"
                      dangerouslySetInnerHTML={{ __html: item.desc || '' }}
                    />
                  </div>
                </div>

                {/* Decorative line on hover */}
                <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#e33127] group-hover:w-full transition-all duration-700"></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}