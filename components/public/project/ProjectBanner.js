'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Link from 'next/link';

// Triệu hồi động cơ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function ProjectBanner() {
  const { banners, loading } = usePublicBanners('project');

  if (loading || banners.length === 0) return <div className="h-[80vh] bg-[#0e2188] animate-pulse" />;

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full bg-[#0e2188] overflow-hidden font-sans">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={banners.length > 1}
        pagination={{
          clickable: true,
          bulletClass: 'project-bullet',
          bulletActiveClass: 'project-bullet-active'
        }}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative overflow-hidden">
            {/* Background Image với hiệu ứng Scale nhẹ */}
            <div className="absolute inset-0">
              <img
                src={getImageUrl(banner.image)}
                alt={banner.name}
                className="w-full h-full object-cover transform scale-105"
              />
              {/* Lớp phủ Navy Gradient theo phong cách armenia.travel */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e2188] via-[#0e2188]/60 to-transparent"></div>
            </div>

            {/* Content - Dạt trái kịch khung, Typography chuẩn chỉ */}
            <div className="relative h-full w-full flex items-center">
              <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                <div className="max-w-5xl space-y-8">
                  {/* Tag Category: Màu đỏ #e33127, Tracking rộng */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-[#e33127]"></span>
                    <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                      {banner.name}
                    </span>
                  </div>

                  {/* Title: Bold, Uppercase, Tighter tracking, Font size cực đại */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[1.05] tracking-tighter">
                    {banner.description || 'CÔNG TRÌNH TIÊU BIỂU'}
                  </h1>

                  {/* Action Button: Phẳng, hiện đại, màu đỏ nhấn mạnh */}
                  <div className="pt-6">
                    <Link href={banner.link || '#'}>
                      <button className="bg-[#e33127] text-white px-12 py-5 font-bold uppercase text-[11px] tracking-[0.2em] rounded-sm transition-all hover:bg-white hover:text-[#0e2188] shadow-2xl shadow-black/20">
                        XEM CHI TIẾT DỰ ÁN
                      </button>
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Text Bottom Right - Tăng tính thẩm mỹ cho giao diện cao cấp */}
      <div className="absolute bottom-12 right-12 hidden lg:block pointer-events-none z-10 select-none">
        <p className="text-white/5 font-bold text-[120px] leading-none uppercase tracking-tighter">
          PROJECTS
        </p>
      </div>

      <style jsx global>{`
        .project-bullet {
          width: 40px;
          height: 2px;
          background: rgba(255,255,255,0.2);
          display: inline-block;
          margin: 0 6px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .project-bullet-active {
          background: #e33127;
          width: 80px;
        }
        .swiper-pagination {
          bottom: 40px !important;
          text-align: right !important;
          padding-right: 6% !important;
        }
        @media (max-width: 768px) {
          .swiper-pagination {
            text-align: center !important;
            padding-right: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}