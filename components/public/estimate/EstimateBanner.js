'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Container from '../ui/Container';
import Link from 'next/link';

// Triệu hồi động cơ Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function EstimateBanner() {
  const { banners, loading } = usePublicBanners('estimate');

  // CHỈ EARLY RETURN KHI ĐANG LOAD DỮ LIỆU.
  if (loading) return (
    <div
      className="h-[75vh] min-h-[600px] w-full animate-pulse"
      style={{ background: 'linear-gradient(135deg, #0e2188 0%, #e33127 85%, #4a0000 100%)' }}
    />
  );

  // Fallback data static mặc định khi không bốc được data động (tránh trống trang)
  const defaultBannerContent = {
    id: 'static-estimate-banner',
    name: 'TÍNH DỰ TOÁN NHANH',
    description: 'HỆ THỐNG BÁO GIÁ CHI PHÍ NHÀ THÉP TIỀN CHẾ CHUẨN XÁC VÀ TỐI ƯU NHẤT',
    image: '/static/banners/estimate_default.jpg',
    link: '/estimate'
  };

  // Xác định danh sách sẽ hiển thị thực tế: data động hoặc data tĩnh fallback
  const displayList = banners && banners.length > 0 ? banners : [defaultBannerContent];

  return (
    <section
      className="relative h-[75vh] min-h-[600px] w-full overflow-hidden font-sans"
      style={{ background: 'linear-gradient(135deg, #0e2188 0%, #e33127 85%, #4a0000 100%)' }}
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop={displayList.length > 1}
        pagination={{
          clickable: true,
          bulletClass: 'estimate-bullet',
          bulletActiveClass: 'estimate-bullet-active'
        }}
        className="h-full w-full"
      >
        {displayList.map((banner) => (
          <SwiperSlide key={banner.id} className="relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={getImageUrl(banner.image)}
                alt={banner.name}
                className="w-full h-full object-cover"
              />
              {/* Lớp phủ Gradient đồng bộ */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(14,33,136,0.85) 0%, rgba(227,49,39,0.65) 85%, rgba(74,0,0,0.8) 100%)'
                }}
              ></div>
            </div>

            {/* CONTENT - dạt trái */}
            <div className="relative z-10 h-full w-full flex items-center">
              <Container className="!mx-0 !max-w-none !pl-6 md:!pl-16 lg:!pl-24">
                <div className="max-w-4xl space-y-8">
                  {/* Tag nhỏ dùng banner.name */}
                  <div className="flex items-center gap-4">
                    <span className="w-12 h-[2px] bg-[#e33127]"></span>
                    <span className="text-[#e33127] font-bold text-xs tracking-[0.4em] uppercase drop-shadow-md">
                      {banner.name}
                    </span>
                  </div>

                  {/* Heading chính dùng banner.description */}
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white uppercase leading-[1.1] tracking-tighter drop-shadow-lg">
                    {banner.description || 'TÍNH DỰ TOÁN NHANH'}
                  </h1>

                  {/* Mô tả ngắn */}
                  <div className="max-w-xl border-l-4 border-[#e33127] pl-8">
                    <p className="text-zinc-200 text-lg md:text-xl font-medium leading-relaxed italic opacity-90">
                      Công cụ tính toán chi phí xây dựng <br />
                      nhà thép tiền chế nhanh chóng, chính xác.
                    </p>
                  </div>

                  {/* Buttons */}
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
          ESTIMATE
        </p>
      </div>

      {/* Custom pagination bullets */}
      <style jsx global>{`
        .estimate-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.4);
          display: inline-block;
          margin: 0 6px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .estimate-bullet-active {
          background: #e33127;
          transform: scale(1.5);
        }
        .swiper-pagination {
          bottom: 40px !important;
          text-align: left !important;
          padding-left: 6rem !important;
          z-index: 20 !important;
        }
        @media (max-width: 768px) {
          .swiper-pagination { padding-left: 2rem !important; }
        }
      `}</style>
    </section>
  );
}