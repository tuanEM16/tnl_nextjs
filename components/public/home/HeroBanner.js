'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { usePublicConfig } from '@/hooks/public/usePublicConfig';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Parallax, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function HeroBanner() {
  const { banners, loading: bannerLoading } = usePublicBanners('home');
  const { config, loading: configLoading } = usePublicConfig();
  const { scrollY } = useScroll();
  const [isExpanded, setIsExpanded] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  });

  if (bannerLoading || banners.length === 0) return <div className="h-screen bg-[#0e2188]" />;

  return (
    <section className="relative bg-white font-sans select-none">

      {/* 🔴 BANNER CHÍNH: "Rèm thép" (z-10) */}

      <motion.div

        initial={false}

        animate={{

          clipPath: isExpanded

            ? "inset(0% 0% 0% 0% round 0px 0px 0px 0px)"

            : "inset(0% 0% 17% 0% round 0px 0px 200px 200px)"

        }}

        transition={{

          duration: 1.8,

          ease: [0.25, 0.1, 0.25, 1]

        }}
        className="relative h-screen w-full bg-[#0e2188] overflow-hidden z-10 shadow-2xl"
      >
        <Swiper
          modules={[Autoplay, EffectFade, Parallax, Pagination]}
          effect="fade"
          parallax={true}
          speed={1500}
          autoplay={{ delay: 7000, disableOnInteraction: false }}
          loop={true}
          pagination={{ clickable: true, bulletClass: 'banner-bullet', bulletActiveClass: 'banner-bullet-active' }}
          className="h-full w-full"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} className="relative overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src={getImageUrl(banner.image)}
                  alt={banner.name}
                  className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0e2188]/90 via-[#0e2188]/40 to-transparent"></div>
              </div>

              <div className="relative z-10 h-full w-full flex items-center">
                <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                  <div className="max-w-5xl space-y-8">
                    {/* Accent: Đổi cam sang đỏ #e33127, bỏ Italic, tracking rộng */}
                    <div data-swiper-parallax="-200" className="flex items-center gap-4 text-[#e33127] font-bold text-xs tracking-[0.5em] uppercase">
                      <span className="w-12 h-[2px] bg-[#e33127]"></span>
                      {banner.name}
                    </div>

                    {/* Headline: Bỏ italic, dùng Bold gọn gàng chuẩn armenia.travel */}
                    <h1 data-swiper-parallax="-400" className="text-5xl md:text-8xl font-bold text-white uppercase leading-[1.05] tracking-tighter">
                      {banner.description || 'TÂN NGỌC LỰC'}
                    </h1>

                    {/* Button: Đổi style từ Shadow Industrial sang Premium Minimalist */}
                    <div data-swiper-parallax="-600" className="pt-6">
                      <Link href={banner.link || '/contact'}>
                        <button className="group relative overflow-hidden bg-[#e33127] text-white px-12 py-5 font-bold uppercase text-[11px] tracking-[0.2em] rounded-sm transition-all hover:bg-white hover:text-[#0e2188]">
                          <span className="relative z-10">Khám phá ngay —</span>
                          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                      </Link>
                    </div>
                  </div>
                </Container>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* 🔵 SLOGAN BẤT TỬ: Giữ nguyên logic mix-blend */}
      <div className="absolute bottom-[8%] left-0 w-full z-20 flex justify-center px-10 pointer-events-none mix-blend-difference">
        {!configLoading && (
          <p className="text-white font-bold text-center uppercase tracking-[0.5em] text-[10px] md:text-xs max-w-4xl leading-relaxed opacity-80">
            {config.slogan || 'TÂN NGỌC LỰC — VỮNG BỀN THỜI ĐẠI'}
          </p>
        )}
      </div>

      {/* 🟡 SCROLL INDICATOR: Chỉnh mỏng nhẹ hơn */}
      <div className="absolute bottom-12 right-10 md:right-20 z-20 flex flex-col items-center gap-6 mix-blend-difference pointer-events-none">
        <span className="text-[9px] font-bold text-white uppercase tracking-[0.4em] [writing-mode:vertical-rl]">Explore</span>
        <div className="relative w-[1px] h-20 bg-white/30 overflow-hidden">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </div>

      <style jsx global>{`
        .banner-bullet {
          width: 40px; height: 2px; background: rgba(255,255,255,0.2);
          display: inline-block; margin: 0 6px; cursor: pointer; transition: all 0.4s;
        }
        .banner-bullet-active { background: #e33127; width: 80px; }
        .swiper-pagination { bottom: 60px !important; text-align: right !important; padding-right: 5% !important; }
        @media (max-width: 768px) {
            .swiper-pagination { text-align: center !important; padding-right: 0 !important; }
        }
      `}</style>
    </section>
  );
}