'use client';
import { motion } from 'framer-motion';
import { MdArrowForward } from 'react-icons/md';
import Container from '../ui/Container';

export default function Timeline({ data }) {
  const events = Array.isArray(data) ? data : [];
  if (events.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.4, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1.2, ease: "easeOut" }
    }
  };

  return (
    <section className="py-32 md:py-48 bg-gradient-to-b from-white via-white to-zinc-50/30 font-sans overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#e33127]/3 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-40 left-0 w-80 h-80 bg-[#0e2188]/3 rounded-full blur-3xl -z-10" />
      </div>

      <Container>
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-24 space-y-6"
        >
          <div className="flex items-center gap-4">
            <motion.span 
              className="w-16 h-[3px] bg-gradient-to-r from-[#e33127] to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4 }}
              style={{ originX: 0 }}
            />
            <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase font-medium">
              Hành Trình Phát Triển
            </span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#0e2188]">
              LỊCH SỬ
            </h2>
            <h2 className="text-5xl md:text-7xl font-light tracking-tight text-zinc-400">
              HÌNH THÀNH
            </h2>
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl pt-4">
              Khám phá quá trình phát triển và những cột mốc quan trọng của chúng tôi
            </p>
          </div>
        </motion.div>

        {/* TIMELINE STRUCTURE */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Animated Timeline Line */}
          <div className="absolute left-4 md:left-20 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#e33127] via-[#e33127]/50 to-transparent" />

          <div className="space-y-16 md:space-y-20 relative z-10">
            {events.map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="group relative"
              >
                <div className="flex gap-8 md:gap-12">
                  
                  {/* Timeline Node */}
                  <div className="relative shrink-0 pt-2">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-white border-3 border-[#e33127] shadow-lg shadow-[#e33127]/20 flex items-center justify-center"
                      whileHover={{ scale: 1.15, boxShadow: "0 0 30px rgba(227, 49, 39, 0.4)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div 
                        className="w-3 h-3 bg-[#e33127] rounded-full"
                        whileHover={{ scale: 1.3 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    
                    {/* Year Display */}
                    <div className="absolute left-16 top-1 whitespace-nowrap">
                      <span className="text-3xl md:text-4xl font-bold text-[#e33127] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <motion.div 
                    className="flex-1 pt-1 pb-6"
                    whileHover={{ x: 8 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 md:p-10 border border-zinc-100 hover:border-[#e33127]/30 group/card">
                      
                      {/* Title with Icon */}
                      <div className="flex items-start justify-between mb-5 gap-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#0e2188] group-hover/card:text-[#e33127] transition-colors duration-300 flex-1">
                          {item.title}
                        </h3>
                        <motion.div 
                          className="text-[#e33127] opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 shrink-0 pt-1"
                          animate={{ x: [0, 6, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <MdArrowForward size={24} />
                        </motion.div>
                      </div>

                      {/* Divider */}
                      <div className="h-[1px] bg-gradient-to-r from-[#e33127] to-transparent mb-6" />
                      
                      {/* Description */}
                      {item.desc && (
                        <div 
                          className="text-zinc-600 leading-relaxed text-base md:text-lg prose prose-zinc prose-p:m-0 prose-p:text-zinc-600 prose-strong:text-[#0e2188] prose-strong:font-bold group-hover/card:prose-strong:text-[#e33127] transition-colors duration-300"
                          dangerouslySetInnerHTML={{ __html: item.desc }}
                        />
                      )}

                      {/* Highlight Accent */}
                      <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-16 bg-gradient-to-b from-[#e33127]/0 via-[#e33127] to-[#e33127]/0 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 -z-10" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Accent */}
          <motion.div 
            className="absolute left-4 md:left-20 bottom-0 w-0.5 h-20 bg-gradient-to-b from-[#e33127]/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.8 }}
            style={{ originY: 0 }}
          />
        </motion.div>

        {/* Bottom Statistics or CTA can be added here */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
          className="mt-24 pt-16 border-t border-zinc-200"
        >
          <div className="flex flex-col md:flex-row gap-12 justify-between items-center">
            <div className="space-y-2">
              <p className="text-zinc-500 text-sm tracking-widest uppercase">Từ năm {events[0]?.year || 'khai phá'}</p>
              <h4 className="text-3xl md:text-4xl font-bold text-[#0e2188]">
                {events.length} Mốc Phát Triển Chính
              </h4>
            </div>
            <div className="text-right space-y-2">
              <p className="text-zinc-500 text-sm">Hành Trình Không Dừng</p>
              <p className="text-[#e33127] font-bold text-lg">Tiếp tục phát triển →</p>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}