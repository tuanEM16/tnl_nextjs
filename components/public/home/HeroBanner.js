'use client';
import { usePublicBanners } from '@/hooks/public/usePublicBanners';
import { getImageUrl } from '@/lib/utils';
import Button from '../ui/Button';
import Container from '../ui/Container';
import Link from 'next/link';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function HeroBanner() {
  const { banners, loading } = usePublicBanners('home');

  if (loading || banners.length === 0) return <div className="h-[85vh] bg-black animate-pulse" />;

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full bg-black overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id} className="relative overflow-hidden bg-black">
            
            {/* 🟢 Background Image */}
            <div className="absolute inset-0">
              <img 
                src={getImageUrl(banner.image)} 
                alt={banner.name} 
                className="w-full h-full object-cover opacity-80" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
            </div>

            {/* 🔴 Content Overlay - ÉP SANG TRÁI MAX TẦM */}
            <div className="relative h-full w-full flex items-center justify-start">
              {/* 🟢 Siết Container: !mx-0 và !max-w-none để dạt sát lề trái */}
              <Container className="!mx-0 !max-w-none !pl-5 md:!pl-16 lg:!pl-24">
                <div className="max-w-4xl space-y-8 text-left">
                  
                  {/* Nhãn nhãn dán */}
                  <div className="inline-block bg-orange-600 text-white px-4 py-2 font-black text-xs tracking-[0.4em] uppercase shadow-[4px_4px_0_0_#fff]">
                    // {banner.name}
                  </div>
                  
                  {/* Tiêu đề - Tăng leading-tight để bảo vệ dấu tiếng Việt */}
                  <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase leading-tight tracking-tighter drop-shadow-2xl">
                    {banner.description || 'Cung cấp thép Công trình uy tín'}
                  </h1>

                  <p className="text-gray-200 font-bold text-lg max-w-xl leading-relaxed border-l-4 border-orange-600 pl-6 uppercase italic">
                    Chuyên cung ứng thép xây dựng chất lượng cao <br/> cho mọi công trình tại Tây Ninh.
                  </p>

                  <div className="flex flex-wrap gap-6 pt-4">
                    {/* 🟢 Nút này Admin nhập link nào nó chạy đi link đó */}
                    <Link href={banner.link || '#'}>
                      <Button variant="primary" className="!px-12 !py-6 font-black uppercase italic shadow-[6px_6px_0_0_#000]">
                        XEM CHI TIẾT
                      </Button>
                    </Link>
                    
                    <Link href="/contact">
                      <Button variant="outline" className="!border-white !text-white hover:!bg-white hover:!text-black !px-12 !py-6 font-black uppercase italic shadow-[6px_6px_0_0_#ea580c]">
                        Báo giá ngay
                      </Button>
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 z-10 hidden lg:block pointer-events-none">
        <div className="border-4 border-white/10 p-10 backdrop-blur-sm">
          <p className="text-white font-black text-6xl italic opacity-10 tracking-tighter uppercase">
            TNL_STEEL_CORE
          </p>
        </div>
      </div>
    </section>
  );
}