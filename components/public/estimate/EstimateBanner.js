'use client';
import { motion } from 'framer-motion';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';

export default function EstimateBanner() {
  const { banners, loading } = usePublicBanners('estimate');

  if (loading || banners.length === 0) {
    return <div className="h-[50vh] min-h-[400px] w-full bg-[#0e2188] animate-pulse" />;
  }

  const banner = banners[0];

  return (
    <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] scale-105"
        style={{ backgroundImage: `url('${getImageUrl(banner.image)}')` }} 
      />
      <div className="absolute inset-0 bg-[#0B1F4F]/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

      <div className="relative z-10 text-center mt-20 w-full max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-4">
            {banner.name || 'TÍNH DỰ TOÁN NHANH'}
          </h1>
          <p className="text-zinc-300 text-sm md:text-base tracking-widest uppercase font-medium">
            {banner.description || 'Hệ thống báo giá chi phí nhà thép tiền chế chuẩn xác'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}