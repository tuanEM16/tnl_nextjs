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

export default function NewsBanner() {
  // 🟢 Bốc banner dành riêng cho trang 'news'
  const { banners, loading } = usePublicBanners('news');

  if (loading || banners.length === 0) return <div className="h-[75vh] bg-[#0e2188] animate-pulse" />;

  return (
    <section className="relative h-[75vh] min-h-[600px] w-full bg-[#0e2188] overflow-hidden font-sans">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={banners.length > 1}
        pagination={{ 
          clickable: true,
          bulletClass: 'news-bullet',
          bulletActiveClass: 'news-bullet-active'
        }}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative overflow-hidden">
            
            {/* 🟢 Background Image với lớp phủ Brand Color */}
            <div className="absolute inset-0">
              <img 
                src={getImageUrl(banner.image)} 
                alt={banner.name} 
                className="w-full h-full object-cover" 
              />
              {/* Lớp phủ Gradient Navy sang trọng theo phong cách cao cấp */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e2188] via-[#0e2188]/60 to-transparent"></div>
            </div>

            {/* 🔴 CONTENT - Layout dạt trái kịch khung */}
            <div className="relative h-full w-full flex items-center">
              <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                <div className="max-w-4xl space-y-8">
                  {/* Label phong cách Armenia Travel: Chữ mảnh, tracking rộng */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-[#e33127]"></span>
                    <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase">
                      {banner.name}
                    </span>
                  </div>
                  
                  {/* Tiêu đề tin tức: Bold, Uppercase, Hùng hồn */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[1.1] tracking-tighter">
                    {banner.description || 'TIN TỨC & SỰ KIỆN'}
                  </h1>

                  {/* Mô tả ngắn: Tinh tế với border đặc trưng */}
                  <div className="max-w-xl border-l-4 border-[#e33127] pl-8">
                    <p className="text-zinc-300 text-lg md:text-xl font-medium leading-relaxed italic opacity-90">
                      Cập nhật những diễn biến mới nhất về <br/> 
                      thị trường thép và công nghệ xây dựng.
                    </p>
                  </div>

                  {/* 🔘 Nhóm nút hành động */}
                  <div className="flex flex-wrap gap-6 pt-6">
                    <Link href={banner.link || '#'}>
                      <button className="bg-[#e33127] text-white px-12 py-5 font-bold uppercase text-[11px] tracking-[0.2em] rounded-sm transition-all hover:bg-white hover:text-[#0e2188] shadow-xl shadow-black/20">
                        XEM CHI TIẾT
                      </button>
                    </Link>

                    <Link href="/contact">
                      <button className="border border-white/30 text-white px-12 py-5 font-bold uppercase text-[11px] tracking-[0.2em] rounded-sm transition-all hover:bg-white hover:text-[#0e2188] backdrop-blur-sm">
                        NHẬN BÁO GIÁ
                      </button>
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Text Bottom Right */}
      <div className="absolute bottom-12 right-12 hidden xl:block pointer-events-none z-10 select-none">
        <p className="text-white/5 font-bold text-8xl tracking-tighter uppercase">
          TNL_UPDATES
        </p>
      </div>

      <style jsx global>{`
        .news-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.3);
          display: inline-block;
          margin: 0 6px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .news-bullet-active {
          background: #e33127;
          transform: scale(1.5);
        }
        .swiper-pagination {
          bottom: 40px !important;
          text-align: left !important;
          padding-left: 6rem !important;
        }
        @media (max-width: 768px) {
          .swiper-pagination { padding-left: 2rem !important; }
        }
      `}</style>
    </section>
  );
}